<template>
  <ContactComponent />
</template>

<script>
import ContactComponent from '../components/blocks/ContactComponent.vue'
export default {
  layout(context) {
    return 'main'
  },

  name: 'ContactPage',
  components: { ContactComponent },
}
</script>
