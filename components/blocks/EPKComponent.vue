<template>
  <section
    class="contact main__content contact-v3 position-relative z-index-1 margin-bottom-xl"
  >
    <div class="margin-bottom-lg">
      <div class="text-component">
        <h1 class="main__content-heading text-center">Form EP</h1>
        <p class="main__content-intro text-center">Out 13.11.22</p>
        <nuxt-img
          class="dark-image"
          sizes="sm:100vw md:50vw lg:600px"
          src="/images/ep-cover-art.png"
          alt="'Form' Cover Art"
        />
      </div>
    </div>
    <div class="text-divider padding-y-lg"></div>
    <div class="max-width-adaptive-md margin-bottom-lg">
      <div class="flex@md gap-lg justify-center items-center">
        <div class="text-center padding-right-lg@sm">
          <h4 class="font-bold margin-bottom-xxs">Management/PR</h4>
          <a href="mailto:jake@stefar.io" class="padding-y-md block"
            >jake@stefar.io</a
          >
          <SocialIcons />
        </div>
        <div class="tracks">
          <ul>
            <li
              class="flex items-center margin-y-xs justify-center padding-y-md"
            >
              <a class="" href="/audio/form-demos.zip" @click="logDownload()"
                >Download All Tracks
              </a>
            </li>
            <li
              v-for="track in tracks"
              :key="track"
              class="flex items-center margin-y-xs"
            >
              <button class="btn" @click="changeTrack(track)">
                <icon-pause
                  v-if="
                    $store.state.isPlaying &&
                    $store.state.currentTrack === `/audio/${track}.mp3`
                  "
                />
                <icon-play-arrow v-else />
              </button>
              <div
                class="margin-x-xs text-left audio-download-link text-xs text-md@xs"
              >
                {{ track }}
              </div>

              <a
                :href="`/audio/${track}.mp3`"
                download
                @click="logDownload(track)"
              >
                <icon-download-file
              /></a>
            </li>
          </ul>
        </div>
      </div>
      <div class="margin-top-xxl flex@md justify-center">
        <a
          class="flex items-center btn margin-sm justify-between"
          target="_blank"
          href="https://www.dropbox.com/sh/h3k4c9sd4vhvw7z/AADyW-2kKPMUHtHDkDLZfuwfa?dl=0"
        >
          <span class="padding-right-xs padding-y-sm"> Download Artwork</span>
          <icon-download-file
        /></a>
        <a
          class="flex items-center btn margin-sm justify-between"
          target="_blank"
          href="https://www.dropbox.com/sh/bi0vyfva9lvntrx/AACWy3oCUpQOxHUmk5saSqcca?dl=0"
        >
          <span class="padding-right-xs padding-y-sm"> Press Photos</span>
          <icon-download-file
        /></a>
        <a
          class="flex items-center btn margin-sm justify-between"
          target="_blank"
          href="https://soundcloud.com/auratyk/sets/form-demo"
        >
          <span class="padding-right-xs padding-y-sm"> SoundCloud Link </span>
          <icon-soundcloud-bw :width="48" :fill="'var(--color-accent)'" />
        </a>
      </div>
    </div>
    <div class="text-divider padding-y-lg"></div>
    <div class="margin-bottom-lg flex justify-center">
      <div
        class="flex flex-column max-width-xxxs@md justify-between text-sm padding-right-md"
      >
        <h3 class="">Auratyk shares debut EP ‘Form’</h3>
        <p class="padding-y-sm">
          Electronic Producer Auratyk has released a debut 4 track EP,
          chronicling the formation of their artistic persona. Interlacing two
          pieces produced and recorded during the harsh Montreal winter and two
          pieces created in Berlin the following years, ‘Form’ delivers a
          nuanced seasonal narrative.
        </p>
        <p class="padding-y-sm">
          The all instrumental EP creates an ethereal sonic landscape combining
          feelings of isolation and serenity from the intense Montreal winter
          and the tempestuous growth experienced by the artist since their
          arrival in Berlin. The decision to keep it instrumental was self
          evident to Auratyk who explains:
        </p>
        <p class="padding-y-sm">
          “Lyrics, can be incredible, but the most emotive experiences always
          seems to be without distinct words. This sonic palette allowed me to
          freely express myself, without language and its inherent bias getting
          in the way. There are whispers throughout the tracks, as I believe the
          human voice is one of the most magical instruments there is, but they
          never tell you what to feel, or think.”
        </p>
        <p class="padding-y-sm">
          The finishing touches to the tracks were done in The Famous Gold Watch
          Studios in Berlin.
        </p>
        <h5 class="">Auratyks ‘Form’ is out now.</h5>
      </div>
      <div class="">
        <nuxt-img
          class="display@md dark-image"
          sizes="sm:100vw md:50vw lg:400px"
          src="/images/ep-cover-art.png"
          alt="'Form' Cover Art"
        />
      </div>
    </div>
    <div class="text-divider padding-y-lg"></div>
    <div>
      <div class="flex@md justify-center">
        <div class="padding-bottom-lg">
          <iframe
            width="100%"
            height="300"
            scrolling="no"
            frameborder="no"
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1506035116%3Fsecret_token%3Ds-g9cgrC9Tccm&color=%23b699d6&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframe>
          <div
            style="
              font-size: 10px;
              color: #cccccc;
              line-break: anywhere;
              word-break: normal;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-family: Interstate, Lucida Grande, Lucida Sans Unicode,
                Lucida Sans, Garuda, Verdana, Tahoma, sans-serif;
              font-weight: 100;
            "
          >
            <a
              href="https://soundcloud.com/auratyk"
              title="Auratyk"
              target="_blank"
              style="color: #cccccc; text-decoration: none"
              >Auratyk</a
            >
            ·
            <a
              href="https://soundcloud.com/auratyk/sets/form-demo/s-g9cgrC9Tccm"
              title="Form - Demos"
              target="_blank"
              style="color: #cccccc; text-decoration: none"
              >Form - Demos</a
            >
          </div>
        </div>
        <div
          class="flex flex-column max-width-xxxs@md justify-start text-sm padding-left-md@md"
        >
          <h3 class="">Bio</h3>
          <p class="padding-y-sm">
            Auratyk is an audio visual artist from Ireland, based in Berlin.
          </p>
          <p class="padding-y-sm">
            Using a combination of analog synthesizers, field recordings,
            acoustic piano and drum machines to create evolving soundscapes and
            jittery, IDM fused beats.
          </p>
          <p class="padding-y-sm">
            Further expanded upon with various visual elements such as particle
            systems, generative liquid-like liquid textures and glitchy
            atmospheres. The aim is to create an audio visual experience that
            elicits an emotive response, tells a story and makes a lasting
            impact.
          </p>
        </div>
      </div>
    </div>
    <div class="text-divider padding-y-lg padding-y-lg"></div>
    <Newsletter :full="true" />
  </section>
</template>

<script>
import Newsletter from './Newsletter.vue'
import SocialIcons from './SocialIcons.vue'
import { logger } from '@/assets/js/utils/environment'
export default {
  components: { Newsletter, SocialIcons },
  data() {
    return {
      //   tracks: ['season_ending', 'skitter', 'epiderm', 'remember_linn'],
      tracks: ['Season Ending', 'Skitter', 'Epiderm', 'Remember Linn'],
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
      this.$logsnag.publish({
        project: 'auratyk_website',
        channel: 'main',
        event: `User downloaded ${track || 'tracks'}`,
        icon: '⏬',
        notify: true,
      })
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
