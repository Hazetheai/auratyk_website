<template>
  <!--
    Homepage (HUD version, Nov 2026). Locked to one screen. Small readouts around the edges, like the screen of
    the machine running the show. The point-cloud scene and a silent film of
    read:rites take turns (first in at 5 s, then 15 s on / 15 s off); the film
    toggle keeps it on. No music player on this page. ?static=1 skips the intro.

    Intro (one GSAP timeline, about 3.5 s; replaced the old LoadingScreen):
      the name slides in letter by letter, large, on black
      → it glides down to its place, bottom left, as the black opens like a
        screen switching on (a line across the middle, then top and bottom part)
      → viewfinder corners fly out to the edges
      → the readouts decode in, line by line
      → the nav fades back in.
    The film then scans in top to bottom along a thin accent line, and scans
    out the same way.
  -->
  <div class="hud">
    <div ref="curtain" class="hud__curtain" aria-hidden="true">
      <div
        ref="curtainTop"
        class="hud__curtain-half hud__curtain-half--top"
      ></div>
      <div
        ref="curtainBottom"
        class="hud__curtain-half hud__curtain-half--bottom"
      ></div>
      <div ref="seam" class="hud__seam"></div>
    </div>

    <span
      v-for="c in ['tl', 'tr', 'bl', 'br']"
      :key="c"
      ref="corners"
      :class="`hud__corner hud__corner--${c}`"
      aria-hidden="true"
    ></span>

    <!-- top left: what the film is -->
    <div
      ref="film"
      class="hud__film hud__block"
      :class="{ 'is-live': videoOn }"
    >
      <p>
        <span class="hud__label"><span class="hud__dot"></span>film</span>
        <span class="hud__time">{{ clock(time.t) }} / {{ clock(time.d) }}</span>
      </p>
      <p>
        <span class="hud__label hud__scr">src</span
        ><span class="hud__scr">{{ filmInfo.show }}</span>
      </p>
      <p>
        <span class="hud__label hud__scr">video</span
        ><span class="hud__scr">{{ filmInfo.credit }}</span>
      </p>
    </div>

    <div class="hud__bottom">
      <div class="hud__lower">
        <h1 ref="title" class="hud__title" aria-label="Auratyk">
          <span
            v-for="(l, i) in 'Auratyk'"
            :key="i"
            class="hud__letter-wrap"
            aria-hidden="true"
            ><span class="hud__letter">{{ l }}</span></span
          >
        </h1>

        <div ref="status" class="hud__block hud__status">
          <p>
            <span class="hud__label hud__scr">now</span>
            <span
              ><NuxtLink class="hud__scr" :to="`/projects/${lead.slug}`">{{
                lead.title
              }}</NuxtLink></span
            >
          </p>
          <p v-if="last">
            <span class="hud__label hud__scr">last</span>
            <span class="hud__scr">{{ showLine(last) }}</span>
          </p>
          <p>
            <span class="hud__label hud__scr">next</span>
            <span class="hud__scr">{{
              next ? showLine(next) : `${nextYear} dates tba`
            }}</span>
          </p>
          <p class="hud__links">
            <NuxtLink class="hud__scr" :to="`/projects/${lead.slug}`"
              >[ see the work ]</NuxtLink
            >
            <NuxtLink class="hud__scr" to="/press">[ press kit ]</NuxtLink>
            <a class="hud__scr" href="mailto:info@auratyk.com">[ booking ]</a>
          </p>
        </div>
      </div>

      <button
        ref="toggle"
        class="hud__toggle hud__block"
        :aria-pressed="mode === 'on' ? 'true' : 'false'"
        :title="
          mode === 'on'
            ? 'Film stays on. Click to go back to taking turns with the scene.'
            : 'Film and scene take turns. Click to keep the film on.'
        "
        @click="toggle"
      >
        [ film: {{ mode }} ]
      </button>
    </div>

    <HomeVideoBg ref="video" @time="time = $event" />
  </div>
</template>

<script>
import ScrambleTextPlugin from '@/libs/gsap-bonus/ScrambleTextPlugin'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import HomeVideoBg, { FILM } from '@/components/blocks/HomeVideoBg'
import projectsData from '@/content/notion/projects.json'
import showsData from '@/content/notion/shows.json'

const LEAD_SLUG = 'read-rites-cannibalize'
// Seconds, counted from the start of the intro.
const FIRST = 5
const ON = 15
const OFF = 15
const SCRAMBLE_CHARS = '01/\\<>_-:.*#'

