# Notion CMS & Code Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace local JSON/hardcoded content with build-time Notion API fetching, add projects content type, clean up dead code and duplication. No visual changes.

**Architecture:** A `scripts/fetch-notion.js` build script queries the Notion API during `nuxt generate`, converts blocks to HTML, and writes structured JSON to `content/notion/`. Pages import this JSON directly. A catch-all `_slug.vue` renders generic page content.

**Tech Stack:** Nuxt 2, @notionhq/client, Notion databases as CMS

---

### Task 1: Install @notionhq/client and create API config

**Files:**
- Modify: `package.json`
- Create: `scripts/notion-config.js`
- Modify: `.env`

- [ ] **Step 1: Install @notionhq/client**

Run: `npm install --save-dev @notionhq/client`

- [ ] **Step 2: Create notion-config.js**

```javascript
require('dotenv').config({ path: '.env' })

const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_API_KEY })

const DATABASES = {
  pages: process.env.NOTION_DB_PAGES,
  releases: process.env.NOTION_DB_RELEASES,
  projects: process.env.NOTION_DB_PROJECTS,
  shows: process.env.NOTION_DB_SHOWS,
}

module.exports = { notion, DATABASES }
```

- [ ] **Step 3: Add Notion env vars to `.env`**

Append to existing `.env`:
```
NOTION_API_KEY=your_notion_integration_token_here
NOTION_DB_PAGES=your_pages_database_id_here
NOTION_DB_RELEASES=your_releases_database_id_here
NOTION_DB_PROJECTS=your_projects_database_id_here
NOTION_DB_SHOWS=your_shows_database_id_here
```

- [ ] **Step 4: Add .env to module.exports in nuxt.config.js**

In `nuxt.config.js`, add `NOTION_API_KEY` and `NOTION_DB_*` to the `publicRuntimeConfig` or `privateRuntimeConfig` if needed. Actually, since fetch happens at build time via a Node script (not in the browser), env vars are read directly from `process.env` — no Nuxt config needed for these.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json scripts/notion-config.js .env
git commit -m "chore: add @notionhq/client and notion config setup"
```

---

### Task 2: Create the Notion database fetcher

**Files:**
- Create: `scripts/fetch-notion.js`
- Create: `scripts/notion-block-to-html.js`

- [ ] **Step 1: Create notion-block-to-html.js**

This converts Notion block objects to HTML strings.

```javascript
const { textToHtml } = require('./notion-richtext-to-html')

function blockToHtml(block) {
  switch (block.type) {
    case 'paragraph':
      return `<p>${textToHtml(block.paragraph.rich_text)}</p>`
    case 'heading_1':
      return `<h1>${textToHtml(block.heading_1.rich_text)}</h1>`
    case 'heading_2':
      return `<h2>${textToHtml(block.heading_2.rich_text)}</h2>`
    case 'heading_3':
      return `<h3>${textToHtml(block.heading_3.rich_text)}</h3>`
    case 'bulleted_list_item':
      return `<li>${textToHtml(block.bulleted_list_item.rich_text)}</li>`
    case 'numbered_list_item':
      return `<li>${textToHtml(block.numbered_list_item.rich_text)}</li>`
    case 'to_do':
      return `<div class="todo">${textToHtml(block.to_do.rich_text)}</div>`
    case 'toggle':
      return `<details><summary>${textToHtml(block.toggle.rich_text)}</summary></details>`
    case 'code':
      return `<pre><code class="language-${block.code.language}">${textToHtml(block.code.rich_text)}</code></pre>`
    case 'quote':
      return `<blockquote>${textToHtml(block.quote.rich_text)}</blockquote>`
    case 'divider':
      return `<hr>`
    case 'image':
      return block.image.type === 'external'
        ? `<figure><img src="${block.image.external.url}" alt="${block.image.caption?.[0]?.plain_text || ''}" /></figure>`
        : `<figure><img src="${block.image.file.url}" alt="${block.image.caption?.[0]?.plain_text || ''}" /></figure>`
    case 'callout':
      return `<div class="callout">${block.callout.icon?.emoji || ''} ${textToHtml(block.callout.rich_text)}</div>`
    case 'child_page':
      return ''
    default:
      return ''
  }
}

