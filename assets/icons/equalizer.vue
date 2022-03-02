<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 1.2 3.5 10">
    <title>Asset 3</title>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <rect class="eq" x="1" y="2" width="0.05" height="9.5" />
        <rect class="eq" x="2" y="2" width="0.05" height="11.81" />
        <rect class="eq" x="2.5" y="2" width="0.05" height="7.14" />
        <rect class="eq" x="0.5" y="2" width="0.05" height="5.24" />
        <rect class="eq" x="1.5" y="2" width="0.05" height="14.5" />
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    isPlaying: {
      type: [Boolean],
      default: false,
    },
    cn: {
      type: [String],
      default: '',
    },
  },
  //   computed: {
  //     _secondaryfill: function () {
  //       return this.secondaryfill || this.fill
  //     },
  //   },
}

if (typeof window !== 'undefined') {
  //   const svg = document.querySelectorAll('rect.eq')
  //   svg.forEach((item) => {
  //     if (isPlaying) {
  //       item.classList.add('animation-none')
  //     } else {
  //       item.classList.remove('animation-none')
  //     }
  //   })
}
</script>

<style scoped>
svg {
  width: 15vh;
  height: 15vh;
  transform-origin: center;
  transform: rotate(180deg);
}

rect {
  fill: var(--color-white);
  animation: updown 0.75s infinite linear;
  transform-origin: 0 50%;
  transform: scaleY(0.3);
}

svg.animation-none rect {
  animation: none;
}
rect:nth-child(1) {
  animation-delay: 0.05s;
}
rect:nth-child(2) {
  animation-delay: 0.075s;
  animation-duration: 0.65s;
}
rect:nth-child(3) {
  animation-delay: 0.1s;
  animation-duration: 0.75s;
}
rect:nth-child(4) {
  animation-delay: 0.125s;
  animation-duration: 0.75s;
}
rect:nth-child(5) {
  animation-delay: 0.15s;
  animation-duration: 0.85s;
}

@keyframes updown {
  0% {
    transform: scaleY(0.3);
  }

  50% {
    transform: scaleY(0.4);
  }

  100% {
    transform: scaleY(0.3);
  }
}
</style>
