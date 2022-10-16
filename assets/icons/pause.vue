<template>
  <svg
    width="1.25em"
    height="1.25em"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style="min-width: 1.25rem"
  >
    <title>{{ title }}</title>
    <g fill="none">
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" fill="var(--color-accent)"></path>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Pause',
    },
  },
}
</script>
