<template>
  <div class="home main__content">
    <h1 class="main__content-heading margin-bottom-md">Releases</h1>
    <div v-if="releases.length" class="releases-container">
      <div v-for="release in releases" :key="release.name" class="release">
        <hr class="hr margin-y-md" />
        <div
          class="release-details flex flex-column flex-row@md justify-between items-start items-end@md"
        >
          <div
            class="release-details__venue link flex flex-column items-start text-component text-left margin-bottom-sm"
          >
            <h3 class="text-xl">
              <NuxtLink :to="release.pageLink"
                >{{ release.name }} {{ release.type }}</NuxtLink
              >
            </h3>
          </div>

          <div
            class="hide@md release-details__main-details flex flex-col flex-row@md justify-between text-component margin-bottom-sm"
          >
            <p class="release-details__medium text-md">
              <span
                v-for="medium in release.mediums"
                :key="medium"
                class="flex"
                >{{ medium }}</span
              >
            </p>
          </div>
          <p
            class="release-details__date text-md padding-x-sm@md margin-bottom-sm"
          >
            {{ release.date }}
          </p>
          <div
            class="release-details__tickets padding-x-sm@md margin-bottom-sm"
          >
            <p class="text-md">
              <a
                class="link"
                :href="release.buyLink"
                rel="noopener"
                target="_blank"
                ><span v-if="release.isReleased">Buy</span
                ><span v-else>Pre-order</span></a
              >
            </p>
          </div>
          <div
            class="release-details__tickets padding-x-sm@md margin-bottom-sm"
          >
            <p class="text-md">
              <a
                v-for="streamLink in release.streamLinks"
                :key="streamLink.url"
                class="link padding-right-sm inline-block"
                :href="streamLink.url"
                rel="noopener"
                target="_blank"
              >
                <span v-if="streamLink.platform === 'Apple'"
                  ><icon-apple
                    width="32"
                    height="32"
                    title="Stream on Apple Music"
                /></span>
                <span v-else-if="streamLink.platform === 'Spotify'"
                  ><icon-spotify
                    width="32"
                    height="32"
                    title="Stream on Spotify"
                /></span>
                <span v-else-if="streamLink.platform === 'SoundCloud'"
                  ><icon-soundcloud-bw
                    width="32"
                    height="32"
                    title="Stream on SoundCloud"
                /></span>
                <span v-else>{{ streamLink.platform }}</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-releases">
      <div
        class="release-details__venue flex flex-column items-start text-component text-left"
      >
        <p class="text-md color-contrast-medium">
          No releases scheduled at the moment
        </p>
        <p class="text-md">
          Join our mailing list to be the first to know about new releases!
        </p>
        <Newsletter />
      </div>
    </div>
  </div>
</template>

<script>
import { isOnOrAfterToday } from '../../libs/dateFns'
import { handleStreamLinks } from '../../libs/content-handlers'
import Newsletter from './Newsletter.vue'
import releaseInfo from '@/content/releases.json'

export default {
  components: { Newsletter },

  data() {
    const _releases = releaseInfo.map((release) => ({
      ...release,
      date: isOnOrAfterToday(release.date),
      isReleased: isOnOrAfterToday(release.date) === 'Released',
    }))

    const releases = _releases.map(handleStreamLinks)
    return {
      releases,
    }
  },
  mounted() {},
}
</script>
