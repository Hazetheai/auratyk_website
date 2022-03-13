<template>
  <svg
    viewBox="0 0 20 22"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
  >
    <g fill="none">
      <path
        d="M1 .608v20.784h4.5V.608H1z"
        stroke-miterlimit="10"
        stroke-linecap="round"
        :stroke="fill"
      ></path>
      <path
        d="M19 21.392V.608h-4.5v20.784H19z"
        stroke-miterlimit="10"
        stroke-linecap="round"
        :stroke="fill"
      ></path>
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
