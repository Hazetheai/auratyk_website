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
  // mounted() {
  //   const tl = this.$gsap.timeline()

  //   tl.to('main', {
  //     opacity: 1,
  //     y: 0,
  //     duration: 3,
  //     stagger: {
  //       each: 0.1,
  //       ease: 'power2.inOut',
  //     },
  //   })
  // },
}
</script>
