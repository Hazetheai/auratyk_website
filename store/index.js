export const strict = false

export const state = () => ({
  menuOpen: false,
  isPlaying: false,
  isLoaded: false,
})

export const mutations = {
  toggleMenu(state, override) {
    if (override === 'close') {
      state.menuOpen = false
      return
    }
    if (override === 'open') {
      state.menuOpen = true
      return
    }
    state.menuOpen = !state.menuOpen
  },
  togglePlay(state) {
    state.isPlaying = !state.isPlaying
  },
  isLoaded(state) {
    state.isLoaded = true
  },
}

export const getters = {}

export const actions = {}
