<template>
  <SiteInfoComponent />
</template>

<script>
import SiteInfoComponent from '../components/blocks/SiteInfoComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  layout(context) {
    return 'main'
  },

  name: 'SiteInfoPage',
  components: { SiteInfoComponent },

  data() {
    return { title: 'Site Info' }
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
          href: `https://auratyk.com/site-info`,
        },
      ],
    }
  },
}
</script>
