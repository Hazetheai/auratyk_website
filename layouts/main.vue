<template>
  <div class="main-layout">
    <AuratykHomeSceneOverlay>
      <main class="main col-10 col-8@sm">
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
    const isProdDomain = /(www\.)?auratyk\.com/.test(window.location.hostname)
    const isStagingDomain = /staging\.auratyk\.com/.test(
      window.location.hostname
    )
    const isLocalDomain = /localhost/.test(window.location.hostname)

    if (isProd && isProdDomain && !isStagingDomain) {
      this.$InsightsAnalytics.init('yES5xEiki5bhfgmw')
      this.$InsightsAnalytics.trackPages()
    }
    console.log('this.$route', this.$route)
    console.log('Is Primary Prod Domain', isProdDomain && !isStagingDomain)
    console.log('Is Staging Domain', isStagingDomain)
    console.log('Is Local Version', isLocalDomain)

    this.$store.commit('isLoaded', true)
  },
}
</script>
