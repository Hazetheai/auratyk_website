<template>
  <AboutComponent />
</template>

<script>
// import MainHeader1 from '../components/G-MainHeader-1.vue'
import AboutComponent from '../components/blocks/AboutComponent.vue'
export default {
  layout(context) {
    return 'main'
  },
  name: 'AboutPage',
  components: { AboutComponent },
}
</script>