function blocksToHtml(blocks, listAccumulator = { type: null, items: [] }) {
  let html = ''

  for (const block of blocks) {
    if (block.has_children && block.children) {
      block[block.type].children = blocksToHtml(block.children)
    }

    const type = block.type
    const isList = ['bulleted_list_item', 'numbered_list_item'].includes(type)

    if (isList) {
      if (listAccumulator.type !== type) {
        if (listAccumulator.items.length > 0) {
          const tag = listAccumulator.type === 'bulleted_list_item' ? 'ul' : 'ol'
          html += `<${tag}>${listAccumulator.items.join('')}</${tag}>`
          listAccumulator.items = []
        }
        listAccumulator.type = type
      }
      listAccumulator.items.push(blockToHtml(block))
    } else {
      if (listAccumulator.items.length > 0) {
        const tag = listAccumulator.type === 'bulleted_list_item' ? 'ul' : 'ol'
        html += `<${tag}>${listAccumulator.items.join('')}</${tag}>`
        listAccumulator.items = []
        listAccumulator.type = null
      }
      html += blockToHtml(block)
    }
  }

  if (listAccumulator.items.length > 0) {
    const tag = listAccumulator.type === 'bulleted_list_item' ? 'ul' : 'ol'
    html += `<${tag}>${listAccumulator.items.join('')}</${tag}>`
    listAccumulator.items = []
    listAccumulator.type = null
  }

  return html
}

module.exports = { blockToHtml, blocksToHtml }
```

- [ ] **Step 2: Create notion-richtext-to-html.js**

```javascript
function textToHtml(richTextArray) {
  if (!richTextArray) return ''
  return richTextArray.map(text => {
    let content = text.plain_text || ''
    const { annotations } = text
    if (annotations?.bold) content = `<strong>${content}</strong>`
    if (annotations?.italic) content = `<em>${content}</em>`
    if (annotations?.strikethrough) content = `<s>${content}</s>`
    if (annotations?.underline) content = `<u>${content}</u>`
    if (annotations?.code) content = `<code>${content}</code>`
    if (text.href) content = `<a href="${text.href}" target="_blank" rel="noopener">${content}</a>`
    return content
  }).join('')
}

