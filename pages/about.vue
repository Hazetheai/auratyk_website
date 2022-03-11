<template>
  <AboutComponent />
</template>

<script>
// import MainHeader1 from '../components/G-MainHeader-1.vue'
import AboutComponent from '../components/blocks/AboutComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  layout(context) {
    return 'main'
  },
  scrollToTop: true,
  data() {
    return { title: 'About' }
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
          href: `https://auratyk.com/about`,
        },
      ],
    }
  },
  name: 'AboutPage',
  components: { AboutComponent },
}
</script>
