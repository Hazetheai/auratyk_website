<template>
  <div v-if="page" class="page-content">
    <div v-html="page.bodyHtml" class="page-content__body"></div>
  </div>
  <div v-else>
    <p>Page not found.</p>
  </div>
</template>

<script>
import pages from '@/content/notion/pages.json'

export default {
  layout() {
    return 'main'
  },
  data() {
    return {
      page: null,
    }
  },
  created() {
    this.page = (pages.items || []).find(
      p => p.slug === this.$route.params.slug
    ) || null
  },
  head() {
    if (!this.page) return {}
    return {
      title: `Auratyk | ${this.page.title}`,
      meta: [
        { hid: 'description', name: 'description', content: this.page.description || '' },
      ],
    }
  },
}
</script>