module.exports = { textToHtml }
```

- [ ] **Step 3: Create fetch-notion.js**

```javascript
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

    // Type-specific properties
    switch (type) {
      case 'releases':
        entry.properties = {
          type: getPropertyValue(props, 'Type'),
          date: getPropertyValue(props, 'Date'),
          coverUrl: getPropertyValue(props, 'Cover')?.[0] || null,
          buyLink: getPropertyValue(props, 'BuyLink'),
          preSaveLinks: parseJsonField(getPropertyValue(props, 'PreSaveLinks')),
          streamLinks: parseJsonField(getPropertyValue(props, 'StreamLinks')),
          tags: getPropertyValue(props, 'Tags') || [],
        }
        break
      case 'projects':
        entry.properties = {
          date: getPropertyValue(props, 'Date'),
          coverUrl: getPropertyValue(props, 'Cover')?.[0] || null,
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
```

- [ ] **Step 4: Commit**

```bash
git add scripts/notion-block-to-html.js scripts/notion-richtext-to-html.js scripts/fetch-notion.js
git commit -m "feat: add Notion build-time fetcher with block-to-HTML conversion"
```

---

### Task 3: Wire fetch-notion into nuxt generate

**Files:**
- Modify: `nuxt.config.js`

- [ ] **Step 1: Add generate hook in nuxt.config.js**

Find the `build` section of `nuxt.config.js` and add a `generate:before` hook or use the hooks config:

```javascript
// Add to module.exports:
hooks: {
  'generate:before': async () => {
    if (process.env.NOTION_API_KEY) {
      const { main } = require('./scripts/fetch-notion')
      await main()
    } else {
      console.warn('⏭ Skipping Notion fetch (NOTION_API_KEY not set)')
    }
  },
},
```

This runs `fetch-notion.js` before static generation, writing JSON files that pages import.

- [ ] **Step 2: Verify hook placement**

Look at the existing `nuxt.config.js` and confirm the hooks section doesn't conflict with anything. Place it after existing top-level keys.

- [ ] **Step 3: Commit**

```bash
git add nuxt.config.js
git commit -m "feat: run notion fetch before nuxt generate"
```

---

### Task 4: Create _slug.vue dynamic page route

**Files:**
- Create: `pages/_slug.vue`

- [ ] **Step 1: Create pages/_slug.vue**

This is a catch-all route that renders any page-type content from Notion.

```vue
<template>
  <div class="notion-page" v-if="page">
    <h1>{{ page.title }}</h1>
    <div v-html="page.bodyHtml" class="notion-body"></div>
  </div>
</template>

<script>
import pages from '@/content/notion/pages.json'

export default {
  layout() {
    return 'main'
  },
  data() {
    return {
      page: null,
    }
  },
  computed: {
    pageData() {
      return pages.items || []
    },
  },
  created() {
    this.page = this.pageData.find(
      p => p.slug === this.$route.params.slug
    ) || null
  },
  head() {
    if (!this.page) return {}
    return {
      title: `Auratyk | ${this.page.title}`,
      meta: [
        { hid: 'description', name: 'description', content: this.page.description || '' },
      ],
    }
  },
}
</script>

<style scoped>
.notion-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.notion-body >>> h1,
.notion-body >>> h2,
.notion-body >>> h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}
.notion-body >>> p {
  margin-bottom: 1em;
  line-height: 1.7;
}
.notion-body >>> ul,
.notion-body >>> ol {
  margin-bottom: 1em;
  padding-left: 1.5em;
}
.notion-body >>> a {
  color: var(--color-primary, inherit);
  text-decoration: underline;
}
.notion-body >>> img {
  max-width: 100%;
  height: auto;
}
.notion-body >>> blockquote {
  border-left: 3px solid currentColor;
  padding-left: 1em;
  margin: 1em 0;
  opacity: 0.8;
}
</style>
```

Note: The styling here is minimal placeholder. Since the user already has Notion-like CSS classes (notion-text, notion-sync-block etc.) from the old integration, we may want to reuse those instead. The actual styling should match whatever the old hardcoded Notion content looked like.

- [ ] **Step 2: Commit**

```bash
git add pages/_slug.vue
git commit -m "feat: add catch-all _slug.vue for Notion page content"
```

---

### Task 5: Set up Notion databases and migrate initial content

**This is a manual task — the user needs to create the databases in Notion.**

- [ ] **Step 1: Create Notion integration**

Go to https://www.notion.so/my-integrations and create an internal integration. Copy the API token.

- [ ] **Step 2: Create four databases in Notion**

Create databases matching the spec schema:

**Pages database:** Title, Slug (text), Description (text), Published (checkbox)
**Releases database:** Name (title), Slug (text), Type (select: EP/Album/Single), Date (date), Cover (files), BuyLink (url), PreSaveLinks (text), StreamLinks (text), Tags (multi-select), Published (checkbox)
**Projects database:** Name (title), Slug (text), Date (date), Tags (multi-select), Cover (files), Links (text), Published (checkbox)
**Shows database:** Venue (title), VenueAddress (text), Country (select), Date (date), TicketLink (url), Published (checkbox)

- [ ] **Step 3: Share each database with the integration**

In Notion, click Share on each database and add your integration. Copy each database's ID from the URL (the UUID in the URL path).

- [ ] **Step 4: Update .env with real values**

Replace the placeholder values in `.env` with the actual API key and database IDs.

- [ ] **Step 5: Populate content in Notion**

Migrate existing content:
- Pages: about, legal, site-info, collab, contact — copy the hardcoded content into Notion pages
- Shows: enter existing shows data
- Releases: enter existing releases data

- [ ] **Step 6: Test the fetch**

Run: `node scripts/fetch-notion.js`
Expected: Four JSON files created in `content/notion/` with the fetched data.

- [ ] **Step 7: Commit**

```bash
git add content/notion/ .env
git commit -m "feat: initial Notion content fetch with pages data"
```

---

### Task 6: Migrate pages to use Notion (about, legal, site-info, collab, contact, test-page)

Also delete `test-page.vue` — it was a Notion dev test page, now superseded by `_slug.vue`.

**Files:**
- Modify: `pages/about.vue`
- Modify: `pages/legal.vue`
- Modify: `pages/site-info.vue`
- Modify: `pages/collab.vue`
- Modify: `pages/contact.vue`

- [ ] **Step 1: Update about.vue to use Notion data**

Replace the entire page content with a redirect to the dynamic `_slug.vue` pattern. Or better: reduce each page to a thin wrapper that reads from `content/notion/pages.json` and renders bodyHtml.

Simplest approach: since `_slug.vue` handles `/:slug`, remove the explicit page files. But keep the route if it has special layout or components.

Let me check: the current `about.vue` has a custom structure with `SiteInfoComponent` and hardcoded HTML with notion CSS classes. After migration, if the bodyHtml from Notion produces the same HTML, we can just use `_slug.vue` for `/about`.

For `contact.vue` — it has `ContactComponent` with form. This should stay as a page (it's not purely content), or the form can be embedded in a Notion page's HTML. Since forms require interactivity, keep `contact.vue` but make it fetch its text content from Notion.

For `collab.vue` — same as contact, has `CollabComponent` with a form.

**Recommendation:** Delete `about.vue`, `legal.vue`, `site-info.vue` — their routes are handled by `_slug.vue`. Keep `contact.vue` and `collab.vue` as explicit pages (they have interactive forms) but pull descriptive text from Notion via a JSON import.

Replace `about.vue`:

```vue
<template>
  <div class="about-page">
    <div v-html="pageContent" class="notion-body"></div>
  </div>
</template>

<script>
import pages from '@/content/notion/pages.json'

export default {
  layout() { return 'main' },
  data() {
    return {
      pageContent: '',
    }
  },
  created() {
    const page = pages.items.find(p => p.slug === 'about')
    this.pageContent = page?.bodyHtml || ''
  },
  head() {
    return { title: 'Auratyk | About' }
  },
}
</script>
```

For `legal.vue`, same template/setup but:
- Change slug from `'about'` to `'legal'`
- Change head title to `'Auratyk | Legal'`
- The file content is identical structure, just different slug lookup.

For `site-info.vue`:
- Slug: `'site-info'`
- Head title: `'Auratyk | Site Info'`

- [ ] **Step 2: Update contact.vue**

Pull description text from Notion but keep the `ContactComponent` form:

```vue
<template>
  <div class="contact-page">
    <div v-html="description" class="notion-body"></div>
    <ContactComponent />
  </div>
</template>

<script>
import pages from '@/content/notion/pages.json'
import ContactComponent from '@/components/blocks/ContactComponent.vue'

export default {
  components: { ContactComponent },
  layout() { return 'main' },
  data() {
    const page = pages.items.find(p => p.slug === 'contact')
    return { description: page?.bodyHtml || '' }
  },
  head() {
    return { title: 'Auratyk | Contact' }
  },
}
</script>
```

- [ ] **Step 3: Update collab.vue**

Identical structure to contact.vue but:
- Import `CollabComponent` instead of `ContactComponent`
- Slug: `'collab'`
- Head title: `'Auratyk | Collab'`

- [ ] **Step 4: Commit**

```bash
git add pages/about.vue pages/legal.vue pages/site-info.vue pages/contact.vue pages/collab.vue pages/test-page.vue
git commit -m "feat: migrate about/legal/site-info/contact/collab to use Notion data, remove test-page"
```

---

### Task 7: Migrate releases to use Notion

**Files:**
- Modify: `pages/releases/index.vue`
- Modify: `pages/releases/form.vue`
- Modify: `components/blocks/ReleasesComponent.vue`
- Modify: `components/blocks/ReleaseComponent.vue`
- Modify: `components/blocks/EPKComponent.vue`
- Modify: `libs/content-handlers.js`

- [ ] **Step 1: Update releases index**

Replace the `import releaseInfo from '@/content/releases.json'` with `import releases from '@/content/notion/releases.json'` and use `releases.items`.

Update `handleStreamLinks` calls to use the new data structure (properties.streamLinks, properties.preSaveLinks, properties.date instead of the flat structure).

- [ ] **Step 2: Update releases/form.vue**

Same import swap. Map the new properties structure.

- [ ] **Step 3: Update content-handlers.js**

Update `handleStreamLinks` to work with the new Notion data structure:

```javascript
function handleStreamLinks(release) {
  const props = release.properties || release
  const releaseDate = props.date
  const streamLinks = props.streamLinks || []
  const preSaveLinks = props.preSaveLinks || []

  if (isOnOrAfterToday(releaseDate)) {
    return { ...release, streamLinks: preSaveLinks }
  }
  return { ...release, streamLinks }
}
```

- [ ] **Step 4: Update EPKComponent.vue**

Replace `import bio from '@/content/notion/bio'` with the new pages data.

- [ ] **Step 5: Commit**

```bash
git add pages/releases/ components/blocks/ReleasesComponent.vue components/blocks/ReleaseComponent.vue components/blocks/EPKComponent.vue libs/content-handlers.js
git commit -m "feat: migrate releases to use Notion data"
```

---

### Task 8: Migrate shows to use Notion

**Files:**
- Modify: `pages/shows.vue`
- Modify: `pages/past-shows.vue`
- Modify: `components/blocks/ShowsComponent.vue`

- [ ] **Step 1: Update shows.vue**

Replace hardcoded array with import from Notion:

```javascript
import shows from '@/content/notion/shows.json'

// In data/mounted:
const allShows = shows.items || []
const futureShows = allShows.filter(show => isOnOrAfterToday(show.properties.date))
```

- [ ] **Step 2: Update past-shows.vue**

Same pattern, filter for past shows.

- [ ] **Step 3: Update ShowsComponent.vue**

If it receives shows as props, ensure it handles the Notion data shape. The component likely accesses `show.venue`, `show.venueAddress`, etc. — now those would be `show.title`, `show.properties.venueAddress`, `show.properties.country`, `show.properties.date`, `show.properties.ticketLink`.

- [ ] **Step 4: Remove old JSON data files**

Delete `content/releases.json` and `content/toxes.json` — now fully replaced by Notion.

- [ ] **Step 5: Commit**

```bash
git add pages/shows.vue pages/past-shows.vue components/blocks/ShowsComponent.vue content/releases.json content/toxes.json
git commit -m "feat: migrate shows to use Notion, remove old JSON files"
```

---

### Task 9: Add projects content type

**Files:**
- Create: `pages/projects.vue`
- Create: `components/blocks/ProjectsComponent.vue`
- Create: `components/blocks/ProjectComponent.vue`
- Modify: `components/blocks/AuratykHomeSceneOverlay.vue` (add nav link)

- [ ] **Step 1: Create ProjectsComponent.vue**

A listing component similar to ReleasesComponent:

```vue
<template>
  <section class="projects">
    <div class="projects__inner">
      <h2 class="projects__title">Projects</h2>
      <div class="projects__grid">
        <div v-for="project in projects" :key="project.id" class="projects__item">
          <nuxt-link :to="`/projects/${project.slug}`">
            <h3>{{ project.title }}</h3>
            <p v-if="project.properties.date">{{ project.properties.date }}</p>
            <div v-if="project.properties.tags?.length" class="projects__tags">
              <span v-for="tag in project.properties.tags" :key="tag">{{ tag }}</span>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    projects: { type: Array, required: true },
  },
}
</script>
```

- [ ] **Step 2: Create ProjectComponent.vue**

Detail component rendering project content from Notion:

```vue
<template>
  <section class="project">
    <div class="project__inner">
      <h1 class="project__title">{{ project.title }}</h1>
      <div v-if="project.properties.date" class="project__date">{{ project.properties.date }}</div>
      <div v-if="project.properties.tags?.length" class="project__tags">
        <span v-for="tag in project.properties.tags" :key="tag" class="project__tag">{{ tag }}</span>
      </div>
      <div v-html="project.bodyHtml" class="project__body notion-body"></div>
      <div v-if="project.properties.links?.length" class="project__links">
        <a v-for="link in project.properties.links" :key="link.platform"
           :href="link.url" target="_blank" rel="noopener"
           class="project__link">{{ link.platform }}</a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    project: { type: Object, required: true },
  },
}
</script>
```

- [ ] **Step 3: Create pages/projects.vue**

Listing page that imports from Notion:

```vue
<template>
  <ProjectsComponent :projects="projects" />
