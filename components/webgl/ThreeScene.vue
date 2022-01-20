<template>
  <div class="threeScene">
    <div ref="container"></div>
  </div>
</template>

<script>
// import MainThreeScene from '@/plugins/three'

export default {
  name: 'ThreeScene',
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
      this.scene = this.$MainThreeSceneInstance
      this.scene.init(this.$refs.container)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css"></style>
