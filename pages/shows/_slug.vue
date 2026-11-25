<template>
  <section class="show-detail margin-bottom-xl">
    <div v-if="p.coverUrl" class="page-cover-wrapper">
      <img class="page-cover" :src="p.coverUrl" :alt="show.title" />
    </div>

    <div class="main__content">
      <header class="show-detail__header">
        <p class="show-detail__kicker text-sm color-contrast-medium">
          <span class="show-type-icon">{{ showTypeIcon }}</span>
          {{ p.showType || 'Show' }}
        </p>

        <h1 class="main__content-heading">{{ show.title }}</h1>

        <p v-if="p.event" class="show-detail__event text-md margin-top-xs">
          {{ p.event }}
        </p>

        <dl class="show-facts margin-top-md">
          <div class="show-facts__item">
            <dt>Where</dt>
            <dd>{{ where }}</dd>
          </div>
          <div class="show-facts__item">
            <dt>When</dt>
            <dd>{{ formattedDate }}</dd>
          </div>
          <div v-if="p.duration" class="show-facts__item">
            <dt>Set</dt>
            <dd>{{ p.duration }}</dd>
          </div>
          <div v-if="p.tools" class="show-facts__item">
            <dt>Tools</dt>
            <dd>{{ p.tools }}</dd>
          </div>
          <div v-if="p.curatedBy" class="show-facts__item">
            <dt>{{ isPanel ? 'Moderated by' : 'Curated by' }}</dt>
            <dd>{{ p.curatedBy }}</dd>
          </div>
          <div
            v-if="relatedProjects.length"
            class="show-facts__item show-facts__item--project"
          >
            <dt>Project</dt>
            <dd>
              <NuxtLink
                v-for="project in relatedProjects"
                :key="project.slug"
                :to="`/projects/${project.slug}`"
                class="show-facts__project link"
                >{{ project.title }} →</NuxtLink
              >
            </dd>
          </div>
          <div
            v-if="lineup.length"
            class="show-facts__item show-facts__item--wide"
          >
            <dt>{{ isPanel ? 'With' : 'Line-up' }}</dt>
            <dd>
              <ul class="show-facts__chips">
                <li v-for="name in lineup" :key="name">{{ name }}</li>
              </ul>
            </dd>
          </div>
        </dl>

        <p
          v-if="p.showUrl || p.credits"
          class="show-detail__footnote text-sm margin-top-sm"
        >
          <a
            v-if="p.showUrl"
            class="link"
            :href="p.showUrl"
            target="_blank"
            rel="noopener"
            >Event page ↗</a
          >
          <span v-if="p.credits" class="color-contrast-medium">{{
            p.credits
          }}</span>
        </p>
      </header>

      <div
        v-if="displayBody"
        class="show-detail__body notion-sync-block margin-top-lg"
        v-html="displayBody"
      ></div>

      <p
        v-else-if="show.description"
        class="show-detail__description text-md margin-top-lg"
      >
        {{ show.description }}
      </p>
    </div>
  </section>
</template>

<script>
import showsData from '@/content/notion/shows.json'
import projectsData from '@/content/notion/projects.json'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import { dedupDescription } from '@/libs/description-dedup'
import { hasHappened, formatShowDate } from '@/libs/show-utils'
import videoPlayer from '@/mixins/video-player'

const ICONS = {
  'Live Set': '●',
  'VJ Set': '◯',
  'AV Set': '◉',
  Installation: '◆',
  Exhibition: '◇',
  Workshop: '◎',
  'Panel Talk': '◌',
}

export default {
  mixins: [videoPlayer],
  layout() {
    return 'main'
  },
  asyncData({ params, error }) {
    // A show only gets a detail page once it has happened. Upcoming shows are
    // listed on /shows with their ticket link instead.
    const show = (showsData.items || []).find((s) => s.slug === params.slug)
    if (!show || !hasHappened(show)) {
      return error({ statusCode: 404, message: 'Show not found' })
    }
    return { show, title: show.title }
  },
  computed: {
    p() {
      return this.show.properties || {}
    },
    isPanel() {
      return this.p.showType === 'Panel Talk'
    },
    showTypeIcon() {
      return ICONS[this.p.showType] || '○'
    },
    formattedDate() {
      return formatShowDate(this.p.date, this.p.dateEnd)
    },
    where() {
      const addr = this.p.venueAddress || ''
      const city = this.addressHasCity ? '' : this.p.city
      return [addr, city].filter(Boolean).join(', ')
    },
    addressHasCity() {
      const addr = (this.p.venueAddress || '').toLowerCase()
      const city = (this.p.city || '').toLowerCase()
      return city && addr.includes(city)
    },
    lineup() {
      return (this.p.lineup || '')
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    },
    relatedProjects() {
      const ids = this.p.projects || []
      if (!ids.length) return []
      return (projectsData.items || []).filter((pr) => ids.includes(pr.id))
    },
    displayBody() {
      const body = this.show.bodyHtml || ''
      const desc = this.show.description
      return body && desc ? dedupDescription(body, desc) : body
    },
    meta() {
      return getSiteMeta({
        type: 'website',
        title: this.title,
        description:
          this.show.description ||
          [this.p.event, this.p.venueAddress].filter(Boolean).join(' · '),
        url: `${this.$config.baseUrl}${this.$route.path}`,
        socialImage: this.p.coverUrl || undefined,
      })
    },
  },
  head() {
    return {
      title: `Auratyk | ${this.title}`,
      meta: [...this.meta],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.baseUrl}${this.$route.path}`,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.show-detail__kicker {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-xs);
}
.show-type-icon {
  margin-right: var(--space-xxs);
  color: var(--color-accent);
}
.show-detail__event {
  color: var(--color-contrast-high);
}

// Facts: small uppercase labels, values at body size, all equal weight.
.show-facts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: var(--space-md) var(--space-lg);
  padding: var(--space-md) 0;
  border-top: 1px solid var(--color-contrast-lower);
  border-bottom: 1px solid var(--color-contrast-lower);
  dt {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-contrast-medium);
    margin-bottom: var(--space-xxxs);
  }
  dd {
    margin: 0;
  }
}
.show-facts__item--wide {
  grid-column: 1 / -1;
}
// Project titles are long; give them two tracks when there's room.
@media (min-width: 40rem) {
  .show-facts__item--project {
    grid-column: span 2;
  }
}
.show-facts__project {
  display: inline-block;
  margin-right: var(--space-sm);
}
.show-facts__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xxs) var(--space-xs);
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    padding: var(--space-xxxs) var(--space-xs);
    border: 1px solid var(--color-contrast-lower);
    border-radius: 999px;
    font-size: 0.875em;
  }
}

.show-detail__footnote {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs) var(--space-md);
}
</style>
