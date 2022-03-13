<template>
  <svg
    viewBox="0 0 11 7"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
  >
    <title>bandcamp</title>
    <g fill="none"><path d="M10.5 0L7 6.4H0L3.5 0h7z" :fill="fill"></path></g>
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: [Number, String],
      default: '100%',
    },
    height: {
      type: [Number, String],
      default: '100%',
    },
    strokewidth: {
      type: [Number, String],
      default: 1,
    },
    fill: {
      type: String,
      default: 'currentColor',
    },
    secondaryfill: {
      type: String,
    },
  },
  computed: {
    _secondaryfill: function () {
      return this.secondaryfill || this.fill
    },
  },
}
</script>
