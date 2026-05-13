<template>
  <ToxComponent :release="release" />
</template>

<script>
import ToxComponent from '@/components/blocks/ToxComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  name: 'FormEPPage',
  components: { ToxComponent },
  layout(context) {
    return 'main'
  },
  data() {
    return {
      release: {
        name: 'Cloud_Seq',
        id: 'cloud_seq-20250310',
        type: 'Tox',
        mediums: ['Touchdesigner Component'],
        date: '10.03.2025',
        compLink: 'https://github.com/Hazetheai/touchdesigner-comps/tree/main/Cloud_Seq',
        exampleLink: 'https://www.dropbox.com/scl/fo/71t9bat88lblui3q09hos/AA0w81nwv4s95JIGP1p1zdU?rlkey=5oj5s1zbhxejr1nt936xmbjyk&dl=1',
        socialLinks: [
          { platform: 'Instagram', url: 'https://www.instagram.com/auratyk/' },
          { platform: 'Kofi', url: 'https://ko-fi.com/auratyk' },
        ],
      },
      title: 'Cloud_Seq: Touchdesigner Component',
      description: 'A pointcloud sequencer component for TouchDesigner.',
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
        description: this.description,
        url: `${this.$config.baseUrl}${this.$route.path}`,
        socialImage: `/images/cloud_seq-network.png`,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
