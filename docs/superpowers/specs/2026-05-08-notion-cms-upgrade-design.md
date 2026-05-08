# Notion CMS & Code Cleanup — Design Spec

## Overview

Revamp the auratyk.com website's content management to use Notion as a headless CMS,
fetched at build time. Clean up the codebase (remove dead code, deduplicate logic).
Stay on Nuxt 2 — no visual changes to the rendered site.

## Notion Database Structure

### Pages
- **Title** (title)
- **Slug** (rich text) — flat slugs, e.g. `about`, `cloud-seq`, `legal`, `site-info`, `collab`. One segment only — `_slug.vue` routes `/:slug`.
- **Description** (rich text) — meta description for SEO
- **Published** (checkbox)
- Body content = Notion page blocks

### Releases
- **Name** (title)
- **Slug** (rich text)
- **Type** (select) — EP / Album / Single
- **Date** (date)
- **Cover** (files)
- **BuyLink** (url)
- **PreSaveLinks** (rich text) — JSON string of `[{platform, url}]`
- **StreamLinks** (rich text) — JSON string of `[{platform, url}]`
- **Tags** (multi-select)
- **Published** (checkbox)
- Body content = Notion page blocks (press release text, tracklist, etc.)

### Projects
- **Name** (title)
- **Slug** (rich text)
- **Date** (date)
- **Tags** (multi-select)
- **Cover** (files)
- **Links** (rich text) — JSON string of `[{platform, url}]`
- **Published** (checkbox)
- Body content = Notion page blocks

### Shows
- **Venue** (title)
- **VenueAddress** (rich text)
- **Country** (select)
- **Date** (date)
- **TicketLink** (url)
- **Published** (checkbox)
- No body content needed (shows are listing-only)

## Build-time Data Pipeline

A single script `scripts/fetch-notion.js` executed via `nuxt generate`:

1. Read env vars for Notion API key + database IDs
2. For each content type, query the Notion database (filtering by Published = true)
3. Parse page properties into structured objects
4. Walk page blocks recursively, converting to HTML via a block-to-html converter
   - Paragraph → `<p>`
   - Heading 1/2/3 → `<h1>/<h2>/<h3>`
   - Bulleted list → `<ul><li>`
   - Numbered list → `<ol><li>`
   - Image → `<figure><img></figure>`
   - Code → `<pre><code>`
   - Divider → `<hr>`
   - Quote → `<blockquote>`
   - Callout → `<div class="callout">`
   - Rich text annotations (bold, italic, code, links) → appropriate HTML tags
   - Unknown blocks → skip or render plain text
5. Write output to `content/notion/{pages,releases,projects,shows}.json`
   - Each file: `{ items: [...], fetchedAt: ISO timestamp }`
6. Fail gracefully — if Notion API is unreachable, reuse cached JSON files

### Schema of output JSON

```json
{
  "fetchedAt": "2026-05-08T12:00:00Z",
  "items": [
    {
      "id": "notion-page-id",
      "title": "About",
      "slug": "about",
      "description": "About Auratyk",
      "bodyHtml": "<p>...</p>",
      "properties": {
        "date": "2026-01-15",
        "type": "EP",
        "coverUrl": "https://...",
        "tags": ["techno", "ambient"],
        "links": [{ "platform": "Bandcamp", "url": "..." }]
      }
    }
  ]
}
```

## Page Routing

Add `pages/_slug.vue` as a catch-all dynamic route:

- Reads `content/notion/pages.json`
- Matches `$route.params.slug` against page slugs
- Renders the page layout + `v-html` body content
- Returns 404 for unknown slugs (existing `error.vue`)

Existing explicit pages to be **removed** (replaced by Notion):
- `pages/about.vue`
- `pages/legal.vue`
- `pages/site-info.vue`
- `pages/collab.vue`
- `pages/contact.vue`
- `pages/community/cloud-seq.vue`
- `pages/releases/index.vue` (becomes a listing page reading from Notion JSON)
- `pages/releases/form.vue`
- `pages/shows.vue` + `pages/past-shows.vue`
- `pages/form-epk.vue`
- `pages/test-page.vue`

Pages that stay (non-content, structural):
- `pages/index.vue` (home scene — special layout + Three.js)
- `layouts/` — all unchanged (visual)
- `pages/_slug.vue` (new)

## Existing Content Migration

When transitioning, the build script should:
1. Read the new Notion data AND the existing local JSON data
2. Merge them, with Notion data taking priority
3. Once verified, remove local JSON files entirely

## Code Cleanup

### Remove
- `content/notion/bio.json`, `content/notion/releases.json` (old block-ID JSON — directory stays, old files inside get deleted)
- `content/releases.json`, `content/toxes.json`
- `vue-notion` package + build module
- `G-MainHeader-1.vue` — unused demo component
- `hero.vue`, `title.vue`, `images-grid.vue`, `Modal.vue` — unused prototype components
- Duplicate `scroller.vue` (keep one, remove the other)
- Commented-out Notion code in all pages/components
- Commented-out plugin registrations in `nuxt.config.js`
- `plugins/soundReactor.js` — entirely commented out
- `content/hello.md` — default Nuxt Content example

### Consolidate
- Music player logic (`changeTrack`, `togglePlay`, `logDownload`) — extract to shared composable
- Date/stream link processing — consolidate in `libs/`
- Form submission logic — shared helper in `libs/`
- Shows data into Notion, eliminate duplication

### Standardise
- All imports to `@/` aliases
- Component file names to PascalCase consistent convention
- Date handling to dayjs throughout

## Dependencies (Nuxt 2 compatible updates)

Update to latest Nuxt 2-compatible versions:
- `nuxt` → `^2.17.4` (latest 2.x)
- `@nuxt/content` → latest 2.x compatible
- `@nuxtjs/axios` → latest
- `@nuxtjs/pwa` → latest
- `sass` → latest
- `sass-loader` → `^10` (Nuxt 2 compatible)
- `three` → latest
- `postprocessing` → latest compatible
- `three-stdlib` → latest
- GSAP → latest (verify bonus plugins compatibility)
- All other deps → latest semver-compatible

Add:
- `@notionhq/client` — official Notion SDK (dev dependency, build-time only)

Remove:
- `vue-notion`
- `vue-js-modal` (verify if still needed, replace if possible)
- `fibers` (deprecated, use `sass` built-in)
- `node-sass` (use `sass` (dart-sass) exclusively)

## Non-goals

- No visual changes to any page, component, or layout
- No Three.js/WebGL changes
- No changes to page transitions or animations
- No layout restructuring
- No CSS/styling changes

## Rollback Strategy

- Keep `content/` JSON files as cached fallback
- Old page files stay in git history (can be reverted)
- If Notion API is down during build, use cached data — site never breaks
