<template>
  <ToxComponent :release="release" />
</template>

<script>
import ToxComponent from '@/components/blocks/ToxComponent.vue'
import { isOnOrAfterToday } from '@/libs/dateFns'
import { handleStreamLinks } from '@/libs/content-handlers'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
// import bio from '@/content/notion/bio'
// import releases from '@/content/notion/releases'
import toxInfo from '@/content/toxes.json'

export default {
  name: 'FormEPPage',
  components: { ToxComponent },
  layout(context) {
    return 'main'
  },
  // async asyncData({ $notion }) {
  //   // use Notion module to get Notion blocks from the API via a Notion pageId
  //   const bioBlockMap = await $notion.getPageBlocks(bio.pageId)
  //   const releasesBlockMap = await $notion.getPageBlocks(releases.pageId)
  //   return { bioBlockMap, releasesBlockMap }
  // },
  data() {
    const _toxes = toxInfo.map((tox) => ({
      ...tox,
      // date: isOnOrAfterToday(release.date),
      isReleased: isOnOrAfterToday(tox.date) === 'Released',
    }))

    const tox = _toxes
      .map(handleStreamLinks)
      .find((tox) => tox.id === 'cloud_seq-20250310')

    return {
      release: tox,
      title: 'Cloud_Seq: Touchdesigner Component',
    }
  },
  head() {
    return {
      title: `Auratyk | ${this.title}`,
      meta: [
        ...this.meta,
        // { hid: 'robots', name: 'robots', content: 'noindex' },
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
        socialImage: `/images/cloud_seq-network.png`,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
