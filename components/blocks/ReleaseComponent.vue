<template>
  <section
    class="contact main__content contact-v3 position-relative z-index-1 margin-bottom-xl"
  >
    <div class="margin-bottom-lg">
      <div class="text-component">
        <h1 class="main__content-heading text-center">
          {{ release.title }} {{ release.properties.type }}
        </h1>
        <p class="main__content-intro text-center">
          Out {{ release.properties.date }}
        </p>

        <nuxt-img
          v-if="release.properties.coverUrl"
          class="dark-image"
          sizes="sm:100vw md:50vw lg:600px"
          :src="release.properties.coverUrl"
          :alt="release.title + ' Cover Art'"
        />
      </div>
    </div>
    <div class="text-divider padding-y-lg"></div>
    <div class="margin-bottom-lg flex flex-column items-center justify-center">
      <div
        class="flex flex-column max-width-lg justify-between text-sm padding-right-md"
      >
        <h3 v-if="release.description">{{ release.description }}</h3>

        <div class="notion-sync-block max-width-md@md" v-html="release.bodyHtml"></div>
      </div>
      <div
        style="min-width: 50%"
        class="release-details__tickets flex justify-between padding-top-md padding-x-sm@md margin-bottom-sm"
      >
        <a class="link" :href="release.properties.buyLink" rel="noopener" target="_blank"
          ><icon-bandcamp-circle-0
            width="48"
            height="48"
            title="Listen on Bandcamp"
        /></a>
        <a
          v-for="streamLink in (release.streamLinks || [])"
          :key="streamLink.url"
          class="link padding-right-sm inline-block"
          :href="streamLink.url"
          rel="noopener"
          target="_blank"
        >
          <span v-if="streamLink.platform === 'Apple'"
            ><icon-apple width="48" height="48" title="Stream on Apple Music"
          /></span>
          <span v-else-if="streamLink.platform === 'Spotify'"
            ><icon-spotify width="48" height="48" title="Stream on Spotify"
          /></span>
          <span v-else-if="streamLink.platform === 'SoundCloud'"
            ><icon-soundcloud-bw
              width="48"
              height="48"
              title="Stream on SoundCloud"
          /></span>
          <span v-else>{{ streamLink.platform }}</span>
        </a>
      </div>
    </div>
    <div class="text-divider padding-y-lg"></div>

    <Newsletter :full="true" />
  </section>
</template>

<script>
import Newsletter from './Newsletter.vue'
import { logger } from '@/assets/js/utils/environment'

export default {
  components: { Newsletter },
  props: {
    release: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      tracks: ['Season Ending', 'Skitter', 'Epiderm', 'Remember Linn'],
    }
  },
  computed: {
    currentTrack() {
      return this.$store.state.currentTrack
    },
  },

  methods: {
    logDownload(track) {
      if (process.env.NODE_ENV === 'production') {
        this.$logsnag.publish({
          project: 'auratyk_website',
          channel: 'main',
          event: `User downloaded ${track || 'all tracks'}`,
          icon: '⏬',
          notify: true,
        })
      }
    },
    togglePlay() {
      this.$store.commit('togglePlay')
    },
    changeTrack(track) {
      if (
        this.$store.state.currentTrack === `/audio/${track}.mp3` &&
        this.$store.state.isPlaying
      ) {
        this.togglePlay()
        return
      }
      this.$AuratykHomeSceneInstance.initializeAudio()
      this.$AuratykHomeSceneInstance.changeTrack(`/audio/${track}.mp3`)
      this.togglePlay()
      this.$store.commit('changeTrack', `/audio/${track}.mp3`)
    },
    logScene() {
      logger('this.$AuratykHomeSceneInstance', this.$AuratykHomeSceneInstance)
    },
  },
}
</script>

<style lang="scss">
.form-submit-btn {
  & .loading {
    opacity: 0;
  }
}
.socials a {
  margin: 0 var(--space-xs);
}

.tracks {
  padding: var(--space-xs) var(--space-md);
  border: 1px solid var(--color-accent);
}

.audio-download-link {
  margin: 0 auto 0 var(--space-xs);
  padding: 0 var(--space-xs);
}

.dark-image {
  border: 2px solid var(--color-white);
}
</style>
