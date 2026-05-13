# Content Types Upgrade — Design Spec

**Date:** 2026-05-13
**Status:** Approved

---

## Overview

Upgrade all 4 content types (Shows, Projects, Releases, Pages) with:
- Frontmatter-style metadata headers on detail pages
- New Notion properties: City, Participants, ShowType, IsExperiment
- Dynamic routes for releases (`_slug.vue`)
- Separate listing pages for finished projects vs experiments
- Past-show indicators
- Fallback nav link to past shows

---

## 1. Shows

### Notion Additions (fetch script)

Add to `scripts/fetch-notion.js` case `'shows'`:

| Property | Type | JS key |
|----------|------|--------|
| City | rich_text | `city` |
| Participants | rich_text | `participants` |
| ShowType | select | `showType` |

### Routes

| Route | File | Purpose |
|-------|------|---------|
| `/shows` | `pages/shows/index.vue` | Upcoming shows listing |
| `/past-shows` | `pages/past-shows.vue` | Past shows listing |
| `/shows/:slug` | `pages/shows/_slug.vue` | Show detail (shared) |

### Detail page frontmatter header

```
<h1 class="main__content-heading">{{ show.title }}</h1>
<p class="text-md color-contrast-medium">
  {{ show.properties.venueAddress }}
  <template v-if="show.properties.city"> · {{ show.properties.city }}</template>
  · {{ show.properties.country }}
</p>
<p class="text-md">{{ formattedDate }}</p>

<div v-if="isPast" class="past-badge margin-top-sm">This event has passed</div>

<p v-if="show.properties.participants" class="text-md">
  <strong>With:</strong> {{ show.properties.participants }}
</p>
<p v-if="show.properties.showType" class="text-md">
  <strong>Type:</strong> {{ show.properties.showType }}
</p>
<p v-if="show.description" class="text-md margin-top-sm">{{ show.description }}</p>
<a v-if="show.properties.ticketLink && !isPast" :href="show.properties.ticketLink">
  Buy Tickets
</a>

<div v-if="show.bodyHtml" v-html="show.bodyHtml" class="margin-top-lg"></div>
```

`isPast` computed from `dayjs(show.properties.date).isBefore(dayjs())`.

### Listing page

- Show venue name as `<NuxtLink>` to `/shows/:slug` (already done)
- Add a "Past Shows" link near the bottom of the shows listing, separate from the empty-state link
- Mapping in `index.vue` adds: `city`, `participants`, `showType`

---

## 2. Projects

### Notion Additions (fetch script)

Add to `scripts/fetch-notion.js` case `'projects'`:

| Property | Type | JS key |
|----------|------|--------|
| IsExperiment | checkbox | `isExperiment` |

### Routes

Rename `pages/projects.vue` → `pages/projects/index.vue` (prevent parent/child routing conflict).

| Route | File | Purpose |
|-------|------|---------|
| `/projects` | `pages/projects/index.vue` | Finished works (isExperiment = false) |
| `/projects/experiments` | `pages/projects/experiments.vue` | Experiments (isExperiment = true) |
| `/projects/:slug` | `pages/projects/_slug.vue` | Project detail (shared) |

### Detail page frontmatter header

```
<h1 class="main__content-heading">{{ project.title }}</h1>

<p v-if="project.properties.date" class="text-md">{{ formattedDate }}</p>

<div v-if="project.properties.isExperiment" class="badge-experiment margin-top-sm">
  Experiment
</div>

<div v-if="project.properties.tags?.length" class="margin-top-xs text-sm color-contrast-medium">
  {{ project.properties.tags.join(' · ') }}
</div>

<p v-if="project.description" class="text-md margin-top-sm">{{ project.description }}</p>

<div v-if="project.properties.links?.length" class="margin-top-md">
  <a v-for="link in project.properties.links" :href="link.url" class="link padding-right-sm">
    {{ link.platform }}
  </a>
</div>

<div v-if="project.bodyHtml" v-html="project.bodyHtml" class="margin-top-lg"></div>
```

`isExperiment` badge visible on both listing and detail pages.

### Listing component

Add a `filter` prop. When truthy, filter `projects` by `isExperiment === true`. When falsy, filter by `isExperiment === false`. Both pages import the same `ProjectsComponent` with different filters. The listing card already renders `title`, `date`, `tags`.

---

## 3. Releases

### New route

Create `pages/releases/_slug.vue` — dynamic detail page.

Remove `pages/releases/form.vue` (hardcoded to "form" slug — now handled by `_slug.vue`).

### Update `ReleaseComponent.vue`

- Use `release.properties.coverUrl` from Notion instead of hardcoded image path
- Make subheading dynamic: use `release.description` or fall back to nothing
- Remove dead `mediums` references (not fetched from Notion)
- Render `release.properties.tags` where applicable

### Listing component (`ReleasesComponent.vue`)

- Already correct — links to `/releases/:slug`
- Remove dead `mediums` reference

---

## 4. Pages

### No structural changes needed

`_slug.vue` already uses `v-html="bodyHtml"` like `about.vue`. The about page has additional SCSS for `.notion-sync-block p` styling. Apply that SCSS to `_slug.vue` as well so all pages share consistent paragraph styling.

---

## 5. Nav Link: Past Shows

Add `/past-shows` to the site navigation in `AuratykHomeSceneOverlay.vue`.

---

## Implementation Notes

- All changes extend existing patterns; no new architectures
- Build-time fetch script updated, then each component updated
- `delete pages/releases/form.vue` after `_slug.vue` created
- Clear Nuxt cache (`node_modules/.cache/nuxt`) before rebuilding
- Verify with `npm run generate` that all routes produce correct HTML
