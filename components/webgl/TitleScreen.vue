<template>
  <div class="title-screen">
    <div class="title">
      <h1>Spikey Boy</h1>
      <p>This summer. C19 gives you the 411</p>
    </div>
    <div class="bottom-section">
      <div class="footnote">
        <h2>Isolation Tapes iii</h2>
        <p>Music by <a target="_blank" href="http://auratyk.com">Auratyk</a></p>
      </div>
      <div class="buttons">
        <button class="play-button" v-if="playFlag === false" @click="onPlay()">
          Play
        </button>
        <button
          class="pause-button"
          v-if="playFlag === true"
          @click="onPause()"
        >
          Pause
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// import SoundReactor from "../classes/SoundReactor";
export default {
  name: 'TitleScreen',
  data() {
    return { initFlag: false, playFlag: false, soundReactor: {} }
  },

  mounted() {
    this.loadSoundReactor()
  },
  methods: {
    loadSoundReactor() {
      this.soundReactor = this.$SoundReactorInstance
      console.log('this.soundReactor', this.soundReactor)
      console.log('this.$SoundReactorInstance', this.$SoundReactorInstance)
    },
    onPlay() {
      if (this.initFlag === false) {
        this.soundReactor.init()
        this.initFlag = true
      }
      this.soundReactor.play()
      this.playFlag = true
    },
    onPause() {
      if (this.playFlag === true) {
        this.soundReactor.pause()
        this.playFlag = false
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.title-screen {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: 15vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
  color: var(--color-accent);

  .title {
    h1,
    h2,
    h3 {
      color: var(--color-accent);
    }
    p {
      color: var(--color-accent);
    }
  }

  .bottom-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }

  a {
    pointer-events: auto;
  }

  button {
    padding: 10px 30px;
    background: var(--color-primary);
    border: none;
    cursor: pointer;
    color: #fff;
    margin-top: 10px;
    text-transform: uppercase;
    font-weight: 700;
    border-radius: 200px;
    border: 2px solid #bc13fe;
    transition: all 0.3s;
    pointer-events: auto;
    &:hover {
      background: transparent;
    }
  }
}
</style>
