<template>
  <footer class="footer-v3 padding-top-xxl padding-bottom-lg">
    <div
      class="container max-width-lg flex flex-column justify-center items-center"
    >
      <div class="footer-v3__logo">
        <NuxtLink to="/">
          <nuxt-img
            sizes="sm:100vw md:50vw lg:400px"
            src="/images/profile-pic.jpg"
            alt="Go to homepage"
          />
        </NuxtLink>
      </div>

      <nav class="footer-v3__nav">
        <ul class="footer-v3__nav-list">
          <li class="footer-v3__nav-item text-xs">
            <nuxt-link :to="'/site-info'">Site Info</nuxt-link>
          </li>
          <li class="footer-v3__nav-item text-xs">
            <nuxt-link :to="'/legal'">Legal Info</nuxt-link>
          </li>
          <li class="footer-v3__nav-item text-xs">
            <nuxt-link :to="'/contact'">Contact</nuxt-link>
          </li>
        </ul>
      </nav>
      <hr class="hr margin-y-sm" />
      <SocialIcons />
      <hr class="hr margin-y-sm" />
      <client-only placeholder="Loading...">
        <div class="footer-v3__newsletter">
          <p class="color-contrast-medium">
            <button class="btn btn--clear text-sm" @click="show()">
              Sign up to the mailing list
            </button>
            <modal
              name="my-first-modal"
              :adaptive="true"
              :classes="'bg-light newsletter-modal'"
            >
              <Newsletter :full="true" />
            </modal>
          </p>
        </div>
      </client-only>

      <hr class="hr margin-y-sm" />

      <div class="footer-v3__copyright margin-top-lg">
        <p class="color-contrast-medium text-xs">
          &copy; {{ new Date().getFullYear() }} Auratyk | All Rights Reserved
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
import Newsletter from '@/components/blocks/Newsletter'
import SocialIcons from '@/components/blocks/SocialIcons'
export default {
  components: { Newsletter, SocialIcons },

  methods: {
    show() {
      this.$modal.show('my-first-modal')
    },
    hide() {
      this.$modal.hide('my-first-modal')
    },
  },
}
</script>

<style>
.vm--modal.newsletter-modal {
  background-color: var(--color-bg-dark);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 15px 7px var(--color-primary);
}
</style>
