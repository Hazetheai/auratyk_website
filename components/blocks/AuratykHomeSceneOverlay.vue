<template>
  <div>
    <div class="app-container grid">
      <header class="grid">
        <div class="col-2"></div>
        <div class="flex justify-start items-center col-10">
          <a
            class="bandcamp-follow flex items-center justify-between"
            href="https://auratyk.bandcamp.com/follow_me"
            target="_blank"
          >
            <icon-bandcamp-circle-0 class="icon" :width="16" />
            <strong>Follow&nbsp;</strong>on Bandcamp</a
          >
        </div>
      </header>
      <aside class="aside col-2 flex flex-column">
        <button @click="toggleMenu" class="btn btn--clear btn--clear menu-btn">
          <icon-menu :width="48" />
        </button>
      </aside>
      <main class="main col-10">
        <div
          class="main__content"
          :style="this.menuOpen ? 'opacity:0' : 'opacity:1'"
        >
          <h1 class="main__content-heading">Auratyk</h1>
          <p class="main__content-intro max-width-xxs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eu porta
            elementum consequat sem eu. Eget dui blandit commodo cursus mattis
            aliquam. Leo auctor est ultrices arcu aliquam. Congue et sagittis
            nisl odio duis morbi.
          </p>
        </div>
        <div class="play-button flex justify-end padding-x-xxxl">
          <button
            v-if="this.isPlaying"
            class="btn btn--clear"
            @click="togglePlay"
            :stroke-width="0.5"
          >
            <!-- <icon-pause :width="48" /> -->
            <icon-equalizer class="animation" />
          </button>
          <button v-else class="btn btn--clear" @click="togglePlay">
            <!-- <icon-play :width="48" /> -->
            <icon-equalizer class="animation-none" />
          </button>
        </div>
      </main>
      <footer>
        <button class="btn btn--clear settings-btn">
          <icon-line-button
            class="settings-btn__line"
            :width="48"
            :stroke-width="0.5"
          />
          <icon-settings class="settings-btn__icon" :width="32" />
        </button>
      </footer>
      <div v-if="this.menuOpen" class="menu-overlay grid">
        <div class="col-2"></div>
        <div
          class="menu-overlay__container col-10 flex flex-column justify-between"
        >
          <button
            class="menu-overlay__close btn btn--clear btn--clear"
            @click="toggleMenu('close')"
          >
            <icon-close class="" :width="32" />
          </button>
          <nav class="main-menu">
            <ul class="main-menu__list flex flex-column justify-between">
              <li class="main-menu__list-item text-xxl">
                <nuxt-link to="/">Home</nuxt-link>
              </li>
              <li class="main-menu__list-item text-xxl">
                <nuxt-link to="/about">About</nuxt-link>
              </li>
              <li class="main-menu__list-item text-xxl">
                <nuxt-link to="/contact">Contact</nuxt-link>
              </li>
            </ul>
          </nav>
          <nav class="social-menu">
            <ul class="social-menu__list flex justify-between items-center">
              <li class="social-menu__list-item">
                <a
                  target="_blank"
                  rel="noopener nofollow"
                  href="https://www.instagram.com/auratyk/"
                >
                  Instagram</a
                >
              </li>
              <li class="social-menu__list-item">
                <a
                  target="_blank"
                  rel="noopener nofollow"
                  href="https://soundcloud.com/user-618807717"
                >
                  SoundCloud</a
                >
              </li>
              <li class="social-menu__list-item">
                <a
                  target="_blank"
                  rel="noopener nofollow"
                  href="https://auratyk.bandcamp.com/releases?external_follow=1"
                >
                  Bandcamp</a
                >
              </li>
              <li class="social-menu__list-item">
                <a
                  target="_blank"
                  rel="noopener nofollow"
                  href="https://www.youtube.com/channel/UC3_B4pGVMt_u3SI4mJlLmrQ"
                >
                  Youtube</a
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <AuratykHomeScene :isPlaying="this.isPlaying" />
  </div>
</template>

<script>
import AuratykHomeScene from '@/components/webgl/AuratykHomeScene.vue'
export default {
  components: { AuratykHomeScene },
  data() {
    return { menuOpen: false, isPlaying: false }
  },

  methods: {
    togglePlay() {
      this.isPlaying = !this.isPlaying
    },
    toggleMenu(override) {
      if (override === 'close') {
        this.menuOpen = false
        return
      }
      if (override === 'open') {
        this.menuOpen = true
        return
      }
      this.menuOpen = !this.menuOpen
      console.log('this.menu', this.menu)
    },
  },
  mounted() {},
}
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
}
.home header {
}

.main {
  &__content {
    transition: var(--base-transition);
    padding: var(--space-xxxl) 0 var(--space-lg) 0;

    &-heading {
      font-size: var(--text-xxxxl);
      font-weight: 400;
    }
    &-intro {
      padding: var(--space-md) 0;
    }
  }
}

.aside {
  justify-content: center;
  align-items: flex-start;
}

.btn--clear.menu-btn {
  position: relative;
  margin: calc(-1 * var(--space-xxxl)) 0 0 calc(-1 * var(--space-sm));
}

.bandcamp-follow {
  font-size: var(--text-xs);
  color: var(--color-white);
  border: 0.5px solid #00a1c6;
  border-radius: 4px;
  padding: var(--space-xxxs) var(--space-xs);
  text-decoration: none;
  align-items: center;
  transition: var(--base-transition);
  z-index: var(--z-index-fixed-element);

  & .icon {
    margin-right: var(--space-xxs);
  }

  &:hover {
    text-decoration: underline;
    background: #00a1c6;
    transition: var(--base-transition);
    opacity: 0.7;
  }
}

.settings-btn {
  transition: var(--base-transition);
  margin-left: calc(-1 * var(--space-sm));
  &:hover > &__icon {
    opacity: 1;
  }

  &__icon {
    transition: var(--base-transition);
    opacity: 0;
  }
}

.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0.8;
  background-color: #111;
  backdrop-filter: blur(10px);

  &__container {
    padding: var(--space-xxxl) 0 var(--space-xxl) 0;
    height: 100%;
    position: relative;
  }
  &__close {
    position: absolute;
    top: var(--space-xxl);
    right: var(--space-xxl);
  }
}

.main-menu {
  position: relative;

  &__list {
    &-item {
      padding: var(--space-md) 0;
      & a {
        color: var(--color-accent);
      }
    }
  }
}

.social-menu {
  padding-right: var(--space-xxl);
}
</style>
