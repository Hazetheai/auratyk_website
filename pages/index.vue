<template>
  <HomeComponent />
</template>

<script>
import HomeComponent from '@/components/blocks/HomeComponent'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  layout(context) {
    return 'main'
  },

  components: { HomeComponent },
  name: 'IndexPage',

  data() {
    return { title: 'Home' }
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
      title: `Auratyk`,
      meta: [...this.meta],
    }
  },
}
</script>
