<template>
  <!-- A featured project on /projects: cover, year and tags, title, teaser. -->
  <nuxt-link :to="`/projects/${project.slug}`" class="project-card">
    <div class="project-card__media">
      <img
        :src="project.properties.coverUrl"
        :alt="project.title"
        loading="lazy"
      />
    </div>
    <div class="project-card__text">
      <p class="project-card__meta text-sm color-contrast-medium">
        <span v-if="project.year">{{ project.year }}</span>
        <span v-if="project.properties.tags?.length">{{
          project.properties.tags.join(' · ')
        }}</span>
      </p>
      <h2 class="project-card__title text-xl">{{ project.title }}</h2>
      <p
        v-if="project.description"
        class="project-card__teaser color-contrast-high"
      >
        {{ project.description }}
      </p>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  name: 'ProjectCard',
  props: {
    project: { type: Object, required: true },
  },
}
</script>

<style lang="scss" scoped>
.project-card {
  display: block;
  color: inherit;
  text-decoration: none;
}
.project-card__media {
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: var(--color-contrast-lower);
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
}
.project-card:hover .project-card__media img,
.project-card:focus-visible .project-card__media img {
  transform: scale(1.03);
}
.project-card__text {
  padding-top: var(--space-sm);
}
.project-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0 var(--space-sm);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.75rem;
}
.project-card__title {
  margin: var(--space-xxs) 0 var(--space-xs);
}
.project-card:hover .project-card__title {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.project-card__teaser {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