</template>

<script>
import ProjectsComponent from '@/components/blocks/ProjectsComponent.vue'
import projectsData from '@/content/notion/projects.json'

export default {
  components: { ProjectsComponent },
  layout() { return 'main' },
  data() {
    return { projects: projectsData.items || [] }
  },
  head() {
    return { title: 'Auratyk | Projects' }
  },
}
</script>
```

- [ ] **Step 4: Create pages/projects/_slug.vue**

Dynamic project detail page:

```vue
<template>
  <ProjectComponent v-if="project" :project="project" />
  <div v-else>Project not found</div>
</template>

<script>
import ProjectComponent from '@/components/blocks/ProjectComponent.vue'
import projectsData from '@/content/notion/projects.json'

export default {
  components: { ProjectComponent },
  layout() { return 'main' },
  asyncData({ params }) {
    const project = (projectsData.items || []).find(p => p.slug === params.slug) || null
    return { project }
  },
  head() {
    return this.project
      ? { title: `Auratyk | ${this.project.title}` }
      : { title: 'Auratyk | Project Not Found' }
  },
}
</script>
```

- [ ] **Step 5: Add nav link (optional)**

If projects should appear in the site navigation, add a link in `AuratykHomeSceneOverlay.vue`.

- [ ] **Step 6: Commit**

```bash
git add pages/projects.vue pages/projects/_slug.vue components/blocks/ProjectsComponent.vue components/blocks/ProjectComponent.vue
git commit -m "feat: add projects content type from Notion"
```

---

### Task 10: Migrate EPK page and remove vue-notion

**Files:**
- Modify: `pages/form-epk.vue`
- Modify: `components/blocks/EPKComponent.vue`
- Modify: `nuxt.config.js`
- Modify: `package.json`

- [ ] **Step 1: Update EPKComponent.vue**

Replace `NotionRenderer` with rendering the HTML body from Notion data. Instead of using `vue-notion`'s `<NotionRenderer :blockMap="blocks" />`, render `v-html="bioBody"`.

The component currently receives `bioBlocks` (Notion block objects) and `pressBlocks`. Change it to receive `bioHtml` and `pressHtml` strings.

- [ ] **Step 2: Update form-epk.vue**

Remove the `asyncData` that calls `$notion.getPageBlocks()`. Instead, import from the cached JSON:

```javascript
import pages from '@/content/notion/pages.json'
import releases from '@/content/notion/releases.json'

