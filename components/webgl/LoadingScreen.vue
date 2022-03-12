<template>
  <div ref="loadingScreen" class="loadingScreen">
    <h2>Soundchecking...</h2>
    <!-- <p class="loading_undertitle">Soundchecking...</p> -->
    <div class="loading-bar">
      <div
        class="loading-bar-fill"
        :style="{ width: Math.random() * 10 + progress + '%' }"
      ></div>
    </div>
    <!-- <div class="progress-url">{{ progressUrl }}</div> -->
  </div>
</template>

<script>
// import LoadingController from "../classes/LoadingControllerClass";
export default {
  name: 'LoadingScreen',
  data() {
    return {
      progress: 0,
      progressUrl: '',
      loadingController: {},
    }
  },
  mounted() {
    this.loadLoadingController()
    this.loadingController.onProgress = this.onProgress
    this.loadingController.onLoad = this.onLoad
  },
  methods: {
    loadLoadingController() {
      this.loadingController = this.$LoadingControllerInstance
    },
    onProgress(url, loaded, total) {
      console.log('url in component', url)

      this.progress = (loaded / total) * 100
      this.progressUrl = url
    },
    onLoad() {
      console.log('comp loaded')
      this.$refs.loadingScreen.classList.add('finished')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.loadingScreen {
  width: 100vw;
  height: 100vh;
  background: var(--color-black);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  font-size: 2em;
  transition: all 400ms ease-in;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1em;

  &.finished {
    opacity: 0;
    transition: all 400ms ease-in;
    pointer-events: none;
  }
}

.loading-bar {
  width: 30vw;
  height: 1rem;
  border-radius: 100vw;
  background: var(--color-black);
  overflow: hidden;
  margin: 1rem;
}
.loading-bar-fill {
  background: var(--color-accent);
  transition: width 0.3s;
  height: 100%;
}

.progress-url {
  color: var(--color-gray);
}
</style>
