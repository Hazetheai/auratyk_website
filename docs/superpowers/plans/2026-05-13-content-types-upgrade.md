# Content Types Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade all 4 content types (Shows, Projects, Releases, Pages) with frontmatter-style metadata headers on detail pages, new Notion properties, dynamic release routes, separate experiment listing, and past-show indicators.

**Architecture:** Extend the existing Notion → fetch → JSON → component pipeline. Add new properties to the `scripts/fetch-notion.js` switch cases, thread them through to detail page components via Vue templates. Create new dynamic routes where needed. No new dependencies.

**Tech Stack:** Nuxt 2.18, Vue 2.7, dayjs, Notion client v4

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `scripts/fetch-notion.js` | Modify | Add new Notion properties for shows + projects |
| `pages/shows/_slug.vue` | Modify | Frontmatter header with City, Participants, ShowType, past badge |
| `pages/shows/index.vue` | Modify | Add past-shows link, pass new props |
| `pages/past-shows.vue` | Modify | Pass new props to ShowsComponent |
| `components/blocks/ShowsComponent.vue` | Modify | Render past-shows link even when shows exist |
| `pages/projects/index.vue` | Rename from `pages/projects.vue` | Fix routing + filter finished works |
| `pages/projects/experiments.vue` | Create | Experiments listing |
| `pages/projects/_slug.vue` | Modify | Frontmatter header with IsExperiment badge, description |
| `components/blocks/ProjectsComponent.vue` | Modify | Add filter prop for isExperiment |
| `components/blocks/ProjectComponent.vue` | Modify | Frontmatter header, experiment badge, description |
| `pages/releases/_slug.vue` | Create | Dynamic release detail page |
| `pages/releases/form.vue` | Delete | Replaced by dynamic `_slug.vue` |
| `components/blocks/ReleaseComponent.vue` | Modify | Use coverUrl from Notion, remove dead code |
| `components/blocks/ReleasesComponent.vue` | Modify | Remove dead mediums code |
| `pages/_slug.vue` | Modify | Add about-page SCSS styling to all pages |
| `components/blocks/AuratykHomeSceneOverlay.vue` | Modify | Add Past Shows nav link |

---

### Task 1: Update fetch script — Shows properties

**Files:**
- Modify: `scripts/fetch-notion.js`

- [ ] **Step 1: Add City, Participants, ShowType to shows case**

In `scripts/fetch-notion.js`, locate the `case 'shows':` block (around line 127) and add the three new properties:

```js
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
```

- [ ] **Step 2: Run fetch script to verify**

```bash
node scripts/fetch-notion.js
```

Expected: shows JSON now includes `city`, `participants`, `showType` in each item's `properties`.

- [ ] **Step 3: Commit**

```bash
git add scripts/fetch-notion.js
git commit -m "feat: add City, Participants, ShowType to shows fetch"
```

---

### Task 2: Update fetch script — Projects IsExperiment property

**Files:**
- Modify: `scripts/fetch-notion.js`

- [ ] **Step 1: Add IsExperiment to projects case**

In `scripts/fetch-notion.js`, locate the `case 'projects':` block and add `isExperiment`:

```js
case 'projects':
  entry.properties = {
    date: getPropertyValue(props, 'Date'),
    coverUrl: getCoverUrl(props, 'Cover'),
    links: parseJsonField(getPropertyValue(props, 'Links')),
    tags: getPropertyValue(props, 'Tags') || [],
    isExperiment: getPropertyValue(props, 'IsExperiment') || false,
  }
  break
```

- [ ] **Step 2: Run fetch script to verify**

```bash
node scripts/fetch-notion.js
```

Expected: projects JSON now includes `isExperiment` in each item's `properties`.

- [ ] **Step 3: Commit**

```bash
git add scripts/fetch-notion.js
git commit -m "feat: add IsExperiment to projects fetch"
```

---

### Task 3: Shows detail page — frontmatter header

**Files:**
- Modify: `pages/shows/_slug.vue`

- [ ] **Step 1: Replace template with frontmatter header design**

Replace the entire file content:

