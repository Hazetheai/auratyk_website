<template>
  <div>
    <MainHeader1 />
    <Hero />
  </div>
</template>

<script>
import MainHeader1 from '../components/G-MainHeader-1.vue'
import Hero from '../components/blocks/hero.vue'
export default {
  layout(context) {
    return 'default'
  },
  name: 'IndexPage',
  components: { MainHeader1, Hero },
}
</script>
