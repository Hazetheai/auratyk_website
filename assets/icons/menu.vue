<template>
  <svg
    viewBox="0 0 48 31"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
  >
    <g fill="none">
      <path d="M0 .5h38" :stroke="fill"></path>
      <path d="M10 15.5h38" :stroke="fill"></path>
      <path d="M0 30.5h38" :stroke="fill"></path>
    </g>
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
