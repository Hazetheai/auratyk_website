<template>
  <ShowsComponent />
</template>

<script>
import ShowsComponent from '../components/blocks/ShowsComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  layout(context) {
    return 'main'
  },

  name: 'ShowsPage',
  components: { ShowsComponent },

  data() {
    return { title: 'Shows' }
  },

  computed: {
    meta() {
      const metaData = {
        type: 'website',
        title: this.title,
        // description: this.description,
        url: `${this.$config.baseUrl}/${this.$route.params.slug}`,
        // mainImage: this.article.image,
      }
      return getSiteMeta(metaData)
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
          href: `https://auratyk.com/shows`,
        },
      ],
    }
  },
}
</script>
