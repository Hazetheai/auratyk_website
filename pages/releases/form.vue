<template>
  <ReleaseComponent :release="release" />
</template>

<script>
import ReleaseComponent from '@/components/blocks/ReleaseComponent.vue'
import { isOnOrAfterToday } from '@/libs/dateFns'
import { handleStreamLinks } from '@/libs/content-handlers'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import releasesData from '@/content/notion/releases.json'

export default {
  name: 'FormEPPage',
  components: { ReleaseComponent },
  layout(context) {
    return 'main'
  },
  data() {
    const items = releasesData.items || []
    const _releases = items.map((release) => ({
      ...release,
      isReleased: isOnOrAfterToday(release.properties?.date) === 'Released',
    }))

    const release = _releases
      .map(handleStreamLinks)
      .find((release) => release.slug === 'form')
    return {
      release,
      title: 'Form EP',
    }
  },
  head() {
    return {
      title: `Auratyk | ${this.title}`,
      meta: [...this.meta],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.baseUrl}${this.$route.path}`,
        },
      ],
    }
  },

  computed: {
    meta() {
      const metaData = {
        type: 'website',
        title: this.title,
        description: this.description,
        url: `${this.$config.baseUrl}${this.$route.path}`,
        socialImage: `/images/png/ep-cover-art-ep.jpg`,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
