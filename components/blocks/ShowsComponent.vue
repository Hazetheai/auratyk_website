<template>
  <div class="home main__content">
    <h1 class="main__content-heading margin-bottom-md">Show Dates</h1>
    <div v-if="this.shows.length" class="shows-container">
      <div class="show" v-for="show in shows" :key="show.date">
        <hr class="margin-y-sm" />
        <div class="show-details flex justify-between">
          <div
            class="show-details__venue flex flex-column items-start text-component text-left"
          >
            <p class="text-lg">{{ show.venue }}</p>
            <p class="show-details__address text-sm color-contrast-medium">
              {{ show.venueAddress }}
            </p>
          </div>

          <div
            class="show-details__main-details flex justify-between text-component"
          >
            <p class="show-details__country text-md padding-x-sm">
              {{ show.country }}
            </p>
            <p class="show-details__date text-md padding-x-sm">
              {{ show.date }}
            </p>
            <div class="show-details__tickets padding-x-sm">
              <p class="text-md">
                <a class="link" :href="show.ticketLink" rel="noopener"
                  >Buy Tickets</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-shows">
      <div
        class="show-details__venue flex flex-column items-start text-component text-left"
      >
        <p class="text-md color-contrast-medium">
          No shows booked at the moment
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
  data() {
    return {
      shows: [
        // {
        //   venue: 'Space Meduza',
        //   venueAddress: 'Skalitzer Straße, 10999 Berlin',
        //   country: 'Germany',
        //   date: '23/03/22',
        //   ticketLink: '#0',
        // },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
hr {
  background: var(--color-contrast-lower);
  width: 100%;
  height: 1px;
}
</style>
