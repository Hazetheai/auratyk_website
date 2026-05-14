const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const { notion, DATABASES } = require('./notion-config')
const { blocksToHtml } = require('./notion-block-to-html')

const OUTPUT_DIR = path.resolve(__dirname, '..', 'content', 'notion')
const IMAGES_DIR = path.resolve(__dirname, '..', 'static', 'images', 'notion')

async function queryDatabase(databaseId) {
  const results = []
  let cursor = undefined
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      filter: { property: 'Published', checkbox: { equals: true } },
    })
    results.push(...response.results)
    cursor = response.next_cursor || undefined
  } while (cursor)
  return results
}

async function fetchPageBlocks(pageId) {
  const results = []
  let cursor = undefined
  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    })
    results.push(...response.results)
    cursor = response.next_cursor || undefined
  } while (cursor)
  return results
}

function getPropertyValue(properties, name) {
  const prop = properties[name]
  if (!prop) return null

  switch (prop.type) {
    case 'title':
      return prop.title.map((t) => t.plain_text).join('')
    case 'rich_text':
      return prop.rich_text.map((t) => t.plain_text).join('')
    case 'select':
      return prop.select?.name || null
    case 'multi_select':
      return prop.multi_select.map((s) => s.name)
    case 'date':
      return prop.date?.start || null
    case 'url':
      return prop.url || null
    case 'checkbox':
      return prop.checkbox
    case 'files':
      return prop.files
        .map((f) => (f.type === 'external' ? f.external.url : f.file?.url))
        .filter(Boolean)
    case 'relation':
      return prop.relation.map(r => r.id)
    default:
      return null
  }
}

function normalizeDropboxUrl(url) {
  if (!url || !url.includes('dropbox.com')) return url
  return url
    .replace(/[?&]dl=0/, (m) => m.startsWith('?') ? '?raw=1' : '&raw=1')
    .replace(/[?&]dl=1/, (m) => m.startsWith('?') ? '?raw=1' : '&raw=1')
}

function getCoverUrl(props, name) {
  const prop = props[name]
  if (!prop) return null
  if (prop.type === 'files') {
    const urls = prop.files
      .map((f) => (f.type === 'external' ? f.external.url : f.file?.url))
      .filter(Boolean)
    return urls[0] ? normalizeDropboxUrl(urls[0]) : null
  }
  if (prop.type === 'url') {
    return normalizeDropboxUrl(prop.url || null)
  }
  return null
}

function parseNewlineList(value) {
  if (!value) return []
  return value.split('\n').map(s => s.trim()).filter(Boolean)
}

function parseJsonField(value) {
  if (!value) return []
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

function parseNewlineList(value) {
  if (!value) return []
  return value.split('\n').map(s => s.trim()).filter(Boolean)
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath)
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400) {
        file.close()
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject)
      }
      response.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', (err) => { fs.unlink(destPath, () => {}); reject(err) })
  })
}

async function downloadAndReplaceNotionImages(html) {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
  }
  const notionS3Regex = /https:\/\/prod-files-secure\.s3\.[^"'\s]+/g
  const urls = html.match(notionS3Regex) || []
  const uniqueUrls = [...new Set(urls)]

  for (const url of uniqueUrls) {
    const pathOnly = url.split('?')[0]
    const hash = require('crypto').createHash('md5').update(pathOnly).digest('hex').substring(0, 8)
    const ext = url.match(/\.(png|jpg|jpeg|gif|webp|svg)/i)?.[1] || 'png'
    const filename = `${hash}.${ext}`
    const destPath = path.join(IMAGES_DIR, filename)

    if (!fs.existsSync(destPath)) {
      try {
        await downloadFile(url, destPath)
        console.log(`    ↓ downloaded notion image: ${filename}`)
      } catch (err) {
        console.error(`    ✗ failed to download: ${filename} (${err.message})`)
        continue
      }
    }
    html = html.replaceAll(url, `/images/notion/${filename}`)
  }
  return html
}
function parseRichTextLinks(props, name) {
  const prop = props[name]
  if (!prop || prop.type !== 'rich_text') return []
  return prop.rich_text
    .filter(t => t.href)
    .map(t => ({
      platform: t.plain_text.trim(),
      url: t.href,
    }))
}

