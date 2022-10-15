<template>
  <HomeComponent />
</template>

<script>
import HomeComponent from '@/components/blocks/HomeComponent'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  name: 'IndexPage',
  components: { HomeComponent },
  layout(context) {
    return 'main'
  },

  data() {
    return { title: 'Home' }
  },
  head() {
    return {
      title: `Auratyk`,
      meta: [...this.meta],
    }
  },

  computed: {
    meta() {
      const metaData = {
        type: 'website',
        title: this.title,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
