<template>
  <div class="home main__content">
    <h1 class="main__content-heading margin-bottom-md">Shows</h1>
    <div v-if="shows.length" class="shows-container">
      <div v-for="show in shows" :key="show.date" class="show">
        <hr class="hr margin-y-md" />
        <div
          class="show-details flex flex-column flex-row@sm justify-between items-baseline"
        >
          <div
            class="show-details__venue flex flex-column items-start text-component text-left"
          >
            <p class="text-lg">{{ show.venue }}</p>
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
            <p class="show-details__country text-md padding-x-sm@sm">
              {{ show.country }}
            </p>
            <p class="show-details__date text-md padding-x-sm@sm">
              {{ show.date }}
            </p>
            <div class="show-details__tickets padding-x-sm@sm min-width-50%">
              <p class="text-md">
                <a
                  v-if="show.ticketLink"
                  class="link"
                  :href="show.ticketLink"
                  target="_blank"
                  rel="noopener"
                  >Buy Tickets</a
                >
                <a v-else class="link" :href="show.promoterLink" rel="noopener"
                  >Promoter</a
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
  // props: {
  //   shows: {
  //     type: Array,
  //     required: true,
  //   },
  // },

  data() {
    return {
      shows: [
        // {
        //   venue: 'Agatha Hopfen',
        //   venueAddress: 'Revaler Str. 99, 10245 Berlin',
        //   googleMapsLink: 'https://goo.gl/maps/xsRyN7hKp4KP8TPU6',
        //   country: 'Germany',
        //   date: '10/08/23',
        //   // ticketLink: 'https://www.instagram.com/p/CvrU5GLtQuj/',
        //   promoterLink: 'https://www.instagram.com/p/CvrU5GLtQuj/',
        // },
        {
          venue: 'Madame Claude',
          venueAddress: 'Lübbener Str. 19, 10997 Berlin',
          googleMapsLink: 'https://maps.app.goo.gl/HVkSVjB8DSapYDkJ6',
          country: 'Germany',
          date: '06/04/24',
          // ticketLink: 'https://www.instagram.com/p/CvrU5GLtQuj/',
          promoterLink:
            'https://madameclaude.de/event/club-alpino-auratyk-adrian-bang-dj-set/',
        },
      ],
    }
  },
}
</script>
