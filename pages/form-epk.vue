<template>
  <EPKComponent :notionContent="{ bioBlockMap, releasesBlockMap }" />
</template>

<script>
import EPKComponent from '../components/blocks/EPKComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import bio from '@/content/notion/bio'
import releases from '@/content/notion/releases'

export default {
  name: 'ContactPage',
  components: { EPKComponent },
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
    return {
      title: 'Form EPK',
      description: 'Debut release from Auratyk. Available 18.11.22',
      bioBlockMap: null,
      releasesBlockMap: null,
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
