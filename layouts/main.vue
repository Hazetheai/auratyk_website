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
    const isProdDomain = /auratyk\.com/.test(window.location.hostname)
    const isStagingDomain = /staging\.auratyk\.com/.test(
      window.location.hostname
    )
    const isLocalDomain = /localhost/.test(window.location.hostname)

    if (isProd && /(www\.)?auratyk\.com/.test(window.location.hostname)) {
      this.$InsightsAnalytics.init('yES5xEiki5bhfgmw')
      this.$InsightsAnalytics.trackPages()
    }
    console.log('this.$route', this.$route)
    console.log('Is Primary Prod Domain', isProdDomain)
    console.log('Is Staging Domain', isStagingDomain)
    console.log('Is Local Version', isLocalDomain)

    this.$store.commit('isLoaded', true)
  },
}
</script>
