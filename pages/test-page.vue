<template>
  <NotionRenderer :blockMap="blockMap" />
</template>
<script>
import { NotionRenderer } from 'vue-notion'
import bio from '@/content/notion/bio'
export default {
  components: { NotionRenderer },
  layout(context) {
    return 'main'
  },
  async asyncData({ $notion }) {
    // use Notion module to get Notion blocks from the API via a Notion pageId
    const blockMap = await $notion.getPageBlocks(bio.long)

    return { blockMap }
  },
  data: () => ({ blockMap: null }),
}
</script>