```vue
<template>
  <section v-if="show" class="show-detail main__content margin-bottom-xl">
    <h1 class="main__content-heading">{{ show.title }}</h1>

    <div class="show-detail__meta margin-top-md">
      <p class="text-md color-contrast-medium">
        {{ show.properties.venueAddress }}
        <template v-if="show.properties.city"> · {{ show.properties.city }}</template>
        · {{ show.properties.country }}
      </p>
      <p class="text-md">{{ formattedDate }}</p>

      <div v-if="isPast" class="past-badge margin-top-sm">
        This event has passed
      </div>

      <p v-if="show.properties.participants" class="text-md margin-top-xs">
        <strong>With:</strong> {{ show.properties.participants }}
      </p>

      <p v-if="show.properties.showType" class="text-md margin-top-xs">
        <strong>Type:</strong> {{ show.properties.showType }}
      </p>

      <p v-if="show.description" class="text-md margin-top-sm color-contrast-medium">
        {{ show.description }}
      </p>

      <a
        v-if="show.properties.ticketLink && !isPast"
        class="link margin-top-md inline-block"
        :href="show.properties.ticketLink"
        target="_blank"
        rel="noopener"
      >Buy Tickets</a>
    </div>

    <div
      v-if="show.bodyHtml"
      class="show-detail__body notion-sync-block margin-top-lg"
      v-html="show.bodyHtml"
    ></div>
  </section>

  <div v-else class="main__content">
    <p>Show not found.</p>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import showsData from '@/content/notion/shows.json'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  layout() { return 'main' },
  asyncData({ params }) {
    const show = (showsData.items || []).find(s => s.slug === params.slug) || null
    return { show }
  },
  data() {
    return {
      title: this.show?.title || 'Show Not Found',
      description: this.show?.description || '',
    }
  },
  computed: {
    formattedDate() {
      if (!this.show?.properties?.date) return ''
      return dayjs(this.show.properties.date).format('DD/MM/YY')
    },
    isPast() {
      if (!this.show?.properties?.date) return false
      return dayjs(this.show.properties.date).isBefore(dayjs())
    },
    meta() {
      return getSiteMeta({
        type: 'website',
        title: this.title,
        description: this.description || `${this.title} at ${this.show?.properties?.venueAddress || ''}`,
        url: `${this.$config.baseUrl}${this.$route.path}`,
      })
    },
  },
  head() {
    return {
      title: `Auratyk | ${this.title}`,
      meta: [...this.meta],
      link: [{ hid: 'canonical', rel: 'canonical', href: `${this.$config.baseUrl}${this.$route.path}` }],
    }
  },
}
</script>
```

- [ ] **Step 2: Verify build**

```bash
rm -rf node_modules/.cache/nuxt && npm run generate 2>&1 | grep -E "Generated route.*show|ERROR"
```

Expected: all show detail routes generate without errors.

- [ ] **Step 3: Commit**

```bash
git add pages/shows/_slug.vue
git commit -m "feat: add frontmatter header to show detail pages"
```

---

### Task 4: Shows listing — add past-shows link and new props

**Files:**
- Modify: `pages/shows/index.vue`
- Modify: `components/blocks/ShowsComponent.vue`

- [ ] **Step 1: Pass new properties in shows/index.vue**

In `pages/shows/index.vue`, update the `.map()` to include new fields:

```js
.map((show) => {
  return {
    slug: show.slug,
    venue: show.title,
    venueAddress: show.properties.venueAddress,
    city: show.properties.city,
    country: show.properties.country,
    date: dayjs(show.properties.date).format('DD/MM/YY'),
    ticketLink: show.properties.ticketLink,
    participants: show.properties.participants,
    showType: show.properties.showType,
  }
})
```

- [ ] **Step 2: Add past-shows link to ShowsComponent**

In `components/blocks/ShowsComponent.vue`, add a "Past Shows" link after the shows list, visible even when shows exist. After the closing `</div>` of `.shows-container` (but before the `v-else` empty state), add:

```html
<div class="past-shows-link margin-top-lg text-center">
  <NuxtLink to="/past-shows" class="link text-md">Past Shows →</NuxtLink>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add pages/shows/index.vue components/blocks/ShowsComponent.vue
git commit -m "feat: add new show props to listing and past-shows link"
```

