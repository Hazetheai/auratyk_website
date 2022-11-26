<template>
  <svg
    viewBox="0 0 250 250"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
  >
    <title>{{ title }}</title>
    <g fill="none">
      <path
        d="M219.541 84.884c-1.447 1.12-26.984 15.488-26.984 47.435 0 36.951 32.495 50.024 33.468 50.347-.15.797-5.162 17.904-17.133 35.334-10.674 15.338-21.821 30.651-38.779 30.651-16.959 0-21.323-9.835-40.9-9.835-19.078 0-25.861 10.159-41.373 10.159-15.511 0-26.335-14.193-38.78-31.623C34.647 196.884 23 165.087 23 134.908c0-48.405 31.522-74.077 62.546-74.077 16.484 0 30.225 10.806 40.575 10.806 9.851 0 25.213-11.454 43.967-11.454 7.107 0 32.644.648 49.453 24.701zm-58.356-45.193c7.756-9.189 13.242-21.937 13.242-34.686 0-1.768-.15-3.56-.474-5.005-12.619.473-27.632 8.391-36.684 18.874-7.108 8.068-13.742 20.817-13.742 33.74 0 1.942.325 3.884.474 4.507.798.149 2.095.323 3.392.323 11.322 0 25.562-7.57 33.792-17.753z"
        :fill="fill"
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
    title: {
      type: String,
      default: 'Apple logo black',
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
