<template>
  <div>
    <div
      @keyup.esc="toggleMenu('close')"
      class="app-container grid"
      :class="
        this.$store.state.menuOpen
          ? 'app-container--menu-open'
          : 'app-container--menu-closed'
      "
    >
      <header class="header grid position-fixed top-0 left-0">
        <div class="col-2"></div>
        <div class="flex justify-start justify-end@sm items-center col-8">
          <a
            @click="logsnagBandcamp"
            class="bandcamp-follow z-index-fixed-element flex items-center justify-between"
            href="https://auratyk.bandcamp.com/follow_me"
            target="_blank"
          >
            <!-- <icon-bandcamp-circle-0 class="icon" :width="16" /> -->
            <strong>Follow&nbsp;</strong>on Bandcamp</a
          >
        </div>
        <div class="col-2">
          <button
            @click="toggleMenu('open')"
            class="menu-btn btn btn--clear margin-y-md hide@sm"
          >
            <icon-menu :width="48" />
          </button>
        </div>
      </header>
      <aside class="aside col-2 flex flex-column justify-evenly"></aside>

      <!-- Page Content - <main/> -->
      <slot />
      <!--  -->
      <div class="col-2"></div>
      <FooterComponent v-if="$route.path !== '/'" />
    </div>
    <div
      class="app-buttons-left position-fixed flex flex-column justify-between z-index-fixed-element"
    >
      <button
        v-if="!this.menuOpen"
        @click="toggleMenu"
        class="btn btn--clear menu-btn margin-y-md display@sm"
      >
        <icon-menu :width="48" />
      </button>
      <!-- <button
        v-if="!this.$store.state.menuOpen"
        class="btn btn--clear settings-btn margin-y-md"
      >
        <icon-line-button
          class="settings-btn__line"
          :width="48"
          :stroke-width="0.5"
        />
        <icon-settings class="settings-btn__icon" :width="32" />
      </button> -->
    </div>
    <div
      v-if="
        (this.$store.state.menuOpen && $route.path !== '/') ||
        $route.path === '/'
      "
      class="play-button play-button--home z-index-overlay"
      :class="this.$store.state.isLoaded && 'play-button--animate'"
    >
      <button
        v-if="this.$store.state.isPlaying"
        class="btn btn--clear"
        @click="togglePlay"
        :stroke-width="0.5"
      >
        <icon-equalizer class="animation" />
      </button>
      <button v-else class="btn btn--clear" @click="togglePlay">
        <icon-equalizer class="animation-none" />
      </button>
    </div>

    <div
      class="menu-overlay grid z-index-fixed-element position-fixed"
      :class="
        this.$store.state.menuOpen
          ? 'menu-overlay--menu-open'
          : 'menu-overlay--menu-closed'
      "
    >
      <div class="col-2"></div>
      <div
        class="menu-overlay__container col-8 padding-y-lg flex flex-column position-relative"
      >
        <button
          class="menu-overlay__close btn btn--clear position-absolute top-xl right-0 display@sm"
          @click="toggleMenu('close')"
        >
          <icon-close class="" :width="32" />
        </button>

        <div
          class="flex justify-between margin-top-md margin-top-xxl@sm items-end"
        >
          <nav class="main-menu padding-y-sm">
            <ul
              class="main-menu__list flex flex-column justify-between padding-top-md"
            >
              <li
                v-show="$route.path !== '/'"
                class="main-menu__list-item text-lg padding-y-sm"
              >
                <NuxtLink to="/" event="" v-slot="{ route, href }" custom>
                  <a :href="href" @click.prevent="toggleMenu('close', route)">
                    Home
                  </a>
                </NuxtLink>
              </li>
              <li
                v-show="$route.path !== '/about'"
                class="main-menu__list-item text-lg padding-y-sm"
              >
                <NuxtLink to="/about" event="" v-slot="{ route, href }" custom>
                  <a :href="href" @click.prevent="toggleMenu('close', route)">
                    About
                  </a>
                </NuxtLink>
              </li>
              <li
                v-show="$route.path !== '/shows'"
                class="main-menu__list-item text-lg padding-y-sm"
              >
                <NuxtLink to="/shows" event="" v-slot="{ route, href }" custom>
                  <a :href="href" @click.prevent="toggleMenu('close', route)">
                    Shows
                  </a>
                </NuxtLink>
              </li>
              <li
                v-show="$route.path !== '/releases'"
                class="main-menu__list-item text-lg padding-y-sm"
              >
                <NuxtLink
                  to="/releases"
                  event=""
                  v-slot="{ route, href }"
                  custom
                >
                  <a :href="href" @click.prevent="toggleMenu('close', route)">
                    Releases
                  </a>
                </NuxtLink>
              </li>
              <li
                v-show="$route.path !== '/contact'"
                class="main-menu__list-item text-lg padding-y-sm"
              >
                <NuxtLink
                  to="/contact"
                  event=""
                  v-slot="{ route, href }"
                  custom
                >
                  <a :href="href" @click.prevent="toggleMenu('close', route)">
                    Contact
                  </a>
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
        <hr class="hr margin-y-sm" />
        <nav class="social-menu">
          <ul
            class="social-menu__list flex flex-column flex-row@sm justify-between items-center@sm"
          >
            <li class="social-menu__list-item padding-y-sm padding-y-0@sm">
              <a
                target="_blank"
                rel="noopener nofollow"
                :href="this.socials.instagram"
              >
                Instagram</a
              >
            </li>
            <li class="social-menu__list-item padding-y-sm padding-y-0@sm">
              <a
                target="_blank"
                rel="noopener nofollow"
                :href="this.socials.soundcloud"
              >
                SoundCloud</a
              >
            </li>
            <li class="social-menu__list-item padding-y-sm padding-y-0@sm">
              <a
                target="_blank"
                rel="noopener nofollow"
                :href="this.socials.bandcamp"
              >
                Bandcamp</a
              >
            </li>
            <li class="social-menu__list-item padding-y-sm padding-y-0@sm">
              <a
                target="_blank"
                rel="noopener nofollow"
                :href="this.socials.youtube"
              >
                Youtube</a
              >
            </li>
          </ul>
        </nav>
        <!-- <div
          v-if="this.$store.state.isPlaying"
          @click="togglePlay"
          class="play-button play-button--menu padding-x-xxl"
        >
          <button class="btn btn--clear">
            <icon-equalizer class="animation-none" />
          </button>
        </div> -->
      </div>
      <div class="col-2">
        <button
          @click="toggleMenu('close')"
          class="menu-btn btn btn--clear margin-y-md hide@sm"
        >
          <icon-close class="" :width="32" />
        </button>
      </div>
    </div>
    <AuratykHomeScene :isPlaying="this.$store.state.isPlaying" />
  </div>
