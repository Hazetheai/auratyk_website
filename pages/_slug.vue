<template>
  <div v-if="page" class="page-content">
    <h1 v-if="page.title" class="main__content-heading">{{ page.title }}</h1>
    <div v-html="page.bodyHtml" class="page-content__body notion-sync-block"></div>
  </div>
  <div v-else class="main__content">
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

<style lang="scss">
.page-content__body {
  &.notion-sync-block,
  .notion-sync-block {
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
      }
    }
  }
}
</style>
