<template>
  <LegalInfoComponent />
</template>

<script>
import LegalInfoComponent from '../components/blocks/LegalInfoComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  layout(context) {
    return 'main'
  },

  name: 'LegalInfoPage',
  components: { LegalInfoComponent },
  scrollToTop: true,
  data() {
    return { title: 'Legal Info' }
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
          href: `https://auratyk.com/legal`,
        },
      ],
    }
  },
}
</script>
