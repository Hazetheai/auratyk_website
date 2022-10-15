<template>
  <SiteInfoComponent />
</template>

<script>
import SiteInfoComponent from '../components/blocks/SiteInfoComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  name: 'SiteInfoPage',
  components: { SiteInfoComponent },
  layout(context) {
    return 'main'
  },

  data() {
    return { title: 'Site Info' }
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
