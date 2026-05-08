<template>
  <ProjectsComponent :projects="projects" />
</template>

<script>
import ProjectsComponent from '@/components/blocks/ProjectsComponent.vue'
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import projectsData from '@/content/notion/projects.json'

export default {
  components: { ProjectsComponent },
  layout() { return 'main' },
  data() {
    return {
      title: 'Projects',
      projects: projectsData.items || [],
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
      return getSiteMeta({ type: 'website', title: this.title, url: `${this.$config.baseUrl}${this.$route.path}` })
    },
  },
}
</script>
