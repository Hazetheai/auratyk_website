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
