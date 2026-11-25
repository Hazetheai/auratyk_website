const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const { notion, DATABASES } = require('./notion-config')
const { blocksToHtml } = require('./notion-block-to-html')
const { normalizeDropboxUrl, pathname } = require('./dropbox-url')

const OUTPUT_DIR = path.resolve(__dirname, '..', 'content', 'notion')
const IMAGES_DIR = path.resolve(__dirname, '..', 'static', 'images', 'notion')

// NOTION_INCLUDE_DRAFTS=1 also fetches unpublished entries, for local preview only.
// Re-run the normal fetch before committing, or drafts end up in content/notion.
const INCLUDE_DRAFTS = process.env.NOTION_INCLUDE_DRAFTS === '1'

async function queryDatabase(databaseId) {
  const results = []
  let cursor = undefined
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      ...(INCLUDE_DRAFTS ? {} : { filter: { property: 'Published', checkbox: { equals: true } } }),
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
    for (const block of response.results) {
      if (block.has_children) {
        block.children = await fetchPageBlocks(block.id)
      }
    }
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
    case 'number':
      return prop.number
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


// Project Links: JSON [{platform, url}], or one URL per line (platform is
// taken from the hostname, e.g. "ceangailte.ie").
function parseLinks(value) {
  if (!value) return []
  const json = parseJsonField(value)
  if (json.length) return json
  return String(value)
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((raw) => {
      const url = /^https?:\/\//.test(raw) ? raw : `https://${raw}`
      let platform = raw
      try {
        platform = new URL(url).hostname.replace(/^www\./, '')
      } catch {}
      return { platform, url }
    })
}

// Downloads to a temp file and renames on success, so a failed download never
// wipes out a good copy from an earlier fetch.
function downloadOnce(url, destPath) {
  return new Promise((resolve, reject) => {
    const tmpPath = `${destPath}.part`
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400) {
        response.resume()
        const next = new URL(response.headers.location, url).toString()
        return downloadOnce(next, destPath).then(resolve).catch(reject)
      }
      if (response.statusCode !== 200) {
        response.resume()
        return reject(new Error(`HTTP ${response.statusCode}`))
      }
      const file = fs.createWriteStream(tmpPath)
      response.pipe(file)
      file.on('finish', () => {
        file.close(() => fs.rename(tmpPath, destPath, (err) => (err ? reject(err) : resolve())))
      })
      file.on('error', (err) => { fs.unlink(tmpPath, () => {}); reject(err) })
    })
    req.setTimeout(60000, () => req.destroy(new Error('timeout')))
    req.on('error', (err) => { fs.unlink(tmpPath, () => {}); reject(err) })
  })
}

async function downloadFile(url, destPath, attempts = 3) {
  for (let i = 1; ; i++) {
    try {
      return await downloadOnce(url, destPath)
    } catch (err) {
      if (i >= attempts) throw new Error(err.message || err.code || String(err))
      await new Promise((resolve) => setTimeout(resolve, 1000 * i))
    }
  }
}

// Pages show a lighter copy of each image (max 1600px wide); the lightbox
// loads the full file from data-full. Uses sharp when available.
const PAGE_IMAGE_WIDTH = 1600
let sharp = null
try { sharp = require('sharp') } catch (e) { sharp = null }

async function makePageCopy(fullPath, filename, dir = IMAGES_DIR) {
  if (!sharp || !/\.(jpe?g|png|webp)$/i.test(filename)) return null
  const smName = filename.replace(/\.(\w+)$/, '-sm.$1')
  const smPath = path.join(dir, smName)
  try {
    const meta = await sharp(fullPath).metadata()
    if (!meta.width || meta.width <= PAGE_IMAGE_WIDTH) return null
    if (!fs.existsSync(smPath)) {
      await sharp(fullPath).rotate().resize({ width: PAGE_IMAGE_WIDTH }).toFile(smPath)
    }
    return smName
  } catch (err) {
    console.error(`    ✗ failed to resize: ${filename} (${err.message})`)
    return null
  }
}

