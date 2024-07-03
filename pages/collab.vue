<template>
  <CollabComponent />
</template>

<script>
import CollabComponent from '../components/blocks/CollabComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  name: 'CollabPage',
  components: { CollabComponent },
  layout(context) {
    return 'main'
  },

  data() {
    return { title: 'Collab' }
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
        description: `Music videos & visualisers, interactive
          installations, tracks etc. Let me know!`,
        url: `${this.$config.baseUrl}${this.$route.path}`,
        // mainImage: this.article.image,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
