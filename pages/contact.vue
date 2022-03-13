<template>
  <ContactComponent />
</template>

<script>
import ContactComponent from '../components/blocks/ContactComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  layout(context) {
    return 'main'
  },

  name: 'ContactPage',
  components: { ContactComponent },

  data() {
    return { title: 'Contact' }
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
}
</script>
