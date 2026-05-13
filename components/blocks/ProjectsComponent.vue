<template>
  <section class="projects main__content">
    <h1 class="main__content-heading margin-bottom-md">{{ title }}</h1>
    <div v-if="projects.length" class="projects__grid">
      <div v-for="project in projects" :key="project.id" class="project">
        <hr class="hr margin-y-md" />
        <nuxt-link :to="`/projects/${project.slug}`" class="project__link">
          <h3 class="text-xl">{{ project.title }}</h3>
          <p v-if="project.properties.date" class="text-md">{{ project.properties.date }}</p>
          <div v-if="project.properties.tags?.length" class="project__tags text-sm">
            <span v-for="tag in project.properties.tags" :key="tag" class="project__tag">{{ tag }}</span>
          </div>
        </nuxt-link>
      </div>
    </div>
    <div v-else class="no-projects">
      <p class="text-md color-contrast-medium">No projects yet.</p>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    projects: { type: Array, required: true },
    title: { type: String, default: 'Projects' },
  },
}
</script>
