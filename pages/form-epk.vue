<template>
  <EPKComponent />
</template>

<script>
import EPKComponent from '../components/blocks/EPKComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  name: 'ContactPage',
  components: { EPKComponent },
  layout(context) {
    return 'main'
  },

  data() {
    return { title: 'Form EP - EPK' }
  },
  head() {
    return {
      title: `Auratyk | ${this.title}`,
      meta: [
        ...this.meta,
        { hid: 'robots', name: 'robots', content: 'noindex' },
      ],
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
