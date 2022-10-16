<template>
  <div class="main-layout">
    <AuratykHomeSceneOverlay>
      <main class="main col-8">
        <Nuxt />
      </main>
    </AuratykHomeSceneOverlay>

    <LoadingScreen v-if="!isStatic" />
  </div>
</template>

<script>
import AuratykHomeSceneOverlay from '@/components/blocks/AuratykHomeSceneOverlay'
import LoadingScreen from '@/components/webgl/LoadingScreen'

export default {
  name: 'MainLayout',
  components: { AuratykHomeSceneOverlay, LoadingScreen },
  data() {
    return {
      isStatic: true,
    }
  },
  created(args) {
    const isStatic = this.$route.query?.static === '1'
    this.isStatic = isStatic
    this.$store.commit('isLoaded')
  },
  mounted() {
    this.isStatic = false
    const isProd = process.env.NODE_ENV === 'production'
    if (isProd) {
      this.$InsightsAnalytics.init('yES5xEiki5bhfgmw')
      this.$InsightsAnalytics.trackPages()
    }
  },
}
</script>
