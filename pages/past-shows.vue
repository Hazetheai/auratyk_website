<template>
  <ShowsComponent
    :shows="shows"
    :content="{ title: 'Past Shows' }"
    :is-past="true"
  />
</template>

<script>
import dayjs from 'dayjs'
import ShowsComponent from '../components/blocks/ShowsComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import showsData from '@/content/notion/shows.json'

export default {
  name: 'ShowsPage',
  components: { ShowsComponent },
  layout(context) {
    return 'main'
  },

  data() {
    const items = showsData.items || []
    const _shows = items
      .filter((show) => dayjs(show.properties.date).isBefore(dayjs().subtract(1, 'day')))
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
          hasBody: !!show.bodyHtml,
        }
      })

    return {
      title: 'Past Shows',
      shows: _shows,
    }
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

  computed: {
    meta() {
      const s = this.shows?.[0] || undefined
      const metaData = {
        type: 'website',
        title: 'Past Shows',
        description: s
          ? `Recent: ${s.date} at ${s.venue}, ${s.venueAddress}`
          : undefined,
        url: `${this.$config.baseUrl}${this.$route.path}`,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
