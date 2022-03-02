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

    this.audioCtx
    if (isAudioContextSupported()) {
      this.audioCtx = new window.AudioContext()
    }

    this.audio = new Audio(this.url)
    this.audio.loop = true
    const analyzedAudio = this.audio
    analyzedAudio.volume = this.audio.volume

    this.audioSource = this.audioCtx.createMediaElementSource(this.audio)
    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.smoothingTimeConstant = 0.8

    const gainNode = this.audioCtx.createGain()
    const gainNode2 = this.audioCtx.createGain()

    this.audioSource.connect(gainNode)
    gainNode.gain.setValueAtTime(1, 0)
    gainNode.connect(this.analyser)

    this.analyser.fftSize = 1024
    this.bufferLength = this.analyser.frequencyBinCount
    this.fftdata = new Uint8Array(this.bufferLength)
    this.analyser.connect(gainNode2)

    gainNode2.gain.setValueAtTime(1.0, 0)
    gainNode2.connect(this.audioCtx.destination)

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

  update() {
    // this.analyser.getByteFrequencyData(this.fftdata)
    // console.log(`hey`)

    const freqs = getFrequencies(this.fftdata, this.analyser)
    // freqs.throttleLog();
    // window.currentFreqs = freqs

    this.spectrumVec.setX(freqs.bassMax)
    this.spectrumVec.setY(freqs.midMax)
    this.spectrumVec.setZ(freqs.trebleMax)
    this.spectrumVec.normalize()
    // this.spectrumVec.setX(this.spectrumVec.x)
    // this.spectrumVec.setY(this.spectrumVec.y)
    // this.spectrumVec.setZ(this.spectrumVec.z)
    // window.currentFreqs['spectrumVec'] = this.spectrumVec
  }

  bind() {
    this.update = this.update.bind(this)
    this.init = this.init.bind(this)
  }
}
const _instance = new SoundReactor('/audio/video_clip.mp3')
export default _instance
export { SoundReactor }
