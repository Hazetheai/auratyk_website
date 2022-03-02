<template>
  <div class="canvasContainer">
    <div ref="container"></div>
  </div>
</template>

<script>
// import MainThreeScene from '@/plugins/three'

export default {
  name: 'AuratykHomeScene',
  props: ['isPlaying'],
  data() {
    return {
      scene: {},
    }
  },
  watch: {
    isPlaying: function (newData, oldData) {
      // console.log('newData', newData)
      // console.log('oldData', oldData)
      // this.$props
      // console.log('this.props.isPlaying', this.$props.isPlaying)

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
      this.scene.init(this.$refs.container)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.canvasContainer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
