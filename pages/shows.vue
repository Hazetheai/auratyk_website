<template>
  <ShowsComponent :shows="shows" />
</template>

<script>
import ShowsComponent from '../components/blocks/ShowsComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import dayjs from 'dayjs'
export default {
  name: 'ShowsPage',
  components: { ShowsComponent },
  layout(context) {
    return 'main'
  },

  data() {
    const _shows = [
      {
        venue: 'Agatha Hopfen',
        venueAddress: 'Revaler Str. 99, 10245 Berlin',
        googleMapsLink: 'https://goo.gl/maps/xsRyN7hKp4KP8TPU6',
        country: 'Germany',
        date: '2023/08/10',
        // ticketLink: 'https://www.instagram.com/p/CvrU5GLtQuj/',
        promoterLink: 'https://www.instagram.com/p/CvrU5GLtQuj/',
      },
    ]
      .filter((show) => dayjs(show.date).isAfter(dayjs().subtract(1, 'day')))
      .map((show) => {
        return {
          ...show,
          date: dayjs(show.date).format('DD/MM/YY'),
        }
      })
    console.log('_shows', _shows)
    return {
      title: 'Shows',
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
        title: 'Shows',
        description: s
          ? `Upcoming: ${s.date} at ${s.venue}, ${s.venueAddress}`
          : undefined,
        url: `${this.$config.baseUrl}${this.$route.path}`,
        // mainImage: this.article.image,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