---

### Task 5: Past shows — pass new properties

**Files:**
- Modify: `pages/past-shows.vue`

- [ ] **Step 1: Update mapping to include new fields**

In `pages/past-shows.vue`, update the `.map()`:

```js
.map((show) => {
  return {
    slug: show.slug,
    venue: show.title,
    venueAddress: show.properties.venueAddress,
    city: show.properties.city,
    country: show.properties.country,
    date: dayjs(show.properties.date).format('DD/MM/YY'),
    ticketLink: show.properties.ticketLink,
    participants: show.properties.participants,
    showType: show.properties.showType,
  }
})
```

- [ ] **Step 2: Commit**

```bash
git add pages/past-shows.vue
git commit -m "feat: pass new show props to past-shows listing"
```

---

### Task 6: Projects routing — rename + create experiments page

**Files:**
- Rename: `pages/projects.vue` → `pages/projects/index.vue`
- Create: `pages/projects/experiments.vue`
- Modify: `pages/projects/index.vue`

- [ ] **Step 1: Rename projects.vue to projects/index.vue and fix import**

```bash
mv pages/projects.vue pages/projects/index.vue
```

In `pages/projects/index.vue`, change the ShowsComponent import to use `@/` alias (it currently imports ShowsComponent which shouldn't be there — actually check the file). The import should already be `@/components/blocks/ProjectsComponent.vue`. Verify it exists and is correct.

Also update: filter projects to only show finished works (`isExperiment: false`):

```js
data() {
  const items = projectsData.items || []
  return {
    title: 'Projects',
    projects: items.filter(p => !p.properties.isExperiment),
  }
}
```

- [ ] **Step 2: Create experiments.vue listing page**

Create `pages/projects/experiments.vue`:

```vue
<template>
  <ProjectsComponent :projects="projects" title="Experiments" />
</template>

<script>
import ProjectsComponent from '@/components/blocks/ProjectsComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import projectsData from '@/content/notion/projects.json'

export default {
  components: { ProjectsComponent },
  layout() { return 'main' },
  data() {
    const items = projectsData.items || []
    return {
      title: 'Experiments',
      projects: items.filter(p => p.properties.isExperiment),
    }
  },
  head() {
    return {
      title: `Auratyk | ${this.title}`,
      meta: [...this.meta],
      link: [{ hid: 'canonical', rel: 'canonical', href: `${this.$config.baseUrl}${this.$route.path}` }],
    }
  },
  computed: {
    meta() {
      return getSiteMeta({ type: 'website', title: this.title, url: `${this.$config.baseUrl}${this.$route.path}` })
    },
  },
}
</script>
```

- [ ] **Step 3: Update ProjectsComponent to accept a title prop**

In `components/blocks/ProjectsComponent.vue`, replace the hardcoded `<h1>Projects</h1>` with:

```html
<h1 class="main__content-heading margin-bottom-md">{{ title }}</h1>
```

Add the prop:

```js
props: {
  projects: { type: Array, required: true },
  title: { type: String, default: 'Projects' },
}
```

- [ ] **Step 4: Verify build**

```bash
rm -rf node_modules/.cache/nuxt && npm run generate 2>&1 | grep -E "Generated route.*project|ERROR"
```

Expected: `/projects` and `/projects/experiments` routes generated.

- [ ] **Step 5: Commit**

```bash
git add pages/projects/index.vue pages/projects/experiments.vue components/blocks/ProjectsComponent.vue
git rm pages/projects.vue 2>/dev/null; git add -A
git commit -m "feat: separate projects and experiments listings"
```

---

### Task 7: Projects detail page — frontmatter header

**Files:**
- Modify: `pages/projects/_slug.vue`
- Modify: `components/blocks/ProjectComponent.vue`

- [ ] **Step 1: Update ProjectComponent.vue with frontmatter header**

Replace the entire template and script of `components/blocks/ProjectComponent.vue`:

```vue
<template>
  <section class="project-detail main__content margin-bottom-xl">
    <h1 class="main__content-heading">{{ project.title }}</h1>

    <div class="project-detail__meta margin-top-md">
      <p v-if="project.properties.date" class="text-md color-contrast-medium">
        {{ formattedDate }}
      </p>

      <div v-if="project.properties.isExperiment" class="badge-experiment margin-top-xs">
        Experiment
      </div>

      <div v-if="project.properties.tags?.length" class="text-sm color-contrast-medium margin-top-xs">
        {{ project.properties.tags.join(' · ') }}
      </div>

      <p v-if="project.description" class="text-md margin-top-sm color-contrast-medium">
        {{ project.description }}
      </p>

      <div v-if="project.properties.links?.length" class="project__links margin-top-md">
        <a
          v-for="link in project.properties.links"
          :key="link.platform"
          :href="link.url"
          target="_blank"
          rel="noopener"
          class="project__link link padding-right-sm"
        >{{ link.platform }}</a>
      </div>
    </div>

    <div
      v-if="project.bodyHtml"
      class="project__body notion-sync-block margin-top-lg"
      v-html="project.bodyHtml"
    ></div>
  </section>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    project: { type: Object, required: true },
  },
  computed: {
    formattedDate() {
      if (!this.project?.properties?.date) return ''
      return dayjs(this.project.properties.date).format('DD/MM/YY')
    },
  },
}
</script>
```

- [ ] **Step 2: Verify the page still imports correctly**

`pages/projects/_slug.vue` already imports `ProjectComponent` and passes `:project="project"` — no change needed there.

- [ ] **Step 3: Commit**

```bash
git add components/blocks/ProjectComponent.vue
git commit -m "feat: frontmatter header for project detail pages"
```

---

### Task 8: Dynamic releases detail page

**Files:**
- Create: `pages/releases/_slug.vue`
- Delete: `pages/releases/form.vue`

- [ ] **Step 1: Create dynamic releases/_slug.vue**

Create `pages/releases/_slug.vue`:

```vue
<template>
  <ReleaseComponent v-if="release" :release="release" />
  <div v-else class="main__content">
    <p>Release not found.</p>
  </div>
</template>

<script>
import ReleaseComponent from '@/components/blocks/ReleaseComponent.vue'
import { isOnOrAfterToday } from '@/libs/dateFns'
import { handleStreamLinks } from '@/libs/content-handlers'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import releasesData from '@/content/notion/releases.json'

export default {
  components: { ReleaseComponent },
  layout() { return 'main' },
  asyncData({ params }) {
    const items = releasesData.items || []
    const _releases = items.map((release) => ({
      ...release,
      isReleased: isOnOrAfterToday(release.properties?.date) === 'Released',
    }))
    const release = _releases
      .map(handleStreamLinks)
      .find((r) => r.slug === params.slug) || null
    return { release }
  },
  data() {
    return {
      title: this.release?.title || 'Release Not Found',
    }
  },
  head() {
    return {
      title: `Auratyk | ${this.title}`,
      meta: [...this.meta],
      link: [{ hid: 'canonical', rel: 'canonical', href: `${this.$config.baseUrl}${this.$route.path}` }],
    }
  },
  computed: {
    meta() {
      return getSiteMeta({
        type: 'website',
        title: this.title,
        url: `${this.$config.baseUrl}${this.$route.path}`,
      })
    },
  },
}
</script>
```

- [ ] **Step 2: Delete the old hardcoded form.vue**

```bash
rm pages/releases/form.vue
```

- [ ] **Step 3: Commit**

```bash
git add pages/releases/_slug.vue
git rm pages/releases/form.vue
git commit -m "feat: dynamic release detail page via _slug.vue"
```

---

### Task 9: Update ReleaseComponent — use Notion data

**Files:**
- Modify: `components/blocks/ReleaseComponent.vue`

- [ ] **Step 1: Fix hardcoded cover image and subheading**

In `components/blocks/ReleaseComponent.vue`, find the `<nuxt-img>` tag with hardcoded `src="/images/png/ep-cover-art-ep.jpg"` and replace with:

```html
<nuxt-img
  v-if="release.properties.coverUrl"
  class="dark-image"
  sizes="sm:100vw md:50vw lg:600px"
  :src="release.properties.coverUrl"
  :alt="release.title + ' Cover Art'"
/>
```

Find the hardcoded `<h3>Auratyk shares debut EP 'Form'</h3>` and replace with:

```html
<h3 v-if="release.description">{{ release.description }}</h3>
```

Remove the dead `mediums` references. Find `release.properties.mediums` and replace with empty (the template has `(release.properties.mediums || [])` — just remove that `<span v-for>` block entirely):

Replace:
```html
On
<span v-for="medium in (release.properties.mediums || [])" :key="medium">{{
  medium
}}</span>
```
With just `On` (or remove the whole "On" line if no mediums data exists):

```html
<p class="main__content-intro text-center">
  Out {{ release.properties.date }}
</p>
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/ReleaseComponent.vue
git commit -m "fix: use Notion coverUrl and description in ReleaseComponent"
```

---

### Task 10: Remove dead mediums code from ReleasesComponent

**Files:**
- Modify: `components/blocks/ReleasesComponent.vue`

- [ ] **Step 1: Remove dead mediums section**

Find and remove this entire block (around lines 20-31 in the template):

```html
<div class="hide@md release-details__main-details ...">
  <p class="release-details__medium text-md">
    <span v-for="medium in (release.properties.mediums || [])" :key="medium" class="flex">
      {{ medium }}
    </span>
  </p>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/ReleasesComponent.vue
git commit -m "chore: remove dead mediums code from ReleasesComponent"
```

---

### Task 11: Apply about page SCSS to _slug.vue

**Files:**
- Modify: `pages/_slug.vue`
- Modify: `pages/about.vue`

- [ ] **Step 1: Move shared SCSS from about.vue to _slug.vue**

Copy the `.notion-sync-block p` styling from `pages/about.vue` `<style>` block into `pages/_slug.vue`:

```scss
<style lang="scss">
.page-content__body {
  &.notion-sync-block,
  .notion-sync-block {
    display: flex;
    flex-direction: column;
    & p {
      max-width: var(--max-width-sm);
      padding-top: var(--space-xl);
      padding-bottom: var(--space-xl);
      &:first-child {
        padding-top: 0;
      }
      &:nth-child(2n) {
        align-self: flex-end;
      }
    }
  }
}
</style>
```

Update the template in `_slug.vue` to use `page-content__body` class:

```html
<div v-if="page" class="page-content">
  <h1 class="main__content-heading" v-if="page.title">{{ page.title }}</h1>
  <div v-html="page.bodyHtml" class="page-content__body notion-sync-block"></div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add pages/_slug.vue
git commit -m "feat: apply about-page paragraph styling to all generic pages"
```

---

### Task 12: Add Past Shows to site navigation

**Files:**
- Modify: `components/blocks/AuratykHomeSceneOverlay.vue`

- [ ] **Step 1: Add Past Shows nav entry**

Find the navigation links array in `AuratykHomeSceneOverlay.vue` (search for the `<NuxtLink>` or navigation items). Add a "Past Shows" entry after "Shows":

```html
<NuxtLink to="/past-shows" class="nav-link">Past Shows</NuxtLink>
```

(Exact placement depends on the template structure — add it adjacent to the existing Shows link.)

- [ ] **Step 2: Commit**

```bash
git add components/blocks/AuratykHomeSceneOverlay.vue
git commit -m "feat: add Past Shows to site navigation"
```

---

### Task 13: Final build verification

**Files:** None (verification only)

- [ ] **Step 1: Clear cache and generate**

```bash
rm -rf node_modules/.cache/nuxt dist && npm run generate
```

- [ ] **Step 2: Verify all routes**

Expected routes:
- `/shows`, `/past-shows`, `/shows/:slug` (all existing shows)
- `/projects`, `/projects/experiments`, `/projects/:slug`
- `/releases`, `/releases/:slug` (all releases)
- All other existing routes still working

- [ ] **Step 3: Spot-check generated HTML**

Check one show detail page has the past badge:
```bash
grep -o 'This event has passed' dist/shows/*/index.html | wc -l
```

Check `/releases/form` renders correctly:
```bash
grep -o 'show-detail\|Release not found' dist/releases/form/index.html
```

- [ ] **Step 4: Commit (if anything changed during final polish)**

```bash
git add -A
git commit -m "chore: final build verification and polish"
```
