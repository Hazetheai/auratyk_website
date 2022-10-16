import getFrequencies from '../utils/getFrequencies'
import RAF from '../utils/RAF'
// import LoadingController from './LoadingControllerClass'

class SoundReactor {
  constructor(audioUrl) {
    this.audioCtx
    this.audio
    this.audioSource
    this.analyser
    this.fftdata
    this.spectrumVec = new THREE.Vector3(0, 0, 0)
    this.url = audioUrl
    this.playFlag = false
    this.isInit = false
    this.bind()
  }

  init() {
    // this.ctx = new AudioContext()
    // this.audio = new Audio(this.url)
    // this.audioSource = this.ctx.createMediaElementSource(this.audio)
    // this.analyser = this.ctx.createAnalyser()
    // this.analyser.smoothingTimeConstant = 0.8

    // this.audioSource.connect(this.analyser)
    // this.audioSource.connect(this.ctx.destination)
    // this.fftdata = new Uint8Array(this.analyser.frequencyBinCount)

    function isAudioContextSupported() {
      // This feature is still prefixed in Safari
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      if (window.AudioContext) {
        return true
      } else {
        return false
      }
    }

    // this.audioCtx
    if (isAudioContextSupported()) {
      this.audioCtx = new window.AudioContext()
    }
    // console.log('this.url', this.url)
    this.audio = new Audio(this.url)
    // this.audio.loop = true
    const analyzedAudio = this.audio
    analyzedAudio.volume = this.audio.volume

    this.audioSource = this.audioCtx.createMediaElementSource(this.audio)
    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.smoothingTimeConstant = 0.8

    const gainNode = this.audioCtx.createGain()
    // const gainNode2 = this.audioCtx.createGain()

    this.audioSource.connect(gainNode)
    gainNode.gain.setValueAtTime(1, 0)
    gainNode.connect(this.analyser)
    gainNode.connect(this.audioCtx.destination)

    this.analyser.fftSize = 512
    this.bufferLength = this.analyser.frequencyBinCount
    this.fftdata = new Uint8Array(this.bufferLength)

    // this.analyser.connect(gainNode2)

    // gainNode2.gain.setValueAtTime(1.0, 0)
    // gainNode2.connect(this.audioCtx.destination)

    ////////////////////////////////////////////////

    // getFrequencies(this.fftdata, this.analyser)

    this.isInit = true

    this.audio.addEventListener('play', () => {
      // console.log(
      //   `audio listener playing?`,
      //   this.audio.paused ? 'isPaused' : 'isPlaying'
      // )
      navigator.mediaSession.playbackState = 'playing'
    })

    this.audio.addEventListener('pause', () => {
      // console.log(
      //   `audio listener pause?`,
      //   this.audio.paused ? 'isPaused' : 'isPlaying'
      // )
      navigator.mediaSession.playbackState = 'paused'
    })
  }

  play() {
    this.audio.play()
    RAF.subscribe('audioReactorUpdate', this.update)
    this.playFlag = true
  }

  pause() {
    this.audio.pause()
    RAF.unsubscribe('audioReactorUpdate')
    this.playFlag = false
  }

  getProgress() {
    return {
      currentTime: Math.floor(this.audio.currentTime),
      duration: Math.floor(this.audio.duration),
    }
  }

  changeAudioFile(file) {
    if (typeof file !== 'string' || !this.audio) {
      console.log('this.audio', this.audio)
      return
    }
    console.log('file', file)
    console.log('this.audio', this.audio)
    this.url = file
    this.audio.src = file
    this.audio.load()
    // this.audio.play()
  }

  update() {
    // this.analyser.getByteFrequencyData(this.fftdata)
    // console.log(`hey`)

    if (this.audio) {
      const freqs = getFrequencies(this.fftdata, this.analyser)
      // freqs.throttleLog();
      // window.currentFreqs = freqs
      // freqs.throttleLog()
      // console.log('freqs.baseAvg', freqs.bassAvg)
      const newVec3 = new THREE.Vector3(
        freqs.bassMax >= 250 ? freqs.bassMax : 0,
        freqs.midMax,
        freqs.trebleMax
      )

      newVec3.normalize()

      this.spectrumVec.set(newVec3.x, newVec3.y, newVec3.z)
    } else {
      console.error('Error: Audio has not been initialized')
    }

    // console.log('this.spectrumVec', this.spectrumVec)
  }

  bind() {
    this.update = this.update.bind(this)
    this.init = this.init.bind(this)
  }
}
const _instance = new SoundReactor('/audio/video_clip.mp3')
export default _instance
export { SoundReactor }
