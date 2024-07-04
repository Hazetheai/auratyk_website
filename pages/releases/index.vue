<template>
  <ReleasesComponent />
</template>

<script>
import ReleasesComponent from '@/components/blocks/ReleasesComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  name: 'ReleasesPage',
  components: { ReleasesComponent },
  layout(context) {
    return 'main'
  },

  data() {
    return { title: 'Releases' }
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
      const metaData = {
        type: 'website',
        title: this.title,
        // description: this.description,
        url: `${this.$config.baseUrl}${this.$route.path}`,
        // mainImage: this.article.image,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
