<template>
  <div class="three">
    <!-- <MainHeader1 /> -->
    <!-- <Hero /> -->
    <LoadingScreen />
    <TitleScreen />
    <ThreeScene />
  </div>
</template>

<script>
// import MainHeader1 from '../components/G-MainHeader-1.vue'
import Hero from '../components/blocks/hero.vue'
import ThreeScene from '../components/webgl/ThreeScene.vue'
import TitleScreen from '../components/webgl/TitleScreen.vue'
import LoadingScreen from '../components/webgl/LoadingScreen.vue'
export default {
  layout(context) {
    return 'default'
  },
  name: 'IndexPage',
  components: { Hero, ThreeScene, TitleScreen, LoadingScreen },
}
</script>