// Point <img src> at the light copy (if any) and data-full at the original.
function swapImageUrl(html, url, filename, smName) {
  const full = `/images/notion/${filename}`
  if (smName) {
    html = html.replaceAll(`<img src="${url}"`, `<img src="/images/notion/${smName}" data-full="${full}"`)
  }
  return html.replaceAll(url, full)
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
    const ext = (pathOnly.match(/\.(png|jpe?g|gif|webp|svg|mp4|webm|mov)$/i)?.[1] || 'png').toLowerCase()
    const filename = `${hash}.${ext}`
    const destPath = path.join(IMAGES_DIR, filename)

    // Same Notion file path → same hash, so an existing copy is reused.
    if (!fs.existsSync(destPath)) {
      try {
        await downloadFile(url, destPath)
        console.log(`    ↓ downloaded notion image: ${filename}`)
      } catch (err) {
        console.error(`    ✗ failed to download: ${filename} (${err.message})`)
        continue
      }
    }
    html = swapImageUrl(html, url, filename, await makePageCopy(destPath, filename))
  }

  // Dropbox-hosted images: download once into static/ so the site serves them itself.
  const dropboxImgRegex = /<img src="(https:\/\/[^"]*dropbox(?:usercontent)?\.com[^"]*)"/g
  const dropboxUrls = [...new Set([...html.matchAll(dropboxImgRegex)].map((m) => m[1]))]

  for (const url of dropboxUrls) {
    const filePath = pathname(url)
    const hash = require('crypto').createHash('md5').update(filePath).digest('hex').substring(0, 8)
    const ext = (filePath.match(/\.(png|jpe?g|gif|webp|avif|svg)$/i)?.[1] || 'jpg').toLowerCase()
    const filename = `dbx-${hash}.${ext}`
    const destPath = path.join(IMAGES_DIR, filename)

    if (!fs.existsSync(destPath)) {
      try {
        await downloadFile(normalizeDropboxUrl(url), destPath)
        console.log(`    ↓ downloaded dropbox image: ${filename}`)
      } catch (err) {
        console.error(`    ✗ failed to download dropbox image: ${filename} (${err.message})`)
        continue
      }
    }
    html = swapImageUrl(html, url, filename, await makePageCopy(destPath, filename))
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
          links: parseLinks(getPropertyValue(props, 'Links')),
          tags: getPropertyValue(props, 'Tags') || [],
          isExperiment: getPropertyValue(props, 'IsExperiment') || false,
          collaborators: parseNewlineList(getPropertyValue(props, 'Collaborators')),
          press: getPropertyValue(props, 'Press') || false,
          pressCaption: getPropertyValue(props, 'PressCaption'),
          pressText: getPropertyValue(props, 'PressText'),
        }
        break
      case 'shows':
        entry.properties = {
          venueAddress: getPropertyValue(props, 'VenueAddress'),
          country: getPropertyValue(props, 'Country'),
          date: getPropertyValue(props, 'Date'),
          dateEnd: props.Date?.date?.end || null,
          ticketLink: getPropertyValue(props, 'TicketLink'),
          city: getPropertyValue(props, 'City'),
          participants: getPropertyValue(props, 'Participants'),
          showType: getPropertyValue(props, 'ShowType'),
          showUrl: getPropertyValue(props, 'Show URL'),
          projects: getPropertyValue(props, 'Projects') || [],
          coverUrl: getCoverUrl(props, 'CoverImage'),
          event: getPropertyValue(props, 'Event'),
          curatedBy: getPropertyValue(props, 'CuratedBy'),
          lineup: getPropertyValue(props, 'Lineup'),
          duration: getPropertyValue(props, 'Duration'),
          tools: getPropertyValue(props, 'Tools'),
          credits: getPropertyValue(props, 'Credits'),
          press: getPropertyValue(props, 'Press') || false,
          pressLabel: getPropertyValue(props, 'PressLabel'),
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

// Press photos (auratyk.com/press). Each row: Image (Dropbox share link or a
// site path like /press/img/x.jpg), Caption, Credit, Alt, Hero, Order.
// Dropbox images are downloaded into static/images/press; every image gets a
// lighter -sm copy for the grid, the full file opens in the lightbox.
const STATIC_DIR = path.resolve(__dirname, '..', 'static')
const PRESS_IMAGES_DIR = path.join(STATIC_DIR, 'images', 'press')
const PRESS_FULL_WIDTH = 2400

async function pressImage(url) {
  if (!url) return null
  let fullPath
  let publicDir
  let filename
  if (url.startsWith('/')) {
    fullPath = path.join(STATIC_DIR, url)
    if (!fs.existsSync(fullPath)) {
      console.error(`    ✗ press image not found: ${url}`)
      return null
    }
    publicDir = path.dirname(url)
    filename = path.basename(url)
  } else {
    fs.mkdirSync(PRESS_IMAGES_DIR, { recursive: true })
    const filePath = pathname(url)
    const hash = require('crypto').createHash('md5').update(filePath).digest('hex').substring(0, 8)
    const ext = (filePath.match(/\.(png|jpe?g|webp)$/i)?.[1] || 'jpg').toLowerCase()
    filename = `dbx-${hash}.${ext}`
    fullPath = path.join(PRESS_IMAGES_DIR, filename)
    publicDir = '/images/press'
    if (!fs.existsSync(fullPath)) {
      try {
        await downloadFile(normalizeDropboxUrl(url), fullPath)
        // Camera originals are huge; keep a 2400px version on the site.
        if (sharp) {
          const meta = await sharp(fullPath).metadata()
          if (meta.width > PRESS_FULL_WIDTH || meta.height > PRESS_FULL_WIDTH) {
            const buf = await sharp(fullPath).rotate()
              .resize({ width: PRESS_FULL_WIDTH, height: PRESS_FULL_WIDTH, fit: 'inside' })
              .jpeg({ quality: 84 }).toBuffer()
            fs.writeFileSync(fullPath, buf)
          }
        }
        console.log(`    ↓ downloaded press image: ${filename}`)
      } catch (err) {
        console.error(`    ✗ failed to download press image: ${url} (${err.message})`)
        return null
      }
    }
  }
  const smName = await makePageCopy(fullPath, filename, path.dirname(fullPath))
  let width = null
  let height = null
  if (sharp) {
    try {
      const meta = await sharp(fullPath).metadata()
      width = meta.width
      height = meta.height
    } catch {}
  }
  return {
    src: `${publicDir}/${smName || filename}`,
    full: `${publicDir}/${filename}`,
    width,
    height,
  }
}

async function fetchPress(databaseId) {
  const rows = await queryDatabase(databaseId)
  const items = []
  for (const row of rows) {
    const props = row.properties
    const image = await pressImage(getPropertyValue(props, 'Image'))
    if (!image) continue
    items.push({
      id: row.id,
      caption: getPropertyValue(props, 'Caption') || '',
      credit: getPropertyValue(props, 'Credit') || '',
      alt: getPropertyValue(props, 'Alt') || getPropertyValue(props, 'Caption') || '',
      hero: getPropertyValue(props, 'Hero') || false,
      order: getPropertyValue(props, 'Order') ?? 999,
      ...image,
    })
  }
  items.sort((a, b) => a.order - b.order)
  console.log(`  → ${items.length} press photos fetched`)
  return items
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
    { type: 'press', dbKey: 'press' },
  ]

  for (const { type, dbKey } of contentTypes) {
    const databaseId = DATABASES[dbKey]
    if (!databaseId) {
      console.warn(`  ⚠ No database ID for ${type}, skipping`)
      continue
    }
    try {
      const data =
        type === 'press'
          ? await fetchPress(databaseId)
          : await fetchContentType(type, databaseId)
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