// Find bio page and press release
const bioPage = pages.items.find(p => p.slug === 'bio')
const pressRelease = releases.items.find(r => r.slug === 'form-press')
```

- [ ] **Step 3: Remove vue-notion from nuxt.config.js**

Remove `'vue-notion/nuxt'` from `buildModules`.

- [ ] **Step 4: Remove vue-notion from package.json**

```bash
npm uninstall vue-notion
```

- [ ] **Step 5: Commit**

```bash
git add pages/form-epk.vue components/blocks/EPKComponent.vue nuxt.config.js package.json package-lock.json
git commit -m "feat: migrate EPK page from vue-notion to build-time HTML"
```

---

### Task 11: Clean up dead code

**Files:**
- Delete: `components/G-MainHeader-1.vue`
- Delete: `components/blocks/hero.vue`
- Delete: `components/blocks/title.vue`
- Delete: `components/blocks/images-grid.vue`
- Delete: `components/blocks/Modal.vue`
- Delete: duplicate `scroller.vue` (check which is used)
- Delete: `plugins/soundReactor.js`
- Delete: `content/hello.md`
- Delete: `content/notion/bio.json`
- Delete: `content/notion/releases.json`
- Modify: `nuxt.config.js` (remove commented-out plugin entries)

- [ ] **Step 1: Identify and remove unused components**

Check each candidate is truly unused by grepping for imports/references:

```bash
rg "G-MainHeader-1" --include "*.vue" --include "*.js"
rg "Modal" --include "*.vue" --include "*.js" | grep -i "import\|require\|component"
```

For `Modal.vue` — it may be imported by `vue-js-modal` which is used. Check usage before deleting.

For duplicate `scroller.vue` — check which one is imported by other files.

- [ ] **Step 2: Delete confirmed-unused files**

For each confirmed unused file, delete it.

- [ ] **Step 3: Remove commented-out plugin registrations**

In `nuxt.config.js`, clean up the `plugins` array — remove entries commented out and remove unused plugins.

- [ ] **Step 4: Remove old notion content**

```bash
rm content/notion/bio.json content/notion/releases.json
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove dead code and unused files"
```

---

### Task 12: Consolidate duplicated logic

**Files:**
- Create: `libs/music-player.js`
- Modify: `libs/content-handlers.js`
- Modify: `components/blocks/ReleaseComponent.vue`
- Modify: `components/blocks/EPKComponent.vue`
- Modify: `components/blocks/ToxComponent.vue`

- [ ] **Step 1: Extract shared music player composable**

Create `libs/music-player.js`:

```javascript
export function createMusicPlayer() {
  return {
    changeTrack(src, audioElement) {
      if (!audioElement) return
      audioElement.src = src
      audioElement.play()
    },
    togglePlay(audioElement) {
      if (!audioElement) return
      if (audioElement.paused) {
        audioElement.play()
      } else {
        audioElement.pause()
      }
    },
    logDownload(title, platform) {
      console.log(`Download: ${title} from ${platform}`)
      // Add any analytics/logging here
    },
  }
}
```

- [ ] **Step 2: Update ReleaseComponent, EPKComponent, ToxComponent**

Replace the duplicated `changeTrack`/`togglePlay`/`logDownload` methods with imports from `libs/music-player.js`.

```javascript
import { createMusicPlayer } from '@/libs/music-player'

