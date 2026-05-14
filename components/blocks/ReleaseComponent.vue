<template>
  <section
    class="contact main__content contact-v3 position-relative z-index-1 margin-bottom-xl"
  >
    <div class="margin-bottom-lg">
      <div class="text-component text-center">
        <h1 class="main__content-heading">
          {{ release.title }} {{ release.properties.type }}
        </h1>

        <p
          v-if="release.properties.mediums?.length"
          class="text-md margin-top-xs color-contrast-medium"
        >
          On {{ release.properties.mediums.join(' and ') }}
        </p>

        <p class="main__content-intro">Out {{ release.properties.date }}</p>

        <div class="release-cover-wrapper">
          <nuxt-img
            v-if="release.properties.coverUrl"
            class="release-cover"
            sizes="400px"
            :src="release.properties.coverUrl"
            :alt="release.title + ' Cover Art'"
          />
        </div>
      </div>
    </div>

    <div class="text-divider padding-y-lg"></div>

    <div class="margin-bottom-lg flex flex-column items-center justify-center">
      <div
        class="flex flex-column max-width-lg justify-between text-sm padding-right-md"
      >
        <div
          v-if="displayBody"
          class="notion-sync-block max-width-md@md"
          v-html="displayBody"
        ></div>
        <p
          v-else-if="release.description"
          class="text-md color-contrast-medium"
        >
          {{ release.description }}
        </p>
      </div>

      <div
        class="release-details__tickets flex justify-center padding-top-md padding-x-sm@md margin-bottom-sm gap-lg"
      >
        <a
          v-if="release.properties.buyLink"
          class="link"
          :href="release.properties.buyLink"
          rel="noopener"
          target="_blank"
        >
          <icon-bandcamp-circle-0
            width="48"
            height="48"
            title="Listen on Bandcamp"
          />
        </a>
        <a
          v-if="appleLink"
          class="link"
          :href="appleLink"
          rel="noopener"
          target="_blank"
        >
          <icon-apple width="48" height="48" title="Stream on Apple Music" />
        </a>
        <a
          v-if="soundcloudLink"
          class="link"
          :href="soundcloudLink"
          rel="noopener"
          target="_blank"
        >
          <icon-soundcloud-bw
            width="48"
            height="48"
            title="Stream on SoundCloud"
          />
        </a>
      </div>
    </div>

    <div class="text-divider padding-y-lg"></div>
    <Newsletter :full="true" />
  </section>
</template>

<script>
import Newsletter from './Newsletter.vue'
import { dedupDescription } from '@/libs/description-dedup'

export default {
  components: { Newsletter },
  props: {
    release: { type: Object, default: () => ({}) },
  },
  computed: {
    streamLinks() {
      return this.release.streamLinks || []
    },
    appleLink() {
      const link = this.streamLinks.find(
        (l) => l.platform === 'Apple' || l.platform === 'Apple Music'
      )
      return link?.url || null
    },
    soundcloudLink() {
      const link = this.streamLinks.find((l) => l.platform === 'SoundCloud')
      return link?.url || null
    },
    displayBody() {
      const body = this.release.bodyHtml || ''
      const desc = this.release.description || ''
      if (body && desc) {
        return dedupDescription(body, desc)
      }
      return body
    },
  },
}
</script>

<style lang="scss">
.release-cover-wrapper {
  width: 200px;
  height: 200px;
  background: var(--color-contrast-lower);
  margin: var(--space-md) auto 0;
}
.release-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 2px solid var(--color-white);
}

.dark-image {
  border: 2px solid var(--color-white);
}
</style>
