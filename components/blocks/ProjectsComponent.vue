<template>
  <section class="projects main__content">
    <h1 class="main__content-heading margin-bottom-md">{{ title }}</h1>

    <template v-if="projects.length">
      <!-- Projects with a cover and a written page: cards with image and teaser. -->
      <ul
        v-if="featured.length"
        class="projects__featured"
        :class="{ 'projects__featured--lead': hasSections }"
      >
        <li v-for="project in featured" :key="project.id">
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
        </li>
      </ul>

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
.projects__featured {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
  gap: var(--space-xl) var(--space-lg);
}

.projects__featured--lead > li:first-child {
  grid-column: 1 / -1;
  .project-card__media {
    aspect-ratio: 16 / 9;
  }
}

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
  grid-template-columns: 1fr auto 6rem;
  gap: var(--space-sm);
  align-items: baseline;
  padding: var(--space-xs) 0;
  color: inherit;
  text-decoration: none;
  &:hover .projects__list-title {
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }
}
.projects__list-year {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
@media (max-width: 40rem) {
  .projects__list-link {
    grid-template-columns: 1fr auto;
  }
  .projects__list-tags {
    display: none;
  }
}
</style>
