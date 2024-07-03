<template>
  <div ref="loadingScreen" class="loadingScreen grid z-index-overlay">
    <div class="col-1 col-2@sm"></div>
    <div class="home main__content col-10 col-8@sm">
      <h1 class="main__content-heading loading-title loading-title--initial">
        <span class="loading-title__letter-wrapper">
          <span class="loading-title__letter">A</span> </span
        ><span class="loading-title__letter-wrapper">
          <span class="loading-title__letter">u</span></span
        ><span class="loading-title__letter-wrapper">
          <span class="loading-title__letter">r</span></span
        ><span class="loading-title__letter-wrapper">
          <span class="loading-title__letter">a</span></span
        ><span class="loading-title__letter-wrapper">
          <span class="loading-title__letter">t</span></span
        ><span class="loading-title__letter-wrapper"
          ><span class="loading-title__letter">y</span></span
        ><span class="loading-title__letter-wrapper">
          <span class="loading-title__letter">k</span></span
        >
      </h1>
      <!-- <p class="main__content-intro max-width-xxs">
        Berlin based Audio/Visual Artist
      </p> -->
    </div>
    <!-- <div class="loading-bar">
      <div
        class="loading-bar-fill"
        :style="{ width: Math.random() * 10 + progress + '%' }"
      ></div>
    </div> -->
    <div class="col-1 col-2@sm"></div>

    <!-- <p class="loading_undertitle">Soundchecking...</p> -->

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

    const clipPath = {
      initial: 'circle(75% at 49% 50%)',
      final: 'circle(15% at 70% 50%)',
      hover: 'circle(0% at 100% 83%)',
    }
    const scaleVal = window.innerWidth <= 768 ? 1.2 : 2.5
    const transformXVal = window.innerWidth <= 768 ? 9 : 4
    const transformYVal = window.innerWidth <= 768 ? 4 : 6
    const tl = this.$gsap.timeline()
    const vm = this
    tl.to('.loading-title', {
      scale: scaleVal,
      position: 'fixed',
      // textTransform: 'uppercase',
      x: window.innerWidth / transformXVal,
      y: window.innerHeight / transformYVal,
    })
      .to('.loading-title', { opacity: 1 })

      .to('.loading-title__letter', {
        x: 0,
        stagger: {
          each: 0.05,
          from: 'left',
          ease: 'power2.inOut',
        },
      })
      .to('.loading-title', {
        y: 0,
        x: 0,
        scale: 1,
      })
      .to('.loadingScreen', {
        borderColor: getComputedStyle(
          document.documentElement
        ).getPropertyValue('--color-accent'),
      })
      .to('.loadingScreen', {
        clipPath: clipPath.hover,
        onComplete() {
          vm.$store.commit('isLoaded')
        },
      })
      // .to('.play-button', { opacity: 1, x: 0 })
      .to('.loadingScreen', {
        opacity: 0,
      })
  },
  methods: {
    loadLoadingController() {
      this.loadingController = this.$LoadingControllerInstance
    },
    onProgress(url, loaded, total) {
      this.progress = (loaded / total) * 100
      this.progressUrl = url
    },
    onLoad() {
      this.$refs.loadingScreen.classList.add('finished')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.loadingScreen {
  width: 100%;
  height: 100%;
  background: var(--color-black);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  font-size: 2em;
  transition: all 400ms ease-in;
  opacity: 1;
  border-color: transparent;
  border-style: solid;
  border-width: 1px;

  font-size: 1em;

  clip-path: circle(75% at 49% 50%);

  &.finished {
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

.loading-title {
  /* font-size: 18vw;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  position: fixed;
  top: 50%;
  left: 50%;
  @include transition;
  transform: translate(-47%, -50%);
  min-width: 90vw; */
  opacity: 0;
  &__letter-wrapper {
    display: inline-block;
    overflow: hidden;
  }
  &__letter {
    display: inline-block;
    transform: translateX(-100%);
  }
}
</style>
