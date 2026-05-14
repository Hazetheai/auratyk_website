<template>
  <section v-if="show" class="show-detail main__content margin-bottom-xl">
    <h1 class="main__content-heading">{{ show.title }}</h1>

    <div class="show-detail__meta margin-top-md">
      <p v-if="show.properties.showType" class="text-md margin-top-sm">
        <span class="show-type-icon" :title="show.properties.showType">
          <template v-if="show.properties.showType === 'Live Set'">●</template>
          <template v-else-if="show.properties.showType === 'VJ Set'">◯</template>
          <template v-else-if="show.properties.showType === 'AV Set'">◉</template>
          <template v-else-if="show.properties.showType === 'Installation'">◆</template>
          <template v-else-if="show.properties.showType === 'Exhibition'">◇</template>
          <template v-else-if="show.properties.showType === 'Workshop'">◎</template>
          <template v-else>○</template>
        </span>
        <strong>Type:</strong> {{ show.properties.showType }}
      </p>

      <p class="text-md margin-top-sm color-contrast-medium">
        <span class="show-detail__address">{{ formattedAddress }}</span>
        <template v-if="show.properties.city && !addressHasCity"> · {{ show.properties.city }}</template>
        · {{ show.properties.country }}
      </p>

      <p class="text-md margin-top-sm">
        <strong>Date:</strong> {{ formattedDate }}
      </p>

      <div v-if="isPast" class="past-badge margin-top-sm">
        This event has passed
      </div>

      <p v-if="participantLabel || projectCollaborators" class="text-md margin-top-sm">
        <template v-if="participantLabel">
          <strong>{{ participantLabel }}</strong>
        </template>
        <template v-if="projectCollaborators">
          <template v-if="participantLabel"><br/></template>
          <strong>With:</strong> {{ projectCollaborators }}
        </template>
      </p>

      <a
        v-if="show.properties.showUrl"
        class="link margin-top-sm inline-block"
        :href="show.properties.showUrl"
        target="_blank"
        rel="noopener"
      >Event Website</a>

      <a
        v-if="show.properties.ticketLink && !isPast"
        class="link margin-top-sm inline-block"
        :href="show.properties.ticketLink"
        target="_blank"
        rel="noopener"
      >Buy Tickets</a>

      <div v-if="relatedProjects.length" class="margin-top-md">
        <p class="text-md"><strong>Related Projects:</strong></p>
        <NuxtLink
          v-for="project in relatedProjects"
          :key="project.slug"
          :to="`/projects/${project.slug}`"
          class="link padding-right-sm"
        >{{ project.title }}</NuxtLink>
      </div>
    </div>

    <div
      class="show-detail__body notion-sync-block margin-top-lg"
      v-html="displayBody"
    ></div>

    <div
      v-if="show.description && !show.bodyHtml"
      class="show-detail__description text-md color-contrast-medium margin-top-lg"
    >{{ show.description }}</div>
  </section>

  <div v-else class="main__content">
    <p>Show not found.</p>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import showsData from '@/content/notion/shows.json'
import projectsData from '@/content/notion/projects.json'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import { dedupDescription } from '@/libs/description-dedup'

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
      const d = this.show.properties.date
      if (typeof d === 'object' && d.start) {
        const start = dayjs(d.start).format('DD/MM/YY')
        const end = d.end ? dayjs(d.end).format('DD/MM/YY') : null
        return end ? `${start} – ${end}` : start
      }
      return dayjs(d).format('DD/MM/YY')
    },
    isPast() {
      if (!this.show?.properties?.date) return false
      const d = this.show.properties.date
      const endDate = (typeof d === 'object' && d.end) ? d.end : (typeof d === 'object' ? d.start : d)
      return dayjs(endDate).isBefore(dayjs())
    },
    displayBody() {
      const body = this.show.bodyHtml || ''
      const desc = this.show.description
      if (body && desc) {
        return dedupDescription(body, desc)
      }
      return body
    },
    formattedAddress() {
      const addr = this.show?.properties?.venueAddress || ''
      return addr
    },
    addressHasCity() {
      const addr = (this.show?.properties?.venueAddress || '').toLowerCase()
      const city = (this.show?.properties?.city || '').toLowerCase()
      return city && addr.includes(city)
    },
    relatedProjects() {
      const ids = this.show?.properties?.projects || []
      if (!ids.length) return []
      return (projectsData.items || []).filter(p => ids.includes(p.id))
    },
    participantLabel() {
      const p = this.show?.properties?.participants
      if (!p) return null
      const labels = {
        'Collab': `Collaboration with ${p}`,
        'Commission': `Commissioned by ${p}`,
        'Solo': 'Solo Show',
        'Line Up': null,
        'Support': null,
        'Group': null,
      }
      return labels[p] || null
    },
    projectCollaborators() {
      const ids = this.show?.properties?.projects || []
      if (!ids.length) return null
      const projects = (projectsData.items || []).filter(p => ids.includes(p.id))
      const allCollabs = projects
        .map(p => p.properties.collaborators || [])
        .flat()
        .filter(Boolean)
      return allCollabs.length ? allCollabs.join(', ') : null
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

<style lang="scss" scoped>
.show-detail__address {
  max-width: 400px;
  display: block;
}
.show-type-icon {
  margin-right: var(--space-xxs);
  color: var(--color-accent);
}
.show-detail__meta > * {
  margin-top: var(--space-sm);
}
.show-detail__meta > :first-child {
  margin-top: 0;
}
</style>