export default {
  data() {
    return { player: createMusicPlayer() }
  },
  methods: {
    changeTrack(src) {
      this.player.changeTrack(src, this.$refs.audio)
    },
    togglePlay() {
      this.player.togglePlay(this.$refs.audio)
    },
    logDownload(title, platform) {
      this.player.logDownload(title, platform)
    },
  },
}
```

- [ ] **Step 3: Consolidate form submission logic**

In `libs/content-handlers.js`, add a shared form submission function:

```javascript
export async function submitStaticForm(endpoint, formKey, data) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: formKey, data }),
    })
    return { success: response.ok }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
```

- [ ] **Step 4: Update ContactComponent and CollabComponent**

Replace duplicate `fetchSomething()` patterns with the shared `submitStaticForm` import.

- [ ] **Step 5: Commit**

```bash
git add libs/music-player.js libs/content-handlers.js components/blocks/ReleaseComponent.vue components/blocks/EPKComponent.vue components/blocks/ToxComponent.vue components/blocks/ContactComponent.vue components/blocks/CollabComponent.vue
git commit -m "refactor: consolidate duplicated music player and form logic"
```

---

### Task 13: Standardize imports and naming

**Files:**
- All `.vue` files in `pages/`, `components/`
- All `.js` files in `libs/`

- [ ] **Step 1: Audit and fix import paths**

Find all relative imports that go up directories:

```bash
rg "from '\.\./" app/pages app/components --include "*.vue"
rg "from '\.\./" app/libs --include "*.js"
```

For each match, convert to `@/` alias. Examples:
- `from '../../libs/dateFns'` → `from '@/libs/dateFns'`
- `from '../../../components/blocks/...'` → `from '@/components/blocks/...'`

- [ ] **Step 2: Rename loweRcase component files**

If `hero.vue` or `title.vue` or `images-grid.vue` still exist (not deleted in Task 11), rename to PascalCase and update all imports:
- `hero.vue` → `HeroComponent.vue` (update any import)
- `images-grid.vue` → `ImagesGrid.vue` (if kept)

- [ ] **Step 3: Standardise date handling**

Audit: `rg "new Date\|format\|moment" pages/ components/ --include "*.vue"`
For any non-dayjs date code, convert to use `libs/dateFns.js`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: standardise imports to @/ aliases and naming conventions"
```

