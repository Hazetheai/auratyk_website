<template>
  <section
    class="contact main__content contact-v3 position-relative z-index-1 margin-bottom-xl"
  >
    <div class="margin-bottom-lg">
      <div class="text-component">
        <h1 class="main__content-heading text-center">
          {{ release.name }} {{ release.type }}
        </h1>
        <p class="main__content-intro text-center">
          Out {{ release.date }}<br />
          On
          <span v-for="medium in release.mediums" :key="medium">{{
            medium
          }}</span>
        </p>

        <nuxt-img
          class="dark-image"
          sizes="sm:100vw md:50vw lg:600px"
          src="/images/png/ep-cover-art-ep.jpg"
          alt="'Form' Cover Art"
        />
      </div>
    </div>
    <div class="text-divider padding-y-lg"></div>
    <div class="margin-bottom-lg flex flex-column items-center justify-center">
      <div
        class="flex flex-column max-width-lg justify-between text-sm padding-right-md"
      >
        <h3 class="">Auratyk shares debut EP ‘Form’</h3>

        <!-- <NotionRenderer
          v-if="notionContent.releasesBlockMap"
          :blockMap="notionContent.releasesBlockMap"
          :contentId="pressReleaseContentId"
          class="max-width-md@md"
        /> -->
        <div class="notion-sync-block max-width-md@md">
          <p class="notion-text">
            <span
              ><span
                >Electronic Producer Auratyk has released a debut 4 track EP,
                chronicling the formation of their artistic persona. Interlacing
                two pieces produced and recorded during the harsh Montreal
                winter and two pieces created in Berlin the following years,
                ‘Form’ offers a nuanced seasonal narrative.
              </span></span
            >
          </p>
          <p class="notion-text">
            <span
              ><span
                >The all instrumental EP creates an ethereal sonic landscape
                combining feelings of isolation and serenity from the intense
                Montreal winter and the tempestuous growth experienced by the
                artist since their arrival in Berlin. The decision to keep it
                instrumental was self evident to Auratyk who explains:</span
              ></span
            >
          </p>
          <p class="notion-text">
            <span
              ><span
                >“Lyrics, can be incredible, but the most emotive experiences
                always seems to be without distinct words. This sonic palette
                allowed me to freely express myself, without language and its
                inherent bias getting in the way. There are whispers throughout
                the tracks, as I believe the human voice is one of the most
                magical instruments there is, but they never tell you what to
                feel, or think.”</span
              ></span
            >
          </p>
          <p class="notion-text">
            <span
              ><span
                >The finishing touches to the tracks were done in The Famous
                Gold Watch Studios in Berlin.</span
              ></span
            >
          </p>
          <p class="notion-text">
            <span
              ><b><span>Auratyks ‘Form’ is out now.</span></b></span
            >
          </p>
        </div>
      </div>
      <div
        style="min-width: 50%"
        class="release-details__tickets flex justify-between padding-top-md padding-x-sm@md margin-bottom-sm"
      >
        <a class="link" :href="release.buyLink" rel="noopener" target="_blank"
          ><icon-bandcamp-circle-0
            width="48"
            height="48"
            title="Listen on Bandcamp"
        /></a>
        <a
          v-for="streamLink in release.streamLinks"
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
// import { NotionRenderer } from 'vue-notion'
import Newsletter from './Newsletter.vue'
import { logger } from '@/assets/js/utils/environment'
import bioContentIds from '@/content/notion/bio'
import releaseContentIds from '@/content/notion/releases'

export default {
  components: { Newsletter },
  props: {
    // notionContent: { type: Object, default: () => ({}) },
    release: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      //   tracks: ['season_ending', 'skitter', 'epiderm', 'remember_linn'],
      tracks: ['Season Ending', 'Skitter', 'Epiderm', 'Remember Linn'],
      bioContentId: bioContentIds.blocks.short,
      pressReleaseContentId: releaseContentIds.blocks.pressRelease,
    }
  },
  computed: {
    currentTrack() {
      return this.$store.state.currentTrack
    },
  },

  methods: {
    async fetchSomething() {},
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
      //   Initialize the audio
      this.$AuratykHomeSceneInstance.initializeAudio()
      //   Change the audio file
      this.$AuratykHomeSceneInstance.changeTrack(`/audio/${track}.mp3`)
      this.togglePlay()
      //    Register the change in the store
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
