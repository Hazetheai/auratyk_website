<template>
  <HomeComponent />
</template>

<script>
import HomeComponent from '@/components/blocks/HomeComponent'
export default {
  layout(context) {
    return 'main'
  },
  components: { HomeComponent },
  name: 'IndexPage',
}
</script>
