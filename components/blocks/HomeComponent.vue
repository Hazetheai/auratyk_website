<template>
  <div class="home main__content">
    <h1 class="main__content-heading">Auratyk</h1>
    <p class="main__content-intro max-width-xxs">
      Berlin based Audio/Visual Artist
    </p>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$scrollHandlers.disableScroll()
  },
  beforeDestroy() {
    this.$scrollHandlers.enableScroll()
  },
}
</script>

<style></style>
