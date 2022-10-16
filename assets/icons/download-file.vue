<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    height="1.25em"
    width="1.25em"
  >
    <title>{{ title }}</title>
    <g stroke-width="4" fill="var(--color-accent)" stroke="var(--color-accent)">
      <line
        x1="32"
        y1="4"
        x2="32"
        y2="46"
        fill="none"
        stroke-miterlimit="10"
      ></line>
      <polyline
        points="44 34 32 46 20 34"
        fill="none"
        stroke-linecap="square"
        stroke-miterlimit="10"
      ></polyline>
      <polyline
        points="24 27 12 27 4 56 60 56 52 27 40 27"
        fill="none"
        stroke="var(--color-accent)"
        stroke-linecap="square"
        stroke-miterlimit="10"
      ></polyline>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'download file',
    },
  },
}
</script>
