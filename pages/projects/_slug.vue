<template>
  <ProjectComponent v-if="project" :project="project" />
  <div v-else>Project not found</div>
</template>

<script>
import ProjectComponent from '@/components/blocks/ProjectComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import projectsData from '@/content/notion/projects.json'

export default {
  components: { ProjectComponent },
  layout() { return 'main' },
  asyncData({ params }) {
    const project = (projectsData.items || []).find(p => p.slug === params.slug) || null
    return { project, title: project?.title || 'Project Not Found' }
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
      return getSiteMeta({ type: 'website', title: this.title, url: `${this.$config.baseUrl}${this.$route.path}` })
    },
  },
}
</script>
