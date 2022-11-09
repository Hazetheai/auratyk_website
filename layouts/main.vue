<template>
  <div class="main-layout">
    <AuratykHomeSceneOverlay>
      <main class="main col-8">
        <Nuxt />
      </main>
    </AuratykHomeSceneOverlay>
  </div>
</template>

<script>
import AuratykHomeSceneOverlay from '@/components/blocks/AuratykHomeSceneOverlay'

export default {
  name: 'MainLayout',
  components: { AuratykHomeSceneOverlay },

  mounted() {
    const isProd = process.env.NODE_ENV === 'production'
    if (isProd) {
      this.$InsightsAnalytics.init('yES5xEiki5bhfgmw')
      this.$InsightsAnalytics.trackPages()
    }
    console.log('this.$route', this.$route)

    this.$store.commit('isLoaded', true)
  },
}
</script>