</template>

<script>
import AuratykHomeScene from '@/components/webgl/AuratykHomeScene.vue'
import FooterComponent from '@/components/app/FooterComponent'
import socials from '@/assets/js/utils/getSocials'
export default {
  components: { AuratykHomeScene, FooterComponent },
  data() {
    return { menuOpen: false, isPlaying: false, socials }
  },
  created() {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.addEventListener(
        'keyup',
        (e) => {
          if (e.key === 'Escape') {
            this.toggleMenu('close')
          }
        },
        false
      )
    }
  },

  methods: {
    logsnagBandcamp() {
      this.$logsnag.publish({
        project: 'auratyk_website',
        channel: 'main',
        event: `User clicked bandcamp follow link`,
        icon: '🎸',
        notify: true,
      })
    },
    togglePlay() {
      // const { isPlaying } = this.$store.state
      this.$store.commit('togglePlay')
    },
    // eslint-disable-next-line require-await
    async toggleMenu(override, route) {
      const { menuOpen } = this.$store.state

      if (override === 'close' || this.menuOpen) {
        this.$scrollHandlers.enableScroll()
      } else {
        this.$scrollHandlers.disableScroll()
      }

      const tl = this.$gsap.timeline()

      tl.to('.main-menu__list-item', {
        opacity: menuOpen ? 0 : 1,
        y: menuOpen ? 30 : 0,
        duration: 0.3,
        stagger: {
          each: 0.1,
          ease: 'power2.inOut',
        },
      })

      tl.to('.social-menu__list-item', {
        opacity: menuOpen ? 0 : 1,
        x: menuOpen ? -30 : 0,
        duration: 0.3,
        stagger: {
          each: 0.05,
          from: 'center',
          ease: 'power2.inOut',
        },
      })

      tl.to('.main-menu__list-item', {
        opacity: override === 'close' ? 0 : 1,
        y: override === 'close' ? 30 : 0,
        duration: 0.3,
        stagger: {
          each: 0.1,
          ease: 'power2.inOut',
        },
      })

      tl.to('.social-menu__list-item', {
        opacity: override === 'close' ? 0 : 1,
        x: override === 'close' ? -30 : 0,
        duration: 0.3,
        stagger: {
          each: 0.1,
          ease: 'power2.inOut',
        },
      })

      this.$store.commit('toggleMenu', override)

      if (route && override === 'close') {
        setTimeout(() => {
          this.$router.push(route)
        }, 150)
      }
    },
  },
  mounted() {
    const vm = this
    navigator.mediaSession.setActionHandler('play', () => {
      // Do something more than just playing audio...
      vm.togglePlay()
    })
    navigator.mediaSession.setActionHandler('pause', () => {
      // Do something more than just playing audio...
      vm.togglePlay()
    })
  },
}
</script>

