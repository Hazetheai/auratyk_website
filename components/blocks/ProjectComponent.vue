<template>
  <section class="project-detail main__content">
    <div class="project-detail__inner">
      <h1 class="main__content-heading">{{ project.title }}</h1>
      <div v-if="project.properties.date" class="project__date text-md margin-top-sm">{{ project.properties.date }}</div>
      <div v-if="project.properties.tags?.length" class="project__tags margin-top-sm">
        <span v-for="tag in project.properties.tags" :key="tag" class="project__tag text-sm">{{ tag }}</span>
      </div>
      <div v-html="project.bodyHtml" class="project__body notion-sync-block margin-top-lg"></div>
      <div v-if="project.properties.links?.length" class="project__links margin-top-lg">
        <a v-for="link in project.properties.links" :key="link.platform"
           :href="link.url" target="_blank" rel="noopener"
           class="project__link link padding-right-sm">{{ link.platform }}</a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    project: { type: Object, required: true },
  },
}
</script>
