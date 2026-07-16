export default {
  mounted() {
    this.__players = [...document.querySelectorAll('[data-video-player]')]
    this.__initPlayers()
  },

  beforeDestroy() {
    this.__players.forEach((p) => {
      const v = p.querySelector('video')
      if (!v) return
      v.pause()
      this.__off(p, v)
    })
  },

  methods: {
    __initPlayers() {
      this.__players.forEach((p) => {
        const v = p.querySelector('video')
        const wrapper = p.querySelector('.video-embed__player-wrapper')
        const overlay = p.querySelector('.video-embed__overlay')
        const playBtn = p.querySelector('.video-embed__play-btn')
        const ctrl = p.querySelector('.video-embed__controls')
        const ctrlPlay = p.querySelector('.video-embed__ctrl-play')
        const ctrlFs = p.querySelector('.video-embed__ctrl-fs')
        const ctrlVol = p.querySelector('.video-embed__ctrl-vol')
        const volSlider = p.querySelector('.video-embed__volume-slider')
        const volTrack = p.querySelector('.video-embed__volume-track')
        const volFill = p.querySelector('.video-embed__volume-fill')
        const progTrack = p.querySelector('.video-embed__controls-track')
        const progFill = p.querySelector('.video-embed__controls-fill')
        const timeEl = p.querySelector('.video-embed__time')

        if (!v || !overlay || !ctrl) return

        let hideTimer = null
        let wasVolume = 1

        // --- helpers ---

        const showPause = () => {
          const plays = ctrl.querySelectorAll('.video-embed__ctrl-icon--play')
          const pauses = ctrl.querySelectorAll('.video-embed__ctrl-icon--pause')
          plays.forEach((el) => { el.style.display = 'none' })
          pauses.forEach((el) => { el.style.display = '' })
          ctrlPlay.setAttribute('aria-label', 'Pause')
        }

        const showPlay = () => {
          const plays = ctrl.querySelectorAll('.video-embed__ctrl-icon--play')
          const pauses = ctrl.querySelectorAll('.video-embed__ctrl-icon--pause')
          plays.forEach((el) => { el.style.display = '' })
          pauses.forEach((el) => { el.style.display = 'none' })
          ctrlPlay.setAttribute('aria-label', 'Play')
        }

        const showVolOn = () => {
          const ons = ctrl.querySelectorAll('.video-embed__ctrl-icon--vol-on')
          const offs = ctrl.querySelectorAll('.video-embed__ctrl-icon--vol-off')
          ons.forEach((el) => { el.style.display = '' })
          offs.forEach((el) => { el.style.display = 'none' })
          ctrlVol.setAttribute('aria-label', 'Mute')
        }

        const showVolOff = () => {
          const ons = ctrl.querySelectorAll('.video-embed__ctrl-icon--vol-on')
          const offs = ctrl.querySelectorAll('.video-embed__ctrl-icon--vol-off')
          ons.forEach((el) => { el.style.display = 'none' })
          offs.forEach((el) => { el.style.display = '' })
          ctrlVol.setAttribute('aria-label', 'Unmute')
        }

        const formatTime = (s) => {
          if (!isFinite(s)) return '0:00'
          const m = Math.floor(s / 60)
          const sec = Math.floor(s % 60)
          return `${m}:${sec.toString().padStart(2, '0')}`
        }

        const updateTime = () => {
          if (timeEl) {
            timeEl.textContent = `${formatTime(v.currentTime)} / ${formatTime(v.duration)}`
          }
        }

        const updateProg = () => {
          if (progFill && v.duration) {
            progFill.style.width = `${(v.currentTime / v.duration) * 100}%`
          }
        }

        const updateVol = () => {
          if (volFill) {
            volFill.style.width = `${v.muted ? 0 : v.volume * 100}%`
          }
        }

        const startHide = (delay = 3000) => {
          if (hideTimer) clearTimeout(hideTimer)
          hideTimer = setTimeout(() => {
            hideTimer = null
            if (!v.paused && !v.ended) {
              ctrl.classList.add('video-embed__controls--hidden')
            }
          }, delay)
        }

        const cancelHide = () => {
          if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
          ctrl.classList.remove('video-embed__controls--hidden')
        }

        // --- video events ---

        v.addEventListener('play', () => {
          overlay.style.display = 'none'
          showPause()
          cancelHide()
          startHide()
        })

        v.addEventListener('pause', () => {
          if (v.ended) return
          overlay.style.display = ''
          showPlay()
          updateTime()
          cancelHide()
        })

        v.addEventListener('ended', () => {
          overlay.style.display = ''
          showPlay()
          updateTime()
          updateProg()
          ctrl.classList.add('video-embed__controls--hidden')
        })

        v.addEventListener('timeupdate', () => {
          updateProg()
          updateTime()
        })

        v.addEventListener('volumechange', updateVol)

        // --- overlay play button ---

        playBtn.addEventListener('click', (e) => { e.stopPropagation(); v.play() })

        // --- click video to toggle ---

        wrapper.addEventListener('click', (e) => {
          if (e.target.closest('.video-embed__overlay')) return
          if (e.target.closest('.video-embed__controls')) return
          if (v.paused) { v.play() } else { v.pause() }
        })

        // --- controls play/pause ---

        ctrlPlay.addEventListener('click', (e) => {
          e.stopPropagation()
          if (v.paused) { v.play() } else { v.pause() }
        })

        // --- progress track ---

        progTrack.addEventListener('click', (e) => {
          if (!v.duration) return
          const rect = progTrack.getBoundingClientRect()
          v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration
        })

        // --- volume ---

        ctrlVol.addEventListener('click', (e) => {
          e.stopPropagation()
          v.muted = !v.muted
          if (v.muted) { showVolOff() } else { showVolOn() }
          updateVol()
        })

        volTrack.addEventListener('click', (e) => {
          const rect = volTrack.getBoundingClientRect()
          const vol = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
          v.muted = false
          v.volume = vol
          showVolOn()
          updateVol()
        })

        // --- fullscreen ---

        ctrlFs.addEventListener('click', (e) => {
          e.stopPropagation()
          if (!document.fullscreenElement) {
            if (p.requestFullscreen) {
              p.requestFullscreen()
            } else if (p.webkitRequestFullscreen) {
              p.webkitRequestFullscreen()
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen()
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen()
            }
          }
        })

        // --- visibility toggling ---

        const onMouseEnter = () => {
          cancelHide()
          if (!v.paused && !v.ended) startHide()
        }
        const onMouseLeave = () => {
          if (!v.paused && !v.ended) startHide(500)
        }
        p.addEventListener('mouseenter', onMouseEnter)
        p.addEventListener('mouseleave', onMouseLeave)

        // store refs for cleanup
        p.__cleanup = () => {
          v.removeEventListener('play', null)
          v.removeEventListener('pause', null)
          v.removeEventListener('ended', null)
          v.removeEventListener('timeupdate', null)
          v.removeEventListener('volumechange', null)
          p.removeEventListener('mouseenter', onMouseEnter)
          p.removeEventListener('mouseleave', onMouseLeave)
          if (hideTimer) clearTimeout(hideTimer)
        }

        // init UI state
        updateTime()
        updateProg()
        updateVol()
      })
    },

    __off(p, v) {
      if (p.__cleanup) p.__cleanup()
    },
  },
}
