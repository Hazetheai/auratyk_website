<template>
  <section class="project-detail margin-bottom-xl">
    <div v-if="project.properties.coverUrl" class="project-cover-wrapper">
      <img
        class="project-cover"
        :src="project.properties.coverUrl"
        :alt="project.title"
      />
    </div>

    <div class="main__content">
      <h1 class="main__content-heading">{{ project.title }}</h1>

      <div class="project-detail__meta margin-top-md">
        <p v-if="project.properties.date" class="text-md color-contrast-medium">
          {{ formattedDate }}
        </p>

        <div
          v-if="project.properties.isExperiment"
          class="badge-experiment margin-top-xs"
        >
          Experiment
        </div>

        <div
          v-if="project.properties.tags?.length"
          class="text-sm color-contrast-medium margin-top-xs"
        >
          {{ project.properties.tags.join(' · ') }}
        </div>

        <p
          v-if="project.description"
          class="text-md margin-top-sm color-contrast-medium"
        >
          {{ project.description }}
        </p>

        <div
          v-if="project.properties.links?.length"
          class="project__links margin-top-md"
        >
          <a
            v-for="link in project.properties.links"
            :key="link.platform"
            :href="link.url"
            target="_blank"
            rel="noopener"
            class="project__link link padding-right-sm"
            >{{ link.platform }}</a
          >
        </div>

        <div v-if="upcomingShows.length" class="project__shows margin-top-md">
          <p class="text-md"><strong>Upcoming Shows:</strong></p>
          <NuxtLink
            v-for="show in upcomingShows"
            :key="show.slug"
            :to="`/shows/${show.slug}`"
            class="link padding-right-sm"
          >{{ show.title }} ({{ show.date }})</NuxtLink>
        </div>
      </div>

      <div
        v-if="displayBody"
        class="project__body notion-sync-block margin-top-lg"
        v-html="displayBody"
      ></div>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import showsData from '@/content/notion/shows.json'
import { dedupDescription } from '@/libs/description-dedup'

export default {
  props: {
    project: { type: Object, required: true },
  },
  computed: {
    formattedDate() {
      if (!this.project?.properties?.date) return ''
      return dayjs(this.project.properties.date).format('DD/MM/YY')
    },
    displayBody() {
      const body = this.project.bodyHtml || ''
      const desc = this.project.description
      if (body && desc) {
        return dedupDescription(body, desc)
      }
      return body
    },
    upcomingShows() {
      const items = showsData.items || []
      return items
        .filter(s => {
          const ids = s.properties?.projects || []
          return ids.includes(this.project.id) && dayjs(s.properties.date).isAfter(dayjs().subtract(1, 'day'))
        })
        .sort((a, b) => dayjs(a.properties.date).isBefore(dayjs(b.properties.date)) ? -1 : 1)
        .map(s => ({ slug: s.slug, title: s.title, date: dayjs(s.properties.date).format('DD/MM/YY') }))
    },
  },
}
</script>

<style lang="scss">
.project-cover-wrapper {
  width: 100%;
  height: 400px;
  background: var(--color-contrast-lower);
  overflow: hidden;
}
.project-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
