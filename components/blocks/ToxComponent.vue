<template>
  <section
    class="contact main__content contact-v3 position-relative z-index-1 margin-bottom-xl"
  >
    <div class="margin-bottom-lg">
      <div class="text-component">
        <h1 class="main__content-heading text-center padding-bottom-lg">
          {{ release.name }} {{ release.type }}
        </h1>

<!-- <pre>{{ JSON.stringify(release, null, 2) }}</pre> -->
        <nuxt-img
          class="dark-image"
          sizes="sm:100vw md:50vw lg:600px"
          src="/images/cloud_seq-teaser.png"
          alt="'Form' Cover Art"
          style="
    object-fit: cover;
    max-height: 550px;
    width: 100%;
"
        />
      </div>
    </div>
    <div class="text-divider padding-y-lg"></div>
    <div class="margin-bottom-lg flex flex-column items-center justify-center">
      <div
        class="flex flex-column max-width-lg justify-between text-sm padding-right-md"
      >
        <h3 class="">A Pointcloud sequencer for TouchDesigner</h3>

        <!-- <NotionRenderer
          v-if="notionContent.releasesBlockMap"
          :blockMap="notionContent.releasesBlockMap"
          :contentId="pressReleaseContentId"
          class="max-width-md@md"
        /> -->
        <div class="notion-sync-block max-width-md@md">
          <p class="notion-text">
            <span
              ><span>
                This component streamlines loading, arranging, and sequencing
                pointclouds in TouchDesigner. It imports normalized .ply files,
                arranges them in a layout texture, and performs LOD-style
                selection from two textures. It supports dynamic blending
                between pointclouds, enabling continuous pointcloud paths.
              </span>
            </span>
          </p>
          <h4 class="margin-top-sm"><strong>Features</strong></h4>
          <p class="notion-text">
                <ul>
                <li class="margin-bottom-sm"><p><strong>Pointcloud Loading &amp; Normalization:</strong></p>
                <p>  Imports .ply files and normalizes the data.</p>
                </li>
                <li class="margin-bottom-sm"><p><strong>Layout Texture Arrangement:</strong></p>
                <p>  Arranges multiple pointclouds into a layout texture for spatial alignment.</p>
                </li>
                <li class="margin-bottom-sm"><p><strong>LOD-Style Point Selection:</strong></p>
                <p>  Uses the camera direction to select and blend points efficiently from two textures.</p>
                </li>
                <li class="margin-bottom-sm"><p><strong>Dynamic Sequencing Parameters:</strong></p>
                <p>  Custom parameters control sequencing, blending thresholds, and source swapping.</p>
                </li>
                </ul>

          </p>
        </div>
      </div>
      <div
        style="min-width: 50%"
        class="release-details__tickets flex justify-between padding-top-md padding-x-sm@md margin-bottom-sm gap-x-md"
      >
        <a  class="link" style="width:50%" :href="release.compLink" rel="noopener" target="_blank" @click="logDownload('the Cloud_Seq tox')"
          >
          <nuxt-img
          
          class="dark-image"
          sizes="sm:100vw md:50vw lg:600px"
          src="/images/cloud_seq-tox.png"
          alt="'Form' Cover Art"
          style="
    object-fit: cover;
    max-height: 550px;
    width: 100%;
"

        />
          <br>
          <br>
          
          Component</a>
        <a class="link" style="width:54%" :href="release.exampleLink" rel="noopener" target="_blank"  @click="logDownload('the Cloud_Seq example file')"
          >
          
          <nuxt-img
          class="dark-image"
          sizes="sm:100vw md:50vw lg:600px"
          src="/images/cloud_seq-example.png"
          alt="'Form' Cover Art"
          style="object-fit: cover; max-height: 550px; width: 100%;"
          
        />
        
          <br>
          <br>
          Example File</a>

      
      </div>
      <div
        style="min-width: 50%"
        class="release-details__tickets flex justify-center padding-top-md padding-x-sm@md margin-bottom-sm"
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
        <a href='https://ko-fi.com/Z8Z8169G8L' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi4.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

      
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
    logDownload(tox) {
      if (process.env.NODE_ENV === 'production') {
        this.$logsnag.publish({
          project: 'auratyk_website',
          channel: 'main',
          event: `User downloaded ${tox || 'a tox'}`,
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
