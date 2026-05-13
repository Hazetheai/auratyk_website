<template>
  <div class="home main__content">
    <h1 class="main__content-heading margin-bottom-md">{{ content.title }}</h1>
    <div v-if="shows.length" class="shows-container">
      <div v-for="show in shows" :key="show.date" class="show">
        <hr class="hr margin-y-md" />
        <div
          class="show-details flex flex-column flex-row@sm justify-between items-baseline"
        >
          <div
            class="show-details__venue flex flex-column items-start text-component text-left"
          >
            <NuxtLink v-if="show.slug && show.hasBody" :to="`/shows/${show.slug}`" class="text-lg link">{{ show.venue }}</NuxtLink>
            <p v-else class="text-lg">{{ show.venue }}</p>
            <p class="show-details__address text-sm color-contrast-medium">
              <a
                v-if="show.googleMapsLink"
                target="_blank"
                :href="show.googleMapsLink"
              >
                {{ show.venueAddress }}</a
              >
              <span v-else>{{ show.venueAddress }}</span>
            </p>
          </div>

          <div
            class="show-details__main-details flex flex-column flex-row@sm justify-between text-component"
          >
            <p v-if="show.showType" class="show-details__type text-md padding-x-sm@sm">
              <span v-if="show.showType === 'Club Night'" class="show-type-icon">●</span>
              <span v-else-if="show.showType === 'AV Jam'" class="show-type-icon">◉</span>
              <span v-else-if="show.showType === 'Exhibition'" class="show-type-icon">◯</span>
              <span v-else-if="show.showType === 'Festival'" class="show-type-icon">◆</span>
              <span v-else-if="show.showType === 'Performance'" class="show-type-icon">◇</span>
              <span v-else-if="show.showType === 'Workshop'" class="show-type-icon">◎</span>
              <span v-else class="show-type-icon">○</span>
              {{ show.showType }}
            </p>
            <p v-if="!allSameCountry" class="show-details__country text-md padding-x-sm@sm">
              {{ show.country }}
            </p>
            <p class="show-details__date text-md padding-x-sm@sm">
              {{ show.date }}
            </p>
            <div
              v-if="isPast != true"
              class="show-details__tickets padding-x-sm@sm min-width-50%"
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
                <a v-else-if="show.promoterLink" class="link" :href="show.promoterLink" rel="noopener"
                  >Promoter</a
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
      return first && this.shows.every(s => s.country === first)
    },
  },
}
</script>

<style lang="scss">
.show-type-icon {
  margin-right: var(--space-xxs);
  color: var(--color-accent);
}
</style>
