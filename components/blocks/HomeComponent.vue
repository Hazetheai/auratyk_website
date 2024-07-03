<template>
  <div class="home main__content">
    <h1 class="main__content-heading">Auratyk</h1>
    <p class="main__content-intro max-width-xxs">
      Electronic musician &amp; Audio/Visual Artist
    </p>
    <div class="padding-y-sm collab-cta">
      <NuxtLink to="/collab"> Looking to Collaborate?</NuxtLink>
    </div>
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

<style lang="scss">
.collab-cta {
  & a {
    padding: var(--space-xs);
    border: 1px solid var(--color-accent);
  }
}
</style>
