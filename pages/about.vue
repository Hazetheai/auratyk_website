<template>
  <div class="about main__content margin-bottom-xl">
    <h1 class="main__content-heading">About</h1>
    <div class="main__content-intro">
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
        description: `Electronic musician & Audio-visual artist. Based in Berlin.`,

        url: `${this.$config.baseUrl}${this.$route.path}`,
        // mainImage: this.article.image,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
<style lang="scss">
.about {
  .main__content {
    &-intro {
      & .notion-sync-block {
        display: flex;
        flex-direction: column;
        & p {
          max-width: var(--max-width-sm);
          padding-top: var(--space-xl);
          padding-bottom: var(--space-xl);
          &:first-child {
            padding-top: 0;
          }
          &:nth-child(2n) {
            align-self: flex-end;
            // text-align: right;
          }
        }
      }
    }
  }
}
</style>
