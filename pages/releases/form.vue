<template>
  <ReleaseComponent
    :release="release"
    :notionContent="{ bioBlockMap, releasesBlockMap }"
  />
</template>

<script>
import ReleaseComponent from '@/components/blocks/ReleaseComponent.vue'
import { isOnOrAfterToday } from '@/libs/dateFns'
import { handleStreamLinks } from '@/libs/content-handlers'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import bio from '@/content/notion/bio'
import releases from '@/content/notion/releases'
import releaseInfo from '@/content/releases.json'

export default {
  name: 'FormEPPage',
  components: { ReleaseComponent },
  layout(context) {
    return 'main'
  },
  async asyncData({ $notion }) {
    // use Notion module to get Notion blocks from the API via a Notion pageId
    const bioBlockMap = await $notion.getPageBlocks(bio.pageId)
    const releasesBlockMap = await $notion.getPageBlocks(releases.pageId)
    return { bioBlockMap, releasesBlockMap }
  },
  data() {
    const _releases = releaseInfo.map((release) => ({
      ...release,
      // date: isOnOrAfterToday(release.date),
      isReleased: isOnOrAfterToday(release.date) === 'Released',
    }))

    const release = _releases
      .map(handleStreamLinks)
      .find((release) => release.id === 'form-ep-2022')
    return {
      release,
      title: 'Form EP',
    }
  },
  head() {
    return {
      title: `Auratyk | ${this.title}`,
      meta: [
        ...this.meta,
        { hid: 'robots', name: 'robots', content: 'noindex' },
      ],
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
