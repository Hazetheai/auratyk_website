import * as THREE from 'three'
import fragment from '@/assets/shaders/last_watch.frag'
import vertex from '@/assets/shaders/last_watch.vert'

function getFrequencies(dataArray, analyser) {
  analyser.getByteFrequencyData(dataArray)

  // Bass = < 500
  // Mids = 501 - 4999
  // Treble = 5001+

  const bass = dataArray.slice(0, dataArray.length / 12)

  const mid = dataArray.slice(
    dataArray.length / 12,
    (dataArray.length / 12) * 4
  )

  const treble = dataArray.slice((dataArray.length / 12) * 4)

  const throttleLog = throttle(() => console.log(`dataArray`, dataArray), 300)

  const bassAvg = avg(bass)
  const bassMax = max(bass)

  const midAvg = avg(mid)
  const midMax = max(mid)

  const trebleAvg = avg(treble)
  const trebleMax = max(treble)

  const lowerHalfArray = dataArray.slice(0, dataArray.length / 2 - 1)
  const upperHalfArray = dataArray.slice(
    dataArray.length / 2 - 1,
    dataArray.length - 1
  )

  const overallAvg = avg(dataArray)

  const lowerMax = max(lowerHalfArray)
  const lowerAvg = avg(lowerHalfArray)
  const upperMax = max(upperHalfArray)
  const upperAvg = avg(upperHalfArray)

  //   const lowerMaxFr = lowerMax / lowerHalfArray.length
  //   const lowerAvgFr = lowerAvg / lowerHalfArray.length
  //   const upperMaxFr = upperMax / upperHalfArray.length
  //   const upperAvgFr = upperAvg / upperHalfArray.length

  return {
    // lowerMaxFr,
    // lowerAvgFr,
    // upperMaxFr,
    // upperAvgFr,
    bassAvg,
    bassMax,
    midAvg,
    midMax,
    trebleAvg,
    trebleMax,
    overallAvg,
    throttleLog,
  }
}

class ScreenShader {
  constructor(url) {
    this.bind()
    this.sceneObjects = []
    this.url = url
    this.spectrumVec = new THREE.Vector3()
  }

  init(scene) {
    this.scene = scene
    this.clock = new THREE.Clock()

    this.uniforms = {
      colorB: { type: 'vec3', value: new THREE.Color(0xacb6e5) },
      colorA: { type: 'vec3', value: new THREE.Color(0x74ebd5) },
      u_resolution: { value: { x: window.innerWidth, y: window.innerHeight } },
      u_mouse: { value: { x: 0, y: 0 } },
      u_time: { type: 'f', value: this.clock.getElapsedTime() },
      u_spectrum: { type: 'vec3', value: new THREE.Vector3(0, 0, 0) },
    }
    let geometry = new THREE.BoxGeometry(5, 5, 5)
    let material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: fragment,
      vertexShader: vertex,
    })

    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = 0
    mesh.position.z = -2
    scene.add(mesh)
    this.sceneObjects.push(mesh)

    if (this.uniforms.u_resolution !== undefined) {
      this.uniforms.u_resolution.value.x = window.innerWidth
      this.uniforms.u_resolution.value.y = window.innerHeight
    }

    document.addEventListener('mousemove', (e) => {
      this.uniforms.u_mouse.value.x = e.clientX
      this.uniforms.u_mouse.value.y = e.clientY
    })

    //////////////////// Audio /////////////////////

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

    // this.audioCtx = new AudioContext()
    this.audio = new Audio(this.url)
    // this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    // this.audioSource = this.audioCtx.createMediaElementSource(this.audio)

    const analyzedAudio = this.audio
    analyzedAudio.volume = this.audio.volume
    const src = this.audioCtx.createMediaElementSource(this.audio)
    this.analyser = this.audioCtx.createAnalyser()
    const gainNode = this.audioCtx.createGain()
    const gainNode2 = this.audioCtx.createGain()

    src.connect(gainNode)
    gainNode.gain.setValueAtTime(0.25, 0)
    gainNode.connect(this.analyser)
    this.analyser.fftSize = 1024
    this.bufferLength = this.analyser.frequencyBinCount
    this.dataArray = new Uint8Array(this.bufferLength)
    this.analyser.connect(gainNode2)
    gainNode2.gain.setValueAtTime(1.0, 0)
    gainNode2.connect(this.audioCtx.destination)

    ////////////////////////////////////////////////

    getFrequencies(this.dataArray, this.analyser)
  }

  async play() {
    await this.audio.play()
  }
  pause() {
    this.audio.pause()
  }
  update() {
    if (this.uniforms.u_resolution !== undefined) {
      this.uniforms.u_resolution.value.x = window.innerWidth
      this.uniforms.u_resolution.value.y = window.innerHeight
    }

    for (let object of this.sceneObjects) {
      //   object.rotation.x += 0.01;
      //   object.rotation.y += 0.03;

      if (object.material && object.material.uniforms) {
        const freqs = getFrequencies(this.dataArray, this.analyser)
        // freqs.throttleLog();
        window.currentFreqs = freqs

        this.spectrumVec.setX(freqs.bassMax)
        this.spectrumVec.setY(freqs.midMax)
        this.spectrumVec.setZ(freqs.trebleMax)
        this.spectrumVec.normalize()
        this.spectrumVec.setX(this.spectrumVec.x / 10)
        this.spectrumVec.setY(this.spectrumVec.y / 10)
        this.spectrumVec.setZ(this.spectrumVec.z)
        window.currentFreqs['spectrumVec'] = this.spectrumVec
        object.material.uniforms.u_time.value = this.clock.getElapsedTime()
        object.material.uniforms.u_spectrum.value = this.spectrumVec
      }
    }
  }

  bind() {}
}

const _instance = new ScreenShader('/audio/video_clip.mp3')
export default _instance

export { ScreenShader }

//some helper functions here
function fractionate(val, minVal, maxVal) {
  return (val - minVal) / (maxVal - minVal)
}

function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal)
  var delta = outMax - outMin
  return outMin + fr * delta
}

function avg(arr) {
  var total = arr.reduce(function (sum, b) {
    return sum + b
  })
  return total / arr.length
}

function max(arr) {
  return arr.reduce(function (a, b) {
    return Math.max(a, b)
  })
}

// throttle
function throttle(callback, limit) {
  var waiting = false // Initially, we're not waiting
  return function () {
    // We return a throttled function
    if (!waiting) {
      // If we're not waiting
      callback.apply(this, arguments) // Execute users function
      waiting = true // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        waiting = false // And allow future invocations
      }, limit)
    }
  }
}