async function fetchContentType(type, databaseId) {
  console.log(`Fetching ${type}...`)
  const items = await queryDatabase(databaseId)
  const results = []

  for (const item of items) {
    const props = item.properties
    const slug = getPropertyValue(props, 'Slug')
    if (!slug) continue

    const blocks = await fetchPageBlocks(item.id)
    const bodyHtml = await downloadAndReplaceNotionImages(blocksToHtml(blocks))

    const entry = {
      id: item.id,
      title:
        getPropertyValue(props, 'Title') ||
        getPropertyValue(props, 'Name') ||
        getPropertyValue(props, 'Venue') ||
        slug,
      slug,
      description: getPropertyValue(props, 'Description'),
      bodyHtml,
      properties: {},
    }

    switch (type) {
      case 'releases':
        entry.properties = {
          type: getPropertyValue(props, 'Type'),
          date: getPropertyValue(props, 'Date'),
          coverUrl: getCoverUrl(props, 'CoverImage'),
          buyLink: getPropertyValue(props, 'BuyLink'),
          preSaveLinks: parseRichTextLinks(props, 'PreSaveLinks'),
          streamLinks: parseRichTextLinks(props, 'StreamLinks'),
          mediums: getPropertyValue(props, 'Mediums') || [],
        }
        break
      case 'projects':
        entry.properties = {
          date: getPropertyValue(props, 'Date'),
          coverUrl: getCoverUrl(props, 'CoverImage'),
          links: parseJsonField(getPropertyValue(props, 'Links')),
          tags: getPropertyValue(props, 'Tags') || [],
          isExperiment: getPropertyValue(props, 'IsExperiment') || false,
          collaborators: parseNewlineList(getPropertyValue(props, 'Collaborators')),
        }
        break
      case 'shows':
        entry.properties = {
          venueAddress: getPropertyValue(props, 'VenueAddress'),
          country: getPropertyValue(props, 'Country'),
          date: getPropertyValue(props, 'Date'),
          ticketLink: getPropertyValue(props, 'TicketLink'),
          city: getPropertyValue(props, 'City'),
          participants: getPropertyValue(props, 'Participants'),
          showType: getPropertyValue(props, 'ShowType'),
          showUrl: getPropertyValue(props, 'Show URL'),
          projects: getPropertyValue(props, 'Projects') || [],
          coverUrl: getCoverUrl(props, 'CoverImage'),
        }
        break
      case 'pages':
        entry.properties = {
          coverUrl: getCoverUrl(props, 'CoverImage'),
        }
        break
    }

    results.push(entry)
  }

  console.log(`  → ${results.length} ${type} fetched`)
  return results
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const contentTypes = [
    { type: 'pages', dbKey: 'pages' },
    { type: 'releases', dbKey: 'releases' },
    { type: 'projects', dbKey: 'projects' },
    { type: 'shows', dbKey: 'shows' },
  ]

  for (const { type, dbKey } of contentTypes) {
    const databaseId = DATABASES[dbKey]
    if (!databaseId) {
      console.warn(`  ⚠ No database ID for ${type}, skipping`)
      continue
    }
    try {
      const data = await fetchContentType(type, databaseId)
      const output = { fetchedAt: new Date().toISOString(), items: data }
      fs.writeFileSync(
        path.join(OUTPUT_DIR, `${type}.json`),
        JSON.stringify(output, null, 2)
      )
    } catch (err) {
      console.error(`  ✗ Error fetching ${type}:`, err.message)
    }
  }

  console.log('Done.')
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

module.exports = { main }
