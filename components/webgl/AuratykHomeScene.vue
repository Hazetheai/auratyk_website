<template>
  <div class="canvasContainer">
    <div ref="container"></div>
  </div>
</template>

<script>
// import MainThreeScene from '@/plugins/three'
import { logger, getFileName } from '@/assets/js/utils/environment'

export default {
  name: 'AuratykHomeScene',
  props: ['isPlaying'],
  data() {
    return {
      scene: {},
    }
  },
  watch: {
    isPlaying(newData, oldData) {
      if (this.$props.isPlaying) {
        this.$AuratykHomeSceneInstance.play()
      } else this.$AuratykHomeSceneInstance.pause()
    },
  },

  mounted() {
    this.loadMainThreeScene()
  },

  methods: {
    loadMainThreeScene() {
      this.scene = this.$AuratykHomeSceneInstance
      this.scene.init(this.$refs.container, this.$store.state.currentTrack)
      logger('scene loaded', this.scene, getFileName(__filename))
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.canvasContainer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
