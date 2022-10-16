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
      <path
        d="M10 8.64L15.27 12 10 15.36V8.64zM8 5v14l11-7L8 5z"
        fill="var(--color-accent)"
      ></path>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Play',
    },
  },
}
</script>
