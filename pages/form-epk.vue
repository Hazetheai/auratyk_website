<template>
  <EPKComponent :bioHtml="bioHtml" :pressHtml="pressHtml" />
</template>

<script>
import EPKComponent from '../components/blocks/EPKComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import pages from '@/content/notion/pages.json'
import releases from '@/content/notion/releases.json'

export default {
  name: 'ContactPage',
  components: { EPKComponent },
  layout(context) {
    return 'main'
  },
  data() {
    const bioPage = (pages.items || []).find(p => p.slug === 'bio')
    const pressRelease = (releases.items || []).find(r => r.slug === 'form-press')
    return {
      title: 'Form EPK',
      description: 'Debut release from Auratyk. Available 18.11.22',
      bioHtml: (bioPage && bioPage.bodyHtml) || '',
      pressHtml: (pressRelease && pressRelease.bodyHtml) || '',
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
