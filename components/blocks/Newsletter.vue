<template>
  <section class="newsletter text-center">
    <div
      class="max-width-adaptive-sm padding-y-md"
      :class="this.$props.full ? 'container' : ''"
    >
      <div v-if="this.$props['full']" class="text-component margin-bottom-md">
        <h2>Join our Mailing List</h2>
        <p>Stay up to date with shows and releases.</p>
      </div>

      <form @submit.prevent class="grid gap-xxs">
        <div class="col@xs min-width-0">
          <input
            v-model="form.name"
            class="form-control width-100% height-100%"
            aria-label="Name"
            type="text"
            placeholder="Name"
          />
        </div>

        <div class="col@xs min-width-0">
          <input
            v-model="form.email"
            class="form-control width-100% height-100%"
            aria-label="Email"
            type="email"
            placeholder="Email"
          />
        </div>

        <div class="col-content@sm">
          <button
            class="btn btn--primary width-100% height-100%"
            @click="fetchSomething([[form.name, form.email]])"
          >
            Join
          </button>
        </div>
      </form>

      <p
        v-if="this.form.success"
        role="alert"
        class="bg-success bg-opacity-20% text-sm padding-xs radius-md margin-top-xs"
      >
        <strong>Success!</strong> Looking forward to updating you!.
      </p>

      <!-- <div class="margin-top-xs">
        <small class="text-xs color-contrast-medium"
          >By subscribing you agree to our
          <a class="color-contrast-high" href="/privacy-policy"
            >privacy policy</a
          >.</small
        >
      </div> -->
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        success: undefined,
      },
    }
  },
  props: ['full'],
  methods: {
    async fetchSomething(params) {
      const cfgSht = this.$config.sheetsEndpoint
      const cfgTiD = this.$config.sheetsTabId

      const envSht = process.env.sheetsEndpoint
      const envTiD = process.env.sheetsTabId

      console.table({ cfgSht, cfgTiD, envSht, envTiD })

      const ip = await this.$axios.$post(
        `${this.$config.sheetsEndpoint}?tabId=${this.$config.sheetsTabId}`,
        params
      )

      if (ip && ip.message === 'Successfully Inserted') {
        this.form.success = true

        this.$InsightsAnalytics.track({
          id: 'signup-newsletter',
          parameters: {
            // this will track the locale of the user, useful to know if we should translate our posts
            locale: this.$InsightsAnalytics.parameters.locale(),
            // this will track the type of screen on which the user reads the post, useful for useability
            screenSize: this.$InsightsAnalytics.parameters.screenType(),
          },
        })
      }
      this.form.email = ''
      this.form.name = ''
    },
  },
}
</script>

<style></style>
