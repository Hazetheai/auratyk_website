<template>
  <div>
    <HomeComponent />
    <LoadingScreen v-if="parseInt($route.query.static, 10) !== 1" />
  </div>
</template>

<script>
import HomeComponent from '@/components/blocks/HomeComponent'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import LoadingScreen from '@/components/webgl/LoadingScreen'

export default {
  name: 'IndexPage',
  components: { HomeComponent, LoadingScreen },
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
        // title: this.title,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