---

### Task 14: Update dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update Nuxt 2**

```bash
npm install nuxt@^2.17.4
```

- [ ] **Step 2: Update compatible dependencies**

```bash
npm install @nuxtjs/axios@latest @nuxtjs/pwa@latest
npm install sass@latest sass-loader@10
```

- [ ] **Step 3: Update Three.js and related**

```bash
npm install three@latest postprocessing@latest three-stdlib@latest
```

- [ ] **Step 4: Remove deprecated packages**

```bash
npm uninstall vue-notion fibers node-sass
```

- [ ] **Step 5: Verify build**

Run: `npm run generate`
Expected: Site builds without errors. Spot-check a few pages visually.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: update npm dependencies to latest Nuxt 2-compatible versions"
```

---

### Task 15: Clean up duplicate scroller and remaining dead files

**Files:**
- Various

- [ ] **Step 1: Check duplicate scroller components**

Explore: `rg "scroller" --include "*.vue" --include "*.js" --include "*.ts"` to see which scroller.vue is actually imported.

- [ ] **Step 2: Remove confirmed duplicates and commit**

```bash
git add -A
git commit -m "chore: remove duplicate components and dead files"
```

---

### Task 16: Final verification and testing

- [ ] **Step 1: Build the full site**

```bash
npm run generate
```
Expected: Site generates without errors.

- [ ] **Step 2: Verify visually**

Open generated output and confirm:
- All pages render content correctly
- No visual changes from before
- Projects page shows and links work
- Releases page shows and links work
- Shows page shows correctly
- Dynamic pages (about, legal, etc.) render from Notion

- [ ] **Step 3: Verify Notion build integration**

Run: `NOTION_API_KEY=test node -e "require('./scripts/fetch-notion')"` to confirm it doesn't crash without API key.

- [ ] **Step 4: Final commit if needed**

```bash
git add -A
git commit -m "chore: final cleanup after Notion migration"
```
