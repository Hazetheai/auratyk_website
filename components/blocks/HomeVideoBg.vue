<template>
  <!-- Full-screen, silent performance film for the homepage. It sits over the
       point-cloud scene and under the page text. The homepage animates it
       (GSAP on the `clip` and `scan` refs) and calls play() / pause(). -->
  <div ref="layer" class="home-video-bg" aria-hidden="true">
    <div ref="clip" class="home-video-bg__clip">
      <video
        ref="video"
        :src="src"
        :poster="poster"
        muted
        loop
        playsinline
        preload="auto"
        disablepictureinpicture
        @timeupdate="
          $emit('time', {
            t: $event.target.currentTime,
            d: $event.target.duration || 0,
          })
        "
      ></video>
      <div class="home-video-bg__shade"></div>
    </div>
    <div ref="scan" class="home-video-bg__scan"></div>
  </div>
</template>

<script>
// Placeholder loop cut from Isabelle Schmitz's BNMW 2026 film of read:rites.
// Swap for the trailer once it exists. Built by Dropbox/Auratyk/website/media/_build/home-loop.py
const SOURCES = {
  wide: '/video/home-loop-readrites-16x9',
  tall: '/video/home-loop-readrites-9x16',
}

// What the film is, for the homepage readout.
export const FILM = {
  work: 'read:rites | cannibalize',
  show: 'BNMW 2026, The Space',
  credit: 'Isabelle Schmitz',
}

export default {
  name: 'HomeVideoBg',
  data() {
    return { base: SOURCES.wide }
  },
  computed: {
    src() {
      return `${this.base}.mp4`
    },
    poster() {
      return `${this.base}-poster.jpg`
    },
  },
  mounted() {
    if (window.matchMedia('(max-aspect-ratio: 1/1)').matches)
      this.base = SOURCES.tall
    // Move to <body> so `position: fixed` isn't trapped by a transformed parent
    // and the layer stacks just above the WebGL canvas.
    document.body.appendChild(this.$refs.layer)
    document.body.classList.add('has-home-video')
  },
  beforeDestroy() {
    this.$refs.layer?.remove()
    document.body.classList.remove('has-home-video')
  },
  methods: {
    play() {
      this.$refs.video?.play().catch(() => {})
    },
    pause() {
      this.$refs.video?.pause()
    },
  },
}
</script>

<style lang="scss">
.home-video-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
// the film starts hidden; the homepage scans it in
.home-video-bg__clip {
  position: absolute;
  inset: 0;
  overflow: hidden;
  clip-path: inset(0% 0% 100% 0%);
}
// a thin accent line that rides the edge of the scan transition
.home-video-bg__scan {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  opacity: 0;
  background: var(--color-accent);
  box-shadow: 0 0 12px 1px var(--color-accent);
}
// The header's solid black band would sit over the film as a box; fade it instead.
.has-home-video .header {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}
// Keeps the site's type readable over bright footage.
.home-video-bg__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.65) 0%,
      rgba(0, 0, 0, 0.25) 55%,
      rgba(0, 0, 0, 0.1) 100%
    ),
    linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 25%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%);
}
</style>
