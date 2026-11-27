<template>
  <section class="projects main__content">
    <h1 class="main__content-heading margin-bottom-md">{{ title }}</h1>

    <template v-if="projects.length">
      <!-- Featured projects: the newest one full width on top, the rest in
           one row underneath that they share equally (1, 2 or 3 cards). -->
      <template v-if="featured.length">
        <div v-if="lead" class="projects__lead">
          <ProjectCard :project="lead" />
        </div>
        <ul v-if="secondary.length" class="projects__featured">
          <li v-for="project in secondary" :key="project.id">
            <ProjectCard :project="project" />
          </li>
        </ul>
      </template>

      <!-- Everything else: compact lists, one per Notion "Section". -->
      <div
        v-for="group in groups"
        :key="group.label"
        class="projects__more margin-top-xl"
      >
        <p v-if="group.label" class="projects__more-label">{{ group.label }}</p>
        <ul class="projects__list">
          <li v-for="project in group.items" :key="project.id">
            <nuxt-link
              :to="`/projects/${project.slug}`"
              class="projects__list-link"
            >
              <span class="projects__list-thumb" aria-hidden="true"
                ><img
                  v-if="project.properties.coverUrl"
                  :src="project.properties.coverUrl"
                  alt=""
                  loading="lazy"
              /></span>
              <span class="projects__list-title">{{ project.title }}</span>
              <span class="projects__list-tags text-sm color-contrast-medium">{{
                (project.properties.tags || []).join(' · ')
              }}</span>
              <span class="projects__list-year text-sm color-contrast-medium">{{
                project.year
              }}</span>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </template>

    <div v-else class="no-projects">
      <p class="text-md color-contrast-medium">No projects yet.</p>
    </div>
  </section>
</template>

<script>
import { isFeatured, yearSpan, byRecency } from '@/libs/project-utils'
import ProjectCard from '@/components/blocks/ProjectCard.vue'

// Order of the list sections under the featured cards. Set per project with
// the "Section" select in the Notion Projects DB. "Featured" projects become
// the big cards at the top, newest first; the first one is shown full width.
// Projects with no Section go in "More projects" at the end. If no project
// has a Section (e.g. Experiments), the old automatic rule is used instead.
const SECTION_ORDER = [
  'Music',
  'Installation',
  'Visuals for other artists',
  'Tools',
]

export default {
  components: { ProjectCard },
  props: {
    projects: { type: Array, required: true },
    title: { type: String, default: 'Projects' },
  },
  computed: {
    sorted() {
      return [...this.projects]
        .sort(byRecency)
        .map((p) => ({ ...p, year: yearSpan(p) }))
    },
    hasSections() {
      return this.sorted.some((p) => p.properties.section)
    },
    featured() {
      return this.hasSections
        ? this.sorted.filter((p) => p.properties.section === 'Featured')
        : this.sorted.filter(isFeatured)
    },
    // With Sections (the main /projects page) the newest Featured project is
    // the lead; without (Experiments) all featured cards share rows.
    lead() {
      return this.hasSections ? this.featured[0] : null
    },
    secondary() {
      return this.hasSections ? this.featured.slice(1) : this.featured
    },
    groups() {
      if (!this.hasSections) {
        const rest = this.sorted.filter((p) => !isFeatured(p))
        return rest.length
          ? [
              {
                label: this.featured.length ? 'More projects' : '',
                items: rest,
              },
            ]
          : []
      }
      const known = ['Featured', ...SECTION_ORDER]
      return [
        ...SECTION_ORDER.map((label) => ({
          label,
          items: this.sorted.filter((p) => p.properties.section === label),
        })),
        {
          label: 'More projects',
          items: this.sorted.filter(
            (p) => !known.includes(p.properties.section)
          ),
        },
      ].filter((g) => g.items.length)
    },
  },
}
</script>

<style lang="scss" scoped>
.projects__lead {
  margin-bottom: var(--space-xl);
  ::v-deep .project-card__media {
    aspect-ratio: 16 / 9;
  }
}
// Cards share the row equally; a lone card is centred, not left in a column
// sized for three.
.projects__featured {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-xl) var(--space-lg);
  > li {
    flex: 1 1 22rem;
    max-width: 100%;
  }
  > li:only-child {
    max-width: 40rem;
  }
}

.projects__more-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-contrast-medium);
  margin-bottom: var(--space-xs);
}
.projects__list {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    border-top: 1px solid var(--color-contrast-lower);
  }
  li:last-child {
    border-bottom: 1px solid var(--color-contrast-lower);
  }
}
.projects__list-link {
  display: grid;
  grid-template-columns: 4.5rem 1fr auto 6rem;
  gap: var(--space-sm);
  align-items: center;
  padding: var(--space-xs) 0;
  color: inherit;
  text-decoration: none;
  &:hover .projects__list-title {
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }
  &:hover .projects__list-thumb img,
  &:focus-visible .projects__list-thumb img {
    opacity: 1;
  }
}
// Small, a little dimmed until hover, so the titles still lead.
.projects__list-thumb {
  display: block;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: var(--color-contrast-lower);
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }
}
.projects__list-year {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
@media (max-width: 40rem) {
  .projects__list-link {
    grid-template-columns: 3.5rem 1fr auto;
  }
  .projects__list-tags {
    display: none;
  }
}
</style>
