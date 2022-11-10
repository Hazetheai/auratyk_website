<template>
  <div class="home main__content">
    <h1 class="main__content-heading margin-bottom-md">Releases</h1>
    <div v-if="releases.length" class="releases-container">
      <div v-for="release in releases" :key="release.date" class="release">
        <hr class="hr margin-y-md" />
        <div
          class="release-details flex flex-column flex-row@sm justify-between items-start items-end@md"
        >
          <div
            class="release-details__venue flex flex-column items-start text-component text-left margin-bottom-sm"
          >
            <h3 class="text-xl">{{ release.name }} {{ release.type }}</h3>
          </div>

          <div
            class="release-details__main-details flex flex-col flex-row@sm justify-between text-component margin-bottom-sm"
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
            class="release-details__date text-md padding-x-sm@sm margin-bottom-sm"
          >
            {{ release.date }}
          </p>
          <div
            class="release-details__tickets padding-x-sm@sm margin-bottom-sm"
          >
            <p class="text-md">
              <a class="link" :href="release.buyLink" rel="noopener"
                >Pre-order</a
              >
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
import Newsletter from './Newsletter.vue'
export default {
  components: { Newsletter },

  data() {
    return {
      releases: [
        {
          name: 'Form',
          type: 'EP',
          mediums: ['Digital & Cassette'],
          date: '25/11/22',
          buyLink: 'https://auratyk.bandcamp.com/album/form?external_follow=1',
        },
      ],
    }
  },
}
</script>
