<template>
  <AboutComponent />
</template>

<script>
// import MainHeader1 from '../components/G-MainHeader-1.vue'
import AboutComponent from '../components/blocks/AboutComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  name: 'AboutPage',

  components: { AboutComponent },

  layout(context) {
    return 'main'
  },

  data() {
    return { title: 'About' }
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
