<template>
  <div class="home main__content">
    <h1 class="main__content-heading margin-bottom-md">{{ content.title }}</h1>
    <div class="show-type-legend text-sm color-contrast-medium margin-bottom-md">
      <span class="show-type-icon legend-item" title="Live Set">● Live Set</span>
      <span class="show-type-icon legend-item" title="VJ Set">◯ VJ Set</span>
      <span class="show-type-icon legend-item" title="AV Set">◉ AV Set</span>
      <span class="show-type-icon legend-item" title="Installation">◆ Installation</span>
      <span class="show-type-icon legend-item" title="Exhibition">◇ Exhibition</span>
      <span class="show-type-icon legend-item" title="Workshop">◎ Workshop</span>
    </div>
    <div v-if="shows.length" class="shows-container">
      <div v-for="show in shows" :key="show.date" class="show">
        <hr class="hr margin-y-md" />
        <div
          class="show-details flex flex-column flex-row@sm justify-between items-baseline"
        >
          <div
            class="show-details__venue flex flex-column items-start text-component text-left"
          >
            <NuxtLink
              v-if="show.slug && show.hasBody"
              :to="`/shows/${show.slug}`"
              class="text-lg link"
              >{{ show.venue }}</NuxtLink
            >
            <p v-else class="text-lg">{{ show.venue }}</p>
            <p class="show-details__address text-sm color-contrast-medium">
              <span>
                {{ show.venueAddress }}
                <template v-if="show.city && !venueAddressHasCity(show)">, {{ show.city }}</template>
              </span>
            </p>
          </div>

          <div
            class="show-details__main-details show-details__grid text-component"
          >
            <p
              v-if="show.showType"
              class="show-details__type text-md padding-x-sm@sm"
            >
              <span v-if="show.showType === 'Live Set'" class="show-type-icon" :title="show.showType">●</span> Live Set
              <span v-else-if="show.showType === 'VJ Set'" class="show-type-icon" :title="show.showType">◯</span> VJ Set
              <span v-else-if="show.showType === 'AV Set'" class="show-type-icon" :title="show.showType">◉</span> AV Set
              <span v-else-if="show.showType === 'Installation'" class="show-type-icon" :title="show.showType">◆</span> Installation
              <span v-else-if="show.showType === 'Exhibition'" class="show-type-icon" :title="show.showType">◇</span> Exhibition
              <span v-else-if="show.showType === 'Workshop'" class="show-type-icon" :title="show.showType">◎</span> Workshop
            </p>
            <p
              v-if="!allSameCountry"
              class="show-details__country text-md padding-x-sm@sm"
            >
              {{ show.country }}
            </p>
            <p class="show-details__date text-md padding-x-sm@sm">
              {{ show.date }}
            </p>
            <div
              v-if="isPast != true"
              class="show-details__tickets padding-x-sm@sm"
            >
              <p class="text-md">
                <a
                  v-if="show.ticketLink"
                  class="link"
                  :href="show.ticketLink"
                  target="_blank"
                  rel="noopener"
                  >Buy Tickets</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="past-shows-link margin-top-lg text-center">
        <NuxtLink to="/past-shows" class="link text-md">Past Shows →</NuxtLink>
      </div>
    </div>
    <div v-else class="no-shows">
      <div
        class="show-details__venue flex flex-column items-start text-component text-left"
      >
        <p class="text-md color-contrast-medium">
          No shows booked at the moment
        </p>
        <p v-if="isPast != true" class="text-md color-contrast-medium">
          See past shows <a href="/past-shows" class="link">here</a>
        </p>
        <p class="text-md">
          Join our mailing list to be the first to know about new dates!
        </p>
        <Newsletter />
      </div>
    </div>
  </div>
</template>

<script>
import Newsletter from './Newsletter.vue'
export default {
  components: { Newsletter },
  props: {
    shows: {
      type: Array,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
    isPast: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    allSameCountry() {
      if (this.shows.length < 2) return false
      const first = this.shows[0].country
      return first && this.shows.every((s) => s.country === first)
    },
  },
  methods: {
    venueAddressHasCity(show) {
      const addr = (show.venueAddress || '').toLowerCase()
      const city = (show.city || '').toLowerCase()
      return city && addr.includes(city)
    },
  },
}
</script>

<style lang="scss">
.show-type-icon {
  margin-right: var(--space-xxs);
  color: var(--color-accent);
}
.show-type-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs) var(--space-md);
}
.show-details__address {
  max-width: 300px;
}
.show-details__grid {
  display: flex;
  gap: var(--space-md);
  & > p, & > div {
    min-width: 80px;
  }
}
</style>
