const fs = require('fs')
const path = require('path')
const { notion, DATABASES } = require('./notion-config')
const { blocksToHtml } = require('./notion-block-to-html')

const OUTPUT_DIR = path.resolve(__dirname, '..', 'content', 'notion')

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
      return prop.title.map(t => t.plain_text).join('')
    case 'rich_text':
      return prop.rich_text.map(t => t.plain_text).join('')
    case 'select':
      return prop.select?.name || null
    case 'multi_select':
      return prop.multi_select.map(s => s.name)
    case 'date':
      return prop.date?.start || null
    case 'url':
      return prop.url || null
    case 'checkbox':
      return prop.checkbox
    case 'files':
      return prop.files.map(f => f.type === 'external' ? f.external.url : f.file?.url).filter(Boolean)
    default:
      return null
  }
}

function getCoverUrl(props, name) {
  const prop = props[name]
  if (!prop) return null
  if (prop.type === 'files') {
    const urls = prop.files.map(f => f.type === 'external' ? f.external.url : f.file?.url).filter(Boolean)
    return urls[0] || null
  }
  if (prop.type === 'url') {
    return prop.url || null
  }
  return null
}

function parseJsonField(value) {
  if (!value) return []
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
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
    const bodyHtml = blocksToHtml(blocks)

    const entry = {
      id: item.id,
      title: getPropertyValue(props, 'Title') || getPropertyValue(props, 'Name') || getPropertyValue(props, 'Venue') || slug,
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
          coverUrl: getCoverUrl(props, 'Cover'),
          buyLink: getPropertyValue(props, 'BuyLink'),
          preSaveLinks: parseJsonField(getPropertyValue(props, 'PreSaveLinks')),
          streamLinks: parseJsonField(getPropertyValue(props, 'StreamLinks')),
          tags: getPropertyValue(props, 'Tags') || [],
        }
        break
      case 'projects':
        entry.properties = {
          date: getPropertyValue(props, 'Date'),
          coverUrl: getCoverUrl(props, 'Cover'),
          links: parseJsonField(getPropertyValue(props, 'Links')),
          tags: getPropertyValue(props, 'Tags') || [],
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
      fs.writeFileSync(path.join(OUTPUT_DIR, `${type}.json`), JSON.stringify(output, null, 2))
    } catch (err) {
      console.error(`  ✗ Error fetching ${type}:`, err.message)
    }
  }

  console.log('Done.')
}

if (require.main === module) {
  main().catch(err => {
    console.error(err)
    process.exit(1)
  })
}

module.exports = { main }
