<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>An error occurred</h1>
    <NuxtLink to="/">Home page</NuxtLink>
  </div>
</template>

<script>
import { isProd } from '@/assets/js/utils/environment'
export default {
  props: ['error'],
  layout: 'main', // you can set a custom layout for the error page
  mounted() {
    console.error(this.$props.error)
    if (isProd) {
      this.$logsnag.publish({
        project: 'auratyk_website',
        channel: 'errors',
        event: `App Error`,
        icon: '😵',
        notify: true,
      })
    }
  },
}
</script>