export default {
  name: 'IndexPage',
  components: { HomeVideoBg },
  layout() {
    return 'main'
  },
  data() {
    const lead = projectsData.items.find((p) => p.slug === LEAD_SLUG)
    // now / last / next all follow the lead work, so "last" never points at
    // a different project
    const shows = (showsData.items || [])
      .filter((s) => (s.properties?.projects || []).includes(lead.id))
      .sort((a, b) => (a.properties.date < b.properties.date ? -1 : 1))
    const today = new Date().toISOString().slice(0, 10)
    const past = shows.filter((s) => s.properties.date.slice(0, 10) < today)
    return {
      lead,
      filmInfo: FILM,
      last: past[past.length - 1] || null,
      next: shows.find((s) => s.properties.date.slice(0, 10) >= today) || null,
      nextYear: new Date().getFullYear() + 1,
      mode: 'auto', // 'auto' = takes turns with the scene; 'on' = stays on
      videoOn: false,
      time: { t: 0, d: 0 },
    }
  },
  head() {
    return {
      title: 'Auratyk',
      meta: [...getSiteMeta({ type: 'website' })],
    }
  },
  mounted() {
    this.$gsap.registerPlugin(ScrambleTextPlugin)
    this.$scrollHandlers.disableScroll()
    // This page uses the film instead of the music player.
    if (this.$store.state.isPlaying) this.$store.commit('togglePlay')
    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    // ?static=1 (screenshots, tests): no intro
    this.skipIntro =
      this.reducedMotion || parseInt(this.$route.query.static, 10) === 1
    // site chrome that the intro hides and brings back at the end
    this.chrome = ['.header', '.app-buttons-left']
      .map((s) => document.querySelector(s))
      .filter(Boolean)
    this.playIntro()
    // film comes in FIRST seconds after the intro starts (scaled with it)
    if (!this.reducedMotion)
      this.after(FIRST / (this.intro?.timeScale() || 1), this.filmOn)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.intro?.kill()
    this.filmTl?.kill()
    this.$gsap.set(this.chrome, { clearProps: 'opacity,visibility' })
    this.$scrollHandlers.enableScroll()
  },
  methods: {
    // ---- intro -----------------------------------------------------------
    playIntro() {
      const gsap = this.$gsap
      const {
        title,
        curtain,
        curtainTop,
        curtainBottom,
        seam,
        film,
        status,
        toggle,
      } = this.$refs
      const corners = this.$refs.corners
      const letters = title.querySelectorAll('.hud__letter')
      const scr = [
        ...film.querySelectorAll('.hud__scr'),
        ...status.querySelectorAll('.hud__scr'),
      ]
      const lines = [
        ...film.querySelectorAll('p'),
        ...status.querySelectorAll('p'),
      ]

      if (this.skipIntro) {
        gsap.set(curtain, { display: 'none' })
        return
      }

      // Start: the name, big, near the middle of the screen, on black.
      const r = title.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const scale = Math.min(2.2, (vw * 0.8) / r.width)
      const lineTexts = scr.map((el) => el.textContent)

      gsap.set(title, {
        x: vw / 2 - (r.left + r.width / 2),
        y: vh * 0.45 - (r.top + r.height / 2),
        scale,
        transformOrigin: '50% 50%',
      })
      gsap.set(letters, { xPercent: -110 })
      gsap.set(lines, { autoAlpha: 0 })
      gsap.set([toggle, ...this.chrome], { autoAlpha: 0 })
      gsap.set(seam, { scaleX: 0, autoAlpha: 1 })
      gsap.set(corners, {
        autoAlpha: 0,
        x: (i) => (i % 2 ? -1 : 1) * vw * 0.35,
        y: (i) => (i < 2 ? 1 : -1) * vh * 0.35,
      })

      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
      this.intro = tl
      // Coming back to Home in the same visit: same intro, 2.5× faster.
      try {
        if (sessionStorage.getItem('hud-intro-seen')) tl.timeScale(2.5)
        sessionStorage.setItem('hud-intro-seen', '1')
      } catch (e) {}
      tl.to(
        letters,
        { xPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05 },
        0.15
      )
        // the name settles into place while the screen switches on
        .to(title, { x: 0, y: 0, scale: 1, duration: 1.1 }, 1.0)
        .to(seam, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, 1.15)
        .to(curtainTop, { yPercent: -100, duration: 0.85 }, 1.45)
        .to(curtainBottom, { yPercent: 100, duration: 0.85 }, 1.45)
        .to(seam, { autoAlpha: 0, duration: 0.4 }, 1.85)
        .set(curtain, { display: 'none' }, 2.35)
        // viewfinder corners fly out to the edges
        .to(
          corners,
          { autoAlpha: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.out' },
          1.9
        )
        // readouts decode in, line by line
        .to(
          lines,
          { autoAlpha: 1, duration: 0.2, stagger: 0.07, ease: 'none' },
          2.1
        )
      scr.forEach((el, i) => {
        el.textContent = ''
        tl.to(
          el,
          {
            duration: 0.5,
            scrambleText: {
              text: lineTexts[i],
              chars: SCRAMBLE_CHARS,
              speed: 0.6,
              revealDelay: 0.15,
            },
            ease: 'none',
          },
          2.1 + i * 0.045
        )
      })
      tl.to(toggle, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, 2.8)
        .to(
          this.chrome,
          { autoAlpha: 1, duration: 0.6, ease: 'power1.out' },
          2.9
        )
        .add(() => gsap.set(this.chrome, { clearProps: 'opacity,visibility' }))
    },

    // ---- film ------------------------------------------------------------
    after(sec, fn) {
      clearTimeout(this.timer)
      this.timer = setTimeout(fn, sec * 1000)
    },
    filmOn() {
      this.scanIn()
      if (this.mode === 'auto') this.after(ON, this.filmOff)
    },
    filmOff() {
      this.scanOut()
      if (this.mode === 'auto' && !this.reducedMotion)
        this.after(OFF, this.filmOn)
    },
    toggle() {
      if (this.mode === 'auto') {
        this.mode = 'on'
        clearTimeout(this.timer)
        if (!this.videoOn) this.scanIn()
      } else {
        // back to taking turns: finish a normal "on" stretch, then cycle
        this.mode = 'auto'
        if (this.reducedMotion) this.filmOff()
        else this.after(ON, this.filmOff)
      }
    },
    // The film is wiped in from the top, behind a thin accent line, with a
    // slight push-in; out the same way, so it reads like a screen refresh.
    scanIn() {
      if (this.videoOn) return
      this.videoOn = true
      const gsap = this.$gsap
      const { clip, scan } = this.$refs.video.$refs
      const video = clip.querySelector('video')
      const d = this.reducedMotion ? 0 : 1.2
      this.filmTl?.kill()
      this.$refs.video.play()
      this.filmTl = gsap
        .timeline()
        .set(clip, { clipPath: 'inset(0% 0% 100% 0%)', autoAlpha: 1 })
        .set(scan, { top: '0%', autoAlpha: d ? 1 : 0 })
        .to(
          clip,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: d, ease: 'power2.inOut' },
          0
        )
        .to(scan, { top: '100%', duration: d, ease: 'power2.inOut' }, 0)
        .to(scan, { autoAlpha: 0, duration: 0.25 }, d * 0.85)
        .fromTo(
          video,
          { scale: 1.06 },
          { scale: 1, duration: d * 2.5, ease: 'power2.out' },
          0
        )
    },
    scanOut() {
      if (!this.videoOn) return
      this.videoOn = false
      const gsap = this.$gsap
      const { clip, scan } = this.$refs.video.$refs
      const d = this.reducedMotion ? 0 : 1.1
      this.filmTl?.kill()
      this.filmTl = gsap
        .timeline({ onComplete: () => this.$refs.video?.pause() })
        .set(scan, { top: '0%', autoAlpha: d ? 1 : 0 })
        .to(
          clip,
          {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: d,
            ease: 'power2.inOut',
          },
          0
        )
        .to(scan, { top: '100%', duration: d, ease: 'power2.inOut' }, 0)
        .to(scan, { autoAlpha: 0, duration: 0.25 }, d * 0.85)
    },

    // ---- formatting ------------------------------------------------------
    clock(s) {
      const n = Math.floor(s || 0)
      return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(
        n % 60
      ).padStart(2, '0')}`
    },
    showLine(s) {
      const name = s.title.replace(/\s\d{4}$/, '')
      return `${name} · ${s.properties.city} · ${this.shortDate(
        s.properties.date
      )}`
    },
    shortDate(d) {
      const x = new Date(d)
      const p = (n) => String(n).padStart(2, '0')
      return `${p(x.getDate())}.${p(x.getMonth() + 1)}.${String(
        x.getFullYear()
      ).slice(2)}`
    },
  },
}
</script>

<style lang="scss">
.hud {
  position: relative;
  height: 100vh;
  height: 100svh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  // top: clear the header on phones (Bandcamp button sits top left there);
  // from sm up the readout sits level with the nav
  padding: calc(var(--header-height) + var(--space-xs)) 0 var(--space-lg);
  @include breakpoint(sm) {
    padding: var(--space-lg) 0 var(--space-xl);
  }
}

// ---- intro curtain: black, opens from the middle like a screen switching on
.hud__curtain {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.hud__curtain-half {
  position: absolute;
  left: 0;
  right: 0;
  height: 50.5%;
  background: #000; // same black as the scene
  &--top {
    top: 0;
  }
  &--bottom {
    bottom: 0;
  }
}
.hud__seam {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: var(--color-accent);
  box-shadow: 0 0 14px 1px var(--color-accent);
  transform: scaleX(0);
}

// ---- viewfinder corners
.hud__corner {
  position: fixed;
  z-index: 2;
  width: 14px;
  height: 14px;
  pointer-events: none;
  opacity: 0.45;
  border: 0 solid var(--color-contrast-high, #ccc);
  --inset: 14px;
  @include breakpoint(sm) {
    width: 18px;
    height: 18px;
    --inset: 22px;
  }
  &--tl {
    top: var(--inset);
    left: var(--inset);
    border-top-width: 1px;
    border-left-width: 1px;
  }
  &--tr {
    top: var(--inset);
    right: var(--inset);
    border-top-width: 1px;
    border-right-width: 1px;
  }
  &--bl {
    bottom: var(--inset);
    left: var(--inset);
    border-bottom-width: 1px;
    border-left-width: 1px;
  }
  &--br {
    bottom: var(--inset);
    right: var(--inset);
    border-bottom-width: 1px;
    border-right-width: 1px;
  }
}

// ---- readouts
.hud__block {
  position: relative;
  z-index: 2;
  font-family: var(--font-secondary);
  font-size: 0.8125rem;
  line-height: 1.7;
  letter-spacing: 0.01em;
  color: var(--color-contrast-high, #ddd);

  p {
    margin: 0;
  }
  // label column + value column, so values line up and wrap under themselves
  p:not(.hud__links) {
    display: grid;
    grid-template-columns: 7ch minmax(0, 1fr);
  }
  a {
    color: var(--color-accent);
    text-decoration: none;
    &:hover {
      color: var(--color-contrast-higher, #fff);
    }
  }
}
.hud__label {
  opacity: 0.5;
  white-space: nowrap;
}

// top left: film readout, dim while the scene is showing
.hud__film {
  align-self: start;
  opacity: 0.5;
  transition: opacity 1.2s ease;
  &.is-live {
    opacity: 1;
  }
}
.hud__dot {
  display: inline-block;
  width: 0.55em;
  height: 0.55em;
  margin-right: 1ch;
  border: 1px solid currentColor;
  border-radius: 50%;
  vertical-align: 0.05em;
  transition: background-color 0.6s, border-color 0.6s;
  .is-live & {
    background: #e5484d; // "rec" red
    border-color: #e5484d;
    animation: hud-blink 2s steps(1) infinite;
  }
}
@keyframes hud-blink {
  50% {
    opacity: 0.3;
  }
}

// ---- bottom: name above the status lines; film toggle on the right
.hud__bottom {
  grid-row: 3;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-md);
}
.hud__title {
  position: relative;
  z-index: 2;
  margin: 0 0 var(--space-sm);
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: clamp(3.75rem, 17vw, 6rem);
  line-height: 0.95;
  letter-spacing: -0.01em;
  white-space: nowrap;
  @include breakpoint(sm) {
    font-size: clamp(5rem, 9vw, 9rem);
    margin-bottom: var(--space-md);
  }
}
.hud__letter-wrap {
  display: inline-block;
  overflow: hidden;
  // room for the descender of the y
  padding-bottom: 0.12em;
  margin-bottom: -0.12em;
}
.hud__letter {
  display: inline-block;
}
.hud__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0 2ch;
  margin-top: var(--space-sm) !important;
}
.hud__toggle {
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: var(--color-accent);
  text-transform: none;
  &:hover {
    color: var(--color-contrast-higher, #fff);
  }
}
</style>
