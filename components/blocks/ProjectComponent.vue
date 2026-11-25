<template>
  <section class="project-detail margin-bottom-xl">
    <div v-if="project.properties.coverUrl" class="page-cover-wrapper">
      <img
        class="page-cover"
        :src="project.properties.coverUrl"
        :alt="project.title"
      />
    </div>

    <div class="main__content">
      <h1 class="main__content-heading">{{ project.title }}</h1>

      <div class="project-detail__meta margin-top-md">
        <p v-if="year" class="text-md color-contrast-medium">
          {{ year }}
        </p>

        <div
          v-if="project.properties.isExperiment"
          class="badge-experiment margin-top-xs"
        >
          Experiment
        </div>

        <div
          v-if="project.properties.tags?.length"
          class="text-sm color-contrast-medium margin-top-xs"
        >
          {{ project.properties.tags.join(' · ') }}
        </div>

        <p v-if="project.properties.collaborators?.length" class="text-md margin-top-xs">
          <strong>Collaboration with</strong> {{ project.properties.collaborators.join(', ') }}
        </p>

        <p
          v-if="project.description"
          class="text-md margin-top-sm color-contrast-medium"
        >
          {{ project.description }}
        </p>

        <div
          v-if="project.properties.links?.length"
          class="project__links margin-top-md"
        >
          <a
            v-for="link in project.properties.links"
            :key="link.platform"
            :href="link.url"
            target="_blank"
            rel="noopener"
            class="project__link link padding-right-sm"
            >{{ link.platform }}</a
          >
        </div>

        <div
          v-for="group in showGroups"
          :key="group.label"
          class="project__shows margin-top-md"
        >
          <p class="project__shows-label">{{ group.label }}</p>
          <ul class="project__shows-list">
            <li v-for="show in group.shows" :key="show.slug">
              <span class="project__shows-date">{{ show.date }}</span>
              <span>
                <NuxtLink
                  v-if="show.linkable"
                  :to="`/shows/${show.slug}`"
                  class="link"
                  >{{ show.title }}</NuxtLink
                ><template v-else>{{ show.title }}</template
                ><span v-if="show.city" class="color-contrast-medium"
                  >, {{ show.city }}</span
                >
                <span v-if="show.upcoming" class="project__shows-badge"
                  >Upcoming</span
                >
                <a
                  v-if="show.upcoming && show.ticketLink"
                  :href="show.ticketLink"
                  target="_blank"
                  rel="noopener"
                  class="link"
                  >Tickets</a
                >
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="displayBody"
        class="project__body notion-sync-block margin-top-lg"
        v-html="displayBody"
      ></div>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import showsData from '@/content/notion/shows.json'
import { dedupDescription } from '@/libs/description-dedup'
import { hasHappened, formatShowDate, showKind } from '@/libs/show-utils'
import { yearSpan } from '@/libs/project-utils'
import videoPlayer from '@/mixins/video-player'

export default {
  mixins: [videoPlayer],
  props: {
    project: { type: Object, required: true },
  },
  computed: {
    // "2025" or "2024–2026", from the project's Date and its linked shows.
    year() {
      return yearSpan(this.project)
    },
    displayBody() {
      const body = this.project.bodyHtml || ''
      const desc = this.project.description
      if (body && desc) {
        return dedupDescription(body, desc)
      }
      return body
    },
    // Every show linked to this project in Notion (Shows → Projects), oldest
    // first, grouped by ShowType: Performances (live sets), Shows
    // (installations, exhibitions) and Talks. Past shows with a page link to
    // it; upcoming ones get a badge.
    showGroups() {
      const shows = (showsData.items || [])
        .filter((s) => (s.properties?.projects || []).includes(this.project.id))
        .filter((s) => s.properties?.date)
        .sort((a, b) => (dayjs(a.properties.date).isBefore(dayjs(b.properties.date)) ? -1 : 1))
      const groups = {}
      for (const s of shows) {
        const label = showKind(s.properties.showType)
        const past = hasHappened(s)
        ;(groups[label] = groups[label] || []).push({
          slug: s.slug,
          title: s.title,
          city: s.properties.city,
          date: formatShowDate(s.properties.date, s.properties.dateEnd, { short: true }),
          upcoming: !past,
          linkable: past && !!s.bodyHtml,
          ticketLink: s.properties.ticketLink,
        })
      }
      return ['Performances', 'Shows', 'Talks']
        .filter((label) => groups[label])
        .map((label) => ({ label, shows: groups[label] }))
    },
  },
}
</script>

<!-- Body and cover styles: assets/scss/custom-style/_notion-body.scss -->
<style lang="scss" scoped>
.project__shows-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-contrast-medium);
  margin-bottom: var(--space-xxs);
}
.project__shows-list {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    display: grid;
    grid-template-columns: 9rem 1fr;
    gap: var(--space-sm);
    padding: var(--space-xxs) 0;
    border-top: 1px solid var(--color-contrast-lower);
  }
  li:last-child {
    border-bottom: 1px solid var(--color-contrast-lower);
  }
}
.project__shows-date {
  color: var(--color-contrast-medium);
  font-variant-numeric: tabular-nums;
}
.project__shows-badge {
  margin: 0 var(--space-xs);
  padding: 0 var(--space-xs);
  border: 1px solid var(--color-accent);
  border-radius: 999px;
  font-size: 0.75em;
  color: var(--color-accent);
}
</style>
