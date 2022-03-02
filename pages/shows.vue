<template>
  <ShowsComponent />
</template>

<script>
import ShowsComponent from '../components/blocks/ShowsComponent.vue'
export default {
  layout(context) {
    return 'main'
  },

  name: 'ShowsPage',
  components: { ShowsComponent },
}
</script>
