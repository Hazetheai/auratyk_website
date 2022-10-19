<template>
  <div class="about main__content margin-bottom-xl">
    <h1 class="main__content-heading">About</h1>
    <div class="main__content-intro max-width-xxs">
      <NotionRenderer :blockMap="blockMap" :contentId="bioContentId" />
    </div>
  </div>
</template>

<script>
// import MainHeader1 from '../components/G-MainHeader-1.vue'
import { NotionRenderer } from 'vue-notion'
import bioContentIds from '@/content/notion/bio'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  name: 'AboutPage',

  components: { NotionRenderer },

  layout(context) {
    return 'main'
  },
  async asyncData({ $notion }) {
    // use Notion module to get Notion blocks from the API via a Notion pageId
    const blockMap = await $notion.getPageBlocks(bioContentIds.pageId)

    return { blockMap }
  },

  data() {
    return {
      title: 'About',
      blockMap: null,
      bioContentId: bioContentIds.blocks.long,
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
        // description: this.description,
        url: `${this.$config.baseUrl}${this.$route.path}`,
        // mainImage: this.article.image,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
