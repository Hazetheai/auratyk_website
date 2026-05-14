<template>
  <div v-if="page" class="page-content">
    <h1 v-if="page.title" class="main__content-heading">{{ page.title }}</h1>

    <nuxt-img
      v-if="page.properties.coverUrl"
      class="page-cover"
      sizes="100vw"
      :src="page.properties.coverUrl"
      :alt="page.title"
    />

    <div v-if="displayBody" v-html="displayBody" class="page-content__body notion-sync-block"></div>
    <p v-else-if="page.description" class="text-md color-contrast-medium">{{ page.description }}</p>
  </div>
  <div v-else class="main__content">
    <p>Page not found.</p>
  </div>
</template>

<script>
import pages from '@/content/notion/pages.json'
import { dedupDescription } from '@/libs/description-dedup'

export default {
  layout() {
    return 'main'
  },
  data() {
    return {
      page: null,
    }
  },
  computed: {
    displayBody() {
      const body = this.page?.bodyHtml || ''
      const desc = this.page?.description || ''
      if (body && desc) {
        return dedupDescription(body, desc)
      }
      return body
    },
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
.page-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: var(--space-md);
}

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

  h1, h2, h3, h4 { margin-top: var(--space-lg); margin-bottom: var(--space-md); }
  p { margin-top: var(--space-md); }
  figure, .video-embed { margin-top: var(--space-lg); margin-bottom: var(--space-lg); }
  iframe { width: 100%; max-width: 560px; height: 315px; }
  img { max-width: 100%; }
}
</style>
