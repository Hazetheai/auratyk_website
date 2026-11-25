<template>
  <div
    v-if="open"
    class="lightbox"
    role="dialog"
    aria-modal="true"
    aria-label="Image viewer"
    @click.self="close"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <figure class="lightbox__stage" @click.self="close">
      <img
        v-if="current.type === 'image'"
        :key="current.full"
        class="lightbox__media"
        :src="current.full"
        :alt="current.caption"
      />
      <video
        v-else
        :key="current.src"
        ref="video"
        class="lightbox__media"
        :src="current.src"
        :poster="current.poster || null"
        controls
        autoplay
        playsinline
      ></video>
      <figcaption v-if="current.caption" class="lightbox__caption">
        {{ current.caption }}
      </figcaption>
    </figure>

    <p class="lightbox__counter" aria-live="polite">
      {{ index + 1 }} / {{ items.length }}
    </p>

    <button
      ref="closeBtn"
      class="lightbox__btn lightbox__close"
      aria-label="Close"
      @click="close"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2" />
      </svg>
    </button>
    <button
      v-if="items.length > 1"
      class="lightbox__btn lightbox__prev"
      aria-label="Previous"
      @click="go(-1)"
    >
      <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
        <path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
    </button>
    <button
      v-if="items.length > 1"
      class="lightbox__btn lightbox__next"
      aria-label="Next"
      @click="go(1)"
    >
      <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
        <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
    </button>
  </div>
</template>

<script>
// Click any image (or a video's expand button) on a project, show or page to
// view it large. Items are collected in page order: cover, then body media.
// Images use data-full (the full-resolution file) when the page shows a
// lighter copy. Arrow keys / swipe to move, Esc or click outside to close.
const SCOPE = '.main'
const SELECTOR = [
  '.page-cover',
  '.notion-sync-block figure img',
  '.notion-sync-block figure.video-embed--direct video',
].join(', ')

export default {
  name: 'MediaLightbox',
  data() {
    return { open: false, items: [], index: 0, touchX: null, returnFocus: null }
  },
  computed: {
    current() {
      return this.items[this.index] || {}
    },
  },
  watch: {
    $route() {
      this.close()
      this.$nextTick(() => setTimeout(this.decorate, 300))
    },
  },
  mounted() {
    document.addEventListener('click', this.onDocClick)
    document.addEventListener('keydown', this.onKey)
    this.decorate()
    // Page bodies arrive via v-html and page transitions; re-decorate on change.
    this.observer = new MutationObserver(() => {
      clearTimeout(this.decorateTimer)
      this.decorateTimer = setTimeout(this.decorate, 150)
    })
    const scope = document.querySelector(SCOPE)
    if (scope) this.observer.observe(scope, { childList: true, subtree: true })
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onDocClick)
    document.removeEventListener('keydown', this.onKey)
    if (this.observer) this.observer.disconnect()
    this.unlockScroll()
  },
  methods: {
    elements() {
      const scope = document.querySelector(SCOPE)
      return scope ? [...scope.querySelectorAll(SELECTOR)] : []
    },
    toItem(el) {
      if (el.tagName === 'VIDEO') {
        const src = el.currentSrc || el.querySelector('source')?.src || el.src
        return { type: 'video', src, poster: el.getAttribute('poster'), caption: '', el }
      }
      return {
        type: 'image',
        full: el.dataset.full || el.currentSrc || el.src,
        caption: el.alt || '',
        el,
      }
    },
    // Mark clickable images and give each direct video an expand button.
    decorate() {
      if (this.open) return
      for (const el of this.elements()) {
        if (el.tagName === 'IMG') {
          el.classList.add('lightbox-trigger')
          continue
        }
        const fig = el.closest('figure')
        if (fig && !fig.querySelector('.lightbox-expand')) {
          const btn = document.createElement('button')
          btn.type = 'button'
          btn.className = 'lightbox-expand'
          btn.setAttribute('aria-label', 'View larger')
          btn.innerHTML =
            '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
          fig.appendChild(btn)
        }
      }
    },
    onDocClick(e) {
      if (this.open) return
      const expand = e.target.closest('.lightbox-expand')
      const img = !expand && e.target.closest('img.lightbox-trigger')
      if (!expand && !img) return
      const target = expand ? expand.closest('figure').querySelector('video') : img
      const els = this.elements()
      const i = els.indexOf(target)
      if (i === -1) return
      e.preventDefault()
      if (expand) target.pause()
      this.show(els.map(this.toItem), i)
    },
    show(items, i) {
      this.items = items
      this.index = i
      this.open = true
      this.returnFocus = document.activeElement
      this.lockScroll()
      this.$nextTick(() => {
        this.$refs.closeBtn?.focus()
        this.preload()
      })
    },
    close() {
      if (!this.open) return
      this.open = false
      this.unlockScroll()
      if (this.returnFocus?.focus) this.returnFocus.focus({ preventScroll: true })
    },
    go(step) {
      const n = this.items.length
      this.index = (this.index + step + n) % n
      this.$nextTick(this.preload)
    },
    preload() {
      for (const step of [1, -1]) {
        const it = this.items[(this.index + step + this.items.length) % this.items.length]
        if (it?.type === 'image') new Image().src = it.full
      }
    },
    onKey(e) {
      if (!this.open) return
      if (e.key === 'Escape') this.close()
      else if (e.key === 'ArrowRight') this.go(1)
      else if (e.key === 'ArrowLeft') this.go(-1)
      else return
      e.preventDefault()
    },
    onTouchStart(e) {
      this.touchX = e.touches[0].clientX
    },
    onTouchEnd(e) {
      if (this.touchX === null) return
      const dx = e.changedTouches[0].clientX - this.touchX
      this.touchX = null
      if (Math.abs(dx) > 50) this.go(dx < 0 ? 1 : -1)
    },
    lockScroll() {
      document.documentElement.style.overflow = 'hidden'
    },
    unlockScroll() {
      document.documentElement.style.overflow = ''
    },
  },
}
</script>

<style lang="scss">
.lightbox-trigger {
  cursor: zoom-in;
}
figure.video-embed {
  position: relative;
}
.lightbox-expand {
  position: absolute;
  top: var(--space-xs);
  right: var(--space-xs);
  z-index: 3;
  display: flex;
  padding: var(--space-xxs);
  border: 0;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  &:hover,
  &:focus-visible {
    opacity: 1;
  }
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.94);
  color: #fff;
}
.lightbox__stage {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  max-width: calc(100vw - 8rem);
}
.lightbox__media {
  display: block;
  max-width: calc(100vw - 8rem);
  max-height: calc(100vh - 7rem);
  width: auto;
  height: auto;
  object-fit: contain;
}
.lightbox__caption {
  font-size: 0.85rem;
  opacity: 0.75;
  text-align: center;
}
.lightbox__counter {
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.75;
  font-variant-numeric: tabular-nums;
}
.lightbox__btn {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: #fff;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  &:hover,
  &:focus-visible {
    opacity: 1;
  }
}
.lightbox__close {
  top: var(--space-xs);
  right: var(--space-xs);
  width: 3rem;
  height: 3rem;
}
.lightbox__prev,
.lightbox__next {
  top: 50%;
  transform: translateY(-50%);
  width: 4rem;
  height: 6rem;
}
.lightbox__prev {
  left: 0;
}
.lightbox__next {
  right: 0;
}
@media (max-width: 640px) {
  .lightbox__stage,
  .lightbox__media {
    max-width: 100vw;
  }
  .lightbox__prev,
  .lightbox__next {
    top: auto;
    bottom: 0;
    transform: none;
  }
}
</style>
