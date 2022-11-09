<template>
  <div class="main-layout">
    <AuratykHomeSceneOverlay>
      <main class="main col-8">
        <Nuxt />
      </main>
    </AuratykHomeSceneOverlay>

    <LoadingScreen v-if="parseInt($route.query.static, 10) !== 1" />
  </div>
</template>

<script>
import AuratykHomeSceneOverlay from '@/components/blocks/AuratykHomeSceneOverlay'
import LoadingScreen from '@/components/webgl/LoadingScreen'

export default {
  name: 'MainLayout',
  components: { AuratykHomeSceneOverlay, LoadingScreen },

  mounted() {
    const isProd = process.env.NODE_ENV === 'production'
    if (isProd) {
      this.$InsightsAnalytics.init('yES5xEiki5bhfgmw')
      this.$InsightsAnalytics.trackPages()
    }

    if (parseInt(this.$route.query.static, 10) === 1)
      this.$store.commit('isLoaded')
  },
}
</script>
