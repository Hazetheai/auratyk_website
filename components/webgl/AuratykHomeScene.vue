<template>
  <div class="canvasContainer">
    <div ref="container"></div>
  </div>
</template>

<script>
// import MainThreeScene from '@/plugins/three'

export default {
  name: 'AuratykHomeScene',
  data() {
    return {
      scene: {},
    }
  },
  props: {
    msg: String,
  },
  mounted() {
    this.loadMainThreeScene()
    // console.log('this.scene', this.scene)
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
<style scoped lang="scss">
.canvasContainer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