<style lang="scss">
.app-container {
  max-height: 100vh;
  @include transition;

  &--menu-open {
    filter: blur(6px);
    @include transition;
    opacity: 0.7;
  }
  &--menu-closed {
    filter: none;
    @include transition-d-400;
    opacity: 1;
  }
}

.main {
  height: 100%;

  &__content {
    @include transition-d-200;
    padding-top: var(--space-xxxl);

    &-heading {
      font-size: var(--text-xxxxl);
      font-weight: 400;
    }
    &-intro {
      padding: var(--space-md) 0;
    }
  }
}

.header {
  height: var(--header-height);
  background: var(--color-black);
  @include breakpoint(sm) {
    background: transparent;
  }
}

.aside {
  height: 100vh;
  justify-content: center;
  align-items: flex-start;
}

.app-buttons-left {
  top: var(--space-xxxl);
  left: -7px;
}

.btn--clear.menu-btn {
  position: relative;
}

.bandcamp-follow {
  font-size: var(--text-xs);
  color: var(--color-white);
  /* border: 0.5px solid #00a1c6; */
  border: 0.5px solid var(--color-accent);
  border-radius: 4px;
  padding: var(--space-xxxs) var(--space-xs);
  text-decoration: none;
  align-items: center;
  @include transition-d-200;

  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    border-width: 1px;
  }
  & .icon {
    margin-right: var(--space-xxs);
  }

  &:hover {
    text-decoration: underline;
    color: var(--color-primary);
    /* background: #00a1c6; */
    background: var(--color-accent);
    @include transition;
    opacity: 0.9;
  }
}

.play-button {
  position: fixed;
  right: 0%;
  bottom: 8%;
  opacity: 0;
  transform: translateX(30px);
  &--animate {
    animation: fade-up 700ms ease-in;
    opacity: 1;
    transform: translateX(0);
  }

  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    right: 0%;
    bottom: 10%;
  }
}

.settings-btn {
  @include transition-d-200;
  margin-left: calc(-1 * var(--space-sm));
  &:hover > &__icon {
    opacity: 1;
  }

  &__icon {
    @include transition-d-200;
    opacity: 0;
  }
}

.menu-overlay {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0.8;
  @include transition-d-200;

  &--menu-open {
    opacity: 0.8;
    pointer-events: auto;
    visibility: visible;
    @include transition-d-200;
  }
  &--menu-closed {
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
    @include transition-d-200;
  }
  &__container {
    /* padding: var(--space-xxxl) 0 var(--space-xxl) 0; */
    height: 100%;
    position: relative;
  }
}

.main-menu {
  position: relative;
  width: fit-content;

  &__list {
    &-item {
      transform: translateY(30px);
      opacity: 0;
      & a {
        color: var(--color-accent);
      }
    }
  }
}

.social-menu {
  &__list {
    &-item {
      transform: translateX(-30px);
      opacity: 0;
      & a {
        color: var(--color-accent);
      }
    }
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateX(30px);
    filter: blur(3px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0);
  }
}
</style>
