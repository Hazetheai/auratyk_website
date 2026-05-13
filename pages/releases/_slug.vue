<template>
  <ReleaseComponent v-if="release" :release="release" />
  <div v-else class="main__content">
    <p>Release not found.</p>
  </div>
</template>

<script>
import ReleaseComponent from '@/components/blocks/ReleaseComponent.vue'
import { isOnOrAfterToday } from '@/libs/dateFns'
import { handleStreamLinks } from '@/libs/content-handlers'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import releasesData from '@/content/notion/releases.json'

export default {
  components: { ReleaseComponent },
  layout() { return 'main' },
  asyncData({ params }) {
    const items = releasesData.items || []
    const _releases = items.map((release) => ({
      ...release,
      isReleased: isOnOrAfterToday(release.properties?.date) === 'Released',
    }))
    const release = _releases
      .map(handleStreamLinks)
      .find((r) => r.slug === params.slug) || null
    return { release }
  },
  data() {
    return {
      title: this.release?.title || 'Release Not Found',
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
        url: `${this.$config.baseUrl}${this.$route.path}`,
      })
    },
  },
}
</script>
