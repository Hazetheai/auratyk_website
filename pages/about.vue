<template>
  <div class="about main__content margin-bottom-xl">
    <h1 class="main__content-heading">About</h1>
    <div class="main__content-intro">
      <div class="notion-sync-block" v-html="pageContent"></div>
    </div>
  </div>
</template>

<script>
import pages from '@/content/notion/pages.json'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  name: 'AboutPage',
  layout() { return 'main' },
  data() {
    const page = (pages.items || []).find(p => p.slug === 'about') || {}
    return {
      title: 'About',
      pageContent: page.bodyHtml || '',
    }
  },
  head() {
    return {
      title: `Auratyk | ${this.title}`,
      meta: [...this.meta],
      link: [{ hid: 'canonical', rel: 'canonical', href: `${this.$config.baseUrl}${this.$route.path}` }],
    }
  },
  computed: {
    meta() {
      return getSiteMeta({
        type: 'website',
        title: this.title,
        description: 'Electronic musician & Audio-visual artist. Based in Berlin.',
        url: `${this.$config.baseUrl}${this.$route.path}`,
      })
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
          }
        }
      }
    }
  }
}
</style>
