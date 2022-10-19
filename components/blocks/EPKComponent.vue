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
          src="/images/png/ep-cover-art-ep.png"
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
              <a class="" href="/audio/form.zip" @click="logDownload()"
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

        <NotionRenderer
          class="max-width-xxxs@md"
          v-if="notionContent.releasesBlockMap"
          :blockMap="notionContent.releasesBlockMap"
          :contentId="pressReleaseContentId"
        />
      </div>
      <div class="">
        <nuxt-img
          class="display@md dark-image"
          sizes="sm:100vw md:50vw lg:400px"
          src="/images/png/ep-cover-art-ep.png"
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
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1513232659%3Fsecret_token%3Ds-KH8LkUIZHTN&color=%23b699d6&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true"
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
              href="https://soundcloud.com/auratyk/sets/form/s-KH8LkUIZHTN"
              title="Form"
              target="_blank"
              style="color: #cccccc; text-decoration: none"
              >Form</a
            >
          </div>
        </div>
        <div
          class="flex flex-column max-width-xxxs@md justify-start text-sm padding-left-md@md"
        >
          <h3 class="">Bio</h3>
          <NotionRenderer
            v-if="notionContent.bioBlockMap"
            :blockMap="notionContent.bioBlockMap"
            :contentId="bioContentId"
          />
        </div>
      </div>
    </div>
    <div class="text-divider padding-y-lg padding-y-lg"></div>
    <Newsletter :full="true" />
  </section>
</template>

<script>
import { NotionRenderer } from 'vue-notion'
import Newsletter from './Newsletter.vue'
import SocialIcons from './SocialIcons.vue'
import { logger } from '@/assets/js/utils/environment'
import bioContentIds from '@/content/notion/bio'
import releaseContentIds from '@/content/notion/releases'

export default {
  components: { Newsletter, SocialIcons, NotionRenderer },
  props: {
    notionContent: { type: Object, default: () => ({}) },
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
          event: `User downloaded ${track || 'tracks'}`,
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
