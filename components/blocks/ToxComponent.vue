<template>
  <section
    class="contact main__content contact-v3 position-relative z-index-1 margin-bottom-xl"
  >
    <div class="margin-bottom-lg">
      <div class="text-component">
        <h1 class="main__content-heading text-center padding-bottom-lg">
          {{ release.name }} {{ release.type }}
        </h1>
        <video
          class="dark-image"
          sizes="sm:100vw md:50vw lg:600px"
          src="/video/cloud_seq-teaser.mp4"
          alt="Cloud_Seq demo"
          title="Cloud_Seq demo video"
          controls
          loop
          preload="auto"
          style="object-fit: cover; max-height: 550px; width: 100%"
        ></video>
      </div>
    </div>
    <div class="text-divider padding-y-lg"></div>
    <div class="margin-bottom-lg flex flex-column justify-center">
      <div
        class="flex flex-column max-width-lg justify-between text-sm padding-right-md"
      >
        <h2 class="">A Pointcloud sequencer for TouchDesigner</h2>

        <div class="notion-sync-block max-width-md@md">
          <h4 class="margin-top-sm"><strong>What is it?</strong></h4>
          <p class="notion-text max-width-sm">
            <span
              ><span>
                A component for loading, arranging, sequencing and selecting
                pointclouds in TouchDesigner.
              </span>
            </span>
          </p>
          <h4 class="margin-top-sm"><strong>Why did I create it?</strong></h4>
          <p class="notion-text max-width-sm">
            <span
              ><span>
                I love working with pointclouds in TouchDesigner. Both the
                aesthetic & using scans to capture physical spaces. However, if
                you want to move the camera through space, you often need more
                than one cloud to maintain the illusion of scale. Managing all
                of this can be cumbersome. Also, swapping between scans causes a
                very distinct effect which you may not always want.
              </span>
            </span>
          </p>
          <h4 class="margin-top-sm"><strong>What does it do?</strong></h4>
          <div class="notion-text max-width-sm">
            <span
              ><span>
                It allows you to load as many pointclouds as you like (within
                the limits of your computer) and then choose the two which could
                be rendered. It then uses the camera direction to determine
                which points to show. <br />
                It helps to think of the pointclouds as game tiles, and you can
                only see one full tile at a time.

                <ol class="margin-top-sm">
                  <li class="margin-bottom-sm">
                    1. The sequencer lets you choose which tiles are available.
                    (max 4)
                  </li>
                  <li class="margin-bottom-sm">
                    2. The switches on the sequencer let you choose two tiles
                    from the available tiles.
                  </li>
                  <li class="margin-bottom-sm">
                    3. The camera then chooses points from those two based on
                    the camera direction + the points distance from the camera.
                  </li>
                </ol>
              </span>
            </span>
          </div>

          <h4 class="margin-top-sm"><strong>Features</strong></h4>
          <div class="notion-text max-width-sm">
            <ul>
              <li class="margin-bottom-sm">
                <p><strong>Pointcloud Loading &amp; Normalization:</strong></p>
                <p>Imports .ply files and normalizes the data.</p>
              </li>
              <li class="margin-bottom-sm">
                <p><strong>Layout Texture Arrangement:</strong></p>
                <p>
                  Arranges multiple pointclouds into a layout texture for
                  spatial alignment.
                </p>
              </li>
              <li class="margin-bottom-sm">
                <p><strong>LOD-Style Point Selection:</strong></p>
                <p>
                  Uses the camera direction to select and blend points
                  efficiently from two textures.
                </p>
              </li>
              <li class="margin-bottom-sm">
                <p><strong>Dynamic Sequencing Parameters:</strong></p>
                <p>
                  Custom parameters control sequencing, blending thresholds, and
                  source swapping.
                </p>
              </li>
            </ul>
          </div>
          <h4 class="margin-top-sm"><strong>How do I use it?</strong></h4>
          <p class="notion-text max-width-sm">
            <span
              ><span>
                Try the example file first. The network has extra instructions.
                Help text is your friend!
                <br />
                <br /><strong>Note:</strong> Watch how the Cloud_Seq parameters
                change as the camera moves and the clouds appear.
                <br />
                There are more technical details in the Github link below.
              </span>
            </span>
          </p>
        </div>
      </div>
      <div
        style="min-width: 50%"
        class="release-details__tickets flex justify-between padding-top-md margin-bottom-sm gap-x-md"
      >
        <a
          class="link hover-fade"
          style="width: 50%"
          :href="release.compLink"
          rel="noopener"
          target="_blank"
          download
          @click="logDownload('Github link for the Cloud_Seq tox')"
        >
          <nuxt-img
            class="dark-image"
            sizes="sm:100vw md:50vw lg:600px"
            src="/images/cloud_seq-tox.png"
            alt="'Form' Cover Art"
            style="object-fit: cover; max-height: 550px; width: 100%"
          />
          <span class="github-icon-wrapper">
            <span class="github-icon">
              <icon-github-mark title="Component & Documentation" />
            </span>
          </span>
          <span class="display@sm"> Component </span>
        </a>
        <a
          class="link justify-center hover-fade"
          style="width: 54%"
          :href="release.exampleLink"
          rel="noopener"
          target="_blank"
          @click="logDownload('User downloaded the Cloud_Seq tox')"
        >
          <nuxt-img
            class="dark-image"
            sizes="sm:100vw md:50vw lg:600px"
            src="/images/cloud_seq-example.png"
            alt="Touchdesigner Network inside example file"
            style="object-fit: cover; max-height: 550px; width: 100%"
          />
          <span
            class="file-download-link"
            style="padding-top: 0.6rem; display: inline-block"
          >
            <icon-download-file />
            <span class="display@sm"> Example File</span></span
          ></a
        >
      </div>
      <div
        style="min-width: 50%"
        class="release-details__tickets flex justify-center padding-top-xxl padding-x-sm@md margin-bottom-sm"
      >
        <a
          v-for="socialLink in release.socialLinks"
          :key="socialLink.url"
          class="link padding-right-sm inline-block"
          :href="socialLink.url"
          rel="noopener"
          target="_blank"
        >
          <span v-if="socialLink.platform === 'Instagram'"
            ><icon-instagram width="36" height="36" title="Follow on Instagram"
          /></span>
        </a>
        <a href="https://ko-fi.com/Z8Z8169G8L" target="_blank"
          ><img
            height="36"
            style="border: 0px; height: 36px"
            src="https://storage.ko-fi.com/cdn/kofi4.png?v=6"
            border="0"
            alt="Buy Me a Coffee at ko-fi.com"
        /></a>
      </div>
    </div>
    <div class="text-divider padding-y-lg"></div>
  </section>
</template>

<script>
// import { NotionRenderer } from 'vue-notion'
import { logger } from '@/assets/js/utils/environment'
import bioContentIds from '@/content/notion/bio'
import releaseContentIds from '@/content/notion/releases'

export default {
  props: {
    // notionContent: { type: Object, default: () => ({}) },
    release: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      //   tracks: ['season_ending', 'skitter', 'epiderm', 'remember_linn'],
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
    logDownload(event) {
      if (process.env.NODE_ENV === 'production') {
        this.$logsnag.publish({
          project: 'auratyk_website',
          channel: 'main',
          event,
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

.hover-fade {
  transition: all 300ms ease-out;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    transition: all 300ms ease-out;
  }
}

.github-icon-wrapper {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 36px;
}
.github-icon {
  position: absolute;
  top: -20px;
  left: 0px;
  width: 100px;
  height: 100px;
  transform: scale(0.3);
  transform-origin: left center;
}

.dark-image {
  border: 2px solid var(--color-white);
}
</style>
