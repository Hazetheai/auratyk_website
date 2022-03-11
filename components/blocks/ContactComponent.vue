<template>
  <section
    class="contact main__content contact-v3 position-relative z-index-1 margin-bottom-xl"
  >
    <div class="max-width-xs margin-bottom-lg">
      <div class="text-component">
        <h1 class="main__content-heading">Contact</h1>
        <p class="main__content-intro max-width-xxs">
          Please send any and all request for bookings, press info, tour dates
          etc. via the form below, or the email provided
        </p>
      </div>
    </div>

    <div class="max-width-adaptive-md margin-bottom-lg">
      <div class="grid gap-lg">
        <div class="col-6@md">
          <dl class="details-list details-list--rows">
            <div class="details-list__item padding-y-md">
              <dt class="font-bold margin-bottom-xxs">Address</dt>
              <dd class="line-height-md">
                Lichtenberger Str. 41, <br />10243 Berlin <br />Germany
              </dd>
            </div>

            <div class="details-list__item padding-y-md">
              <dt class="font-bold margin-bottom-xxs">Email</dt>
              <dd>
                <a href="mailto:info@auratyk.com">info@auratyk.com</a>
              </dd>
            </div>

            <div class="details-list__item padding-y-md">
              <dt class="font-bold margin-bottom-xxs">Phone</dt>
              <dd class="line-height-md">
                <p><a href="tel:+49 157 36218731">+49 157 36218731</a></p>
              </dd>
            </div>
          </dl>
        </div>

        <div class="col-6@md">
          <form @submit.prevent>
            <div class="margin-bottom-sm">
              <label class="form-label margin-bottom-xxs" for="contactName"
                >Name</label
              >
              <input
                v-model="form.name"
                class="form-control width-100%"
                type="text"
                name="contactName"
                id="contactName"
                required
              />
            </div>

            <div class="margin-bottom-sm">
              <label class="form-label margin-bottom-xxs" for="contactEmail"
                >Email</label
              >
              <input
                v-model="form.email"
                class="form-control width-100%"
                type="email"
                name="contactEmail"
                id="contactEmail"
              />
            </div>

            <div class="margin-bottom-sm">
              <label class="form-label margin-bottom-xxs" for="contactMessage"
                >Message</label
              >
              <textarea
                v-model="form.message"
                class="form-control width-100%"
                rows="5"
                name="contactMessage"
                id="contactMessage"
              ></textarea>
            </div>

            <div class="text-right">
              <div v-if="this.form.success">Success</div>
              <button class="btn btn--primary" @click="fetchSomething()">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- <Newsletter :full="true" /> -->
  </section>
</template>

<script>
import Newsletter from './Newsletter.vue'
export default {
  scrollToTop: true,
  components: { Newsletter },
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: '',
        success: undefined,
      },
    }
  },

  methods: {
    async fetchSomething() {
      const { name, email, message } = this.form

      const res = await this.$axios.$post(
        'https://api.staticforms.xyz/submit',
        {
          name,
          email,
          subject: 'StaticForms - Contact Form',
          honeypot: '', // if any value received in this field, form submission will be ignored.
          message,
          replyTo: '@', // this will set replyTo of email to email address entered in the form
          accessKey: process.env.staticForms, // get your access key from https://www.staticforms.xyz
        }
      )

      if (res && res.message === 'Email Sent' && res.success) {
        this.form.success = true
      }
      this.form.email = ''
      this.form.name = ''
      this.form.message = ''
    },
  },
}
</script>

<style></style>
