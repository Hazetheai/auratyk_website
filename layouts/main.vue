<template>
  <div class="main-layout">
    <AuratykHomeSceneOverlay>
      <main class="main col-8">
        <Nuxt />
      </main>
    </AuratykHomeSceneOverlay>
    <LoadingScreen />
  </div>
</template>

<script>
import AuratykHomeSceneOverlay from '@/components/blocks/AuratykHomeSceneOverlay'
import LoadingScreen from '@/components/webgl/LoadingScreen'
export default {
  name: 'MainLayout',
  components: { AuratykHomeSceneOverlay, LoadingScreen },
}
</script>
