<template>
  <div class="about main__content margin-bottom-xl">
    <h1 class="main__content-heading">About</h1>
    <div class="main__content-intro">
      <div class="notion-sync-block">
        <p class="notion-text">
          <span
            ><span
              >I create electronic music and immersive experiences that aim to
              elicit an emotive response charged with nostalgia and melancholy.
              Using a blend of analog synthesisers, field recordings, acoustic
              piano and drum machines, my compositions create evolving
              soundscapes interwoven with jittery, IDM fused beats. Building
              upon this with sliced and warped vocals woven around pulsing
              synthesizer riffs, creating a multi-layered sonic experience. My
              music is further expanded upon with visual elements: 3D scans,
              particle systems, generative liquid-like textures and glitchy
              atmospheres.</span
            ></span
          >
        </p>
        <figure class="notion-asset-wrapper">
          <div style="padding-bottom: 56.25%; position: relative">
            <img
              alt="Notion image"
              src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F9bf4d3ed-6de2-43ec-80bd-67e8d0dd3fc5%2F1a192f98-8210-4d9a-b44e-24c08a9597dc%2Freuterplatz-still-7_Large.png?table=block&amp;id=86bc3c9f-42c5-4181-81b0-40e5aa437ddb&amp;cache=v2"
              class="notion-image-inset"
            />
          </div>
          <!---->
        </figure>
        <p class="notion-text">
          <span
            ><span
              >Through sound and visuals, I construct a realm where listeners
              can delve into their own individual memories, perceiving it as a
              familiar environment — whether vividly or vaguely remembered. I
              try to produce a comfortable space where the listeners are
              immersed in the piece that leaves traces in them, as we leave
              traces in each other, and the spaces we haunt leave traces in
              us.</span
            ></span
          >
        </p>
        <figure class="notion-asset-wrapper">
          <div style="padding-bottom: 56.25%; position: relative">
            <iframe
              src="https://www.youtube.com/embed/VPEfe95NIeA?rel=0"
              allow="fullscreen"
              class="notion-image-inset"
              data-ruffle-polyfilled=""
              name="e2637b27-e765-4255-b323-9410561138a8"
            ></iframe>
          </div>
          <!---->
        </figure>
        <p class="notion-text">
          <span
            ><span
              >In my artistic expression, I seek to convey my queerness,
              encapsulating both its recent discovery and my evolving daily
              experience. My music serves as a reflection of my personal
              journey, a process of challenging and deconstructing my past self
              while exploring how queerness shapes my current worldview. Each
              individual piece contributes to a larger narrative, emphasising
              the interconnectedness of personal journeys, memories,
              introspection and environment.</span
            ></span
          >
        </p>
        <figure class="notion-asset-wrapper">
          <div style="padding-bottom: 56.25%; position: relative">
            <iframe
              src="https://www.youtube.com/embed/hYHxyq_vjqc?rel=0"
              allow="fullscreen"
              class="notion-image-inset"
              data-ruffle-polyfilled=""
              name="f5627433-ea17-42c0-863c-2d15f83d935d"
            ></iframe>
          </div>
          <!---->
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
// import MainHeader1 from '../components/G-MainHeader-1.vue'
// import { NotionRenderer } from 'vue-notion'
import bioContentIds from '@/content/notion/bio'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'

export default {
  name: 'AboutPage',

  // components: { NotionRenderer },

  layout(context) {
    return 'main'
  },
  // async asyncData({ $notion }) {
  //   // use Notion module to get Notion blocks from the API via a Notion pageId
  //   const blockMap = await $notion.getPageBlocks(bioContentIds.pageId)

  //   return { blockMap }
  // },

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
