import RAF from '../utils/RAF'

class SoundReactor {
  constructor(audioUrl) {
    this.ctx
    this.audio
    this.audioSource
    this.analyser
    this.fftdata
    this.url = audioUrl
    this.playFlag = false
    this.bind()
  }

  init() {
    this.ctx = new AudioContext()
    this.audio = new Audio(this.url)
    this.audioSource = this.ctx.createMediaElementSource(this.audio)
    this.analyser = this.ctx.createAnalyser()
    this.analyser.smoothingTimeConstant = 0.8

    this.audioSource.connect(this.analyser)
    this.audioSource.connect(this.ctx.destination)
    this.fftdata = new Uint8Array(this.analyser.frequencyBinCount)
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
    this.analyser.getByteFrequencyData(this.fftdata)
    // console.log(`hey`)
  }

  bind() {
    this.update = this.update.bind(this)
    this.init = this.init.bind(this)
  }
}
const _instance = new SoundReactor('/audio/video_clip.mp3')
export default _instance
