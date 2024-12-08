<template>
  <ShowsComponent :shows="shows" :content="{ title: 'Shows' }" />
</template>

<script>
import dayjs from 'dayjs'
import ShowsComponent from '../components/blocks/ShowsComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
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
        date: '10/08/23',
        // ticketLink: 'https://www.instagram.com/p/CvrU5GLtQuj/',
        promoterLink: 'https://www.instagram.com/p/CvrU5GLtQuj/',
      },
      {
        venue: 'Madame Claude',
        venueAddress: 'Lübbener Str. 19, 10997 Berlin',
        googleMapsLink: 'https://maps.app.goo.gl/HVkSVjB8DSapYDkJ6',
        country: 'Germany',
        date: '06/04/24',
        // ticketLink: 'https://www.instagram.com/p/CvrU5GLtQuj/',
        promoterLink:
          'https://madameclaude.de/event/club-alpino-auratyk-adrian-bang-dj-set/',
      },
      {
        venue: 'Madame Claude',
        venueAddress: 'Lübbener Str. 19, 10997 Berlin',
        googleMapsLink: 'https://maps.app.goo.gl/HVkSVjB8DSapYDkJ6',
        country: 'Germany',
        date: '15/02/25',
        // ticketLink: 'https://www.instagram.com/p/CvrU5GLtQuj/',
        // promoterLink:
        //   'https://madameclaude.de/event/club-alpino-auratyk-adrian-bang-dj-set/',
      },
    ]
      .filter((show) => dayjs(show.date).isAfter(dayjs().subtract(1, 'day')))
      .map((show) => {
        return {
          ...show,
          date: dayjs(show.date).format('DD/MM/YY'),
        }
      })
      .sort((a, b) => (dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1))

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
