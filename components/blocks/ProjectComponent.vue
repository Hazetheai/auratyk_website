<template>
  <section class="project-detail main__content margin-bottom-xl">
    <h1 class="main__content-heading">{{ project.title }}</h1>

    <div class="project-detail__meta margin-top-md">
      <p v-if="project.properties.date" class="text-md color-contrast-medium">
        {{ formattedDate }}
      </p>

      <div v-if="project.properties.isExperiment" class="badge-experiment margin-top-xs">
        Experiment
      </div>

      <div v-if="project.properties.tags?.length" class="text-sm color-contrast-medium margin-top-xs">
        {{ project.properties.tags.join(' · ') }}
      </div>

      <p v-if="project.description" class="text-md margin-top-sm color-contrast-medium">
        {{ project.description }}
      </p>

      <div v-if="project.properties.links?.length" class="project__links margin-top-md">
        <a
          v-for="link in project.properties.links"
          :key="link.platform"
          :href="link.url"
          target="_blank"
          rel="noopener"
          class="project__link link padding-right-sm"
        >{{ link.platform }}</a>
      </div>
    </div>

    <div
      v-if="project.bodyHtml"
      class="project__body notion-sync-block margin-top-lg"
      v-html="project.bodyHtml"
    ></div>
  </section>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    project: { type: Object, required: true },
  },
  computed: {
    formattedDate() {
      if (!this.project?.properties?.date) return ''
      return dayjs(this.project.properties.date).format('DD/MM/YY')
    },
  },
}
</script>
