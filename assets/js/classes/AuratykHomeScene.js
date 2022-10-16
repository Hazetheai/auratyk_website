import * as THREE from 'three'

import { OrbitControls } from 'three-stdlib'

import RAF from '../utils/RAF'
// import config from '../utils/config'
// import MyGUI from '../utils/MyGUI'
import { ParticleSystem as PS } from './ParticleClass'

import CamParralax from './CamParallaxClass'
import { Color, Fog, TextureLoader } from 'three'
import { SoundReactor } from './SoundReactor'
// import testFrag from '@/assets/shaders/test.frag'
// import waterFrag from '@/assets/shaders/water_refraction.frag'
import homeFrag from '@/assets/shaders/home.frag'
// import kodelifeFrag from '@/assets/shaders/kodelife.frag'
import testVert from '@/assets/shaders/test.vert'

import LoadingController from './LoadingControllerClass'
import iOS from '@/assets/js/utils/iOS'
import { getFileName, logger } from '../utils/environment'
const texLoader = new TextureLoader(LoadingController)
function debounce(func, wait, immediate) {
  var timeout
  return function () {
    var context = this,
      args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }, wait)
    if (immediate && !timeout) func.apply(context, args)
  }
}

// FIXME
const _height = iOS() ? window.innerHeight + 80 : window.innerHeight

class AuratykScene {
  constructor() {
    const tex = texLoader.load('/images/cool-bg.png')
    this.width = window.innerWidth
    this.height = _height
    this.bind()
    this.camera
    this.scene
    this.renderer
    this.controls
    this.particleSystem = new PS(500, 25)
    this.track
    this.clock
    this.time = 0
    // TODO
    // this.audioProgress = {duration: 0, }
    this.uniforms = {
      uTime: {
        value: this.time,
      },
      uResolution: {
        type: 'vec2',
        value: { x: window.innerWidth, y: _height },
      },
      uSpectrum: { type: 'vec3', value: new THREE.Vector3(0, 0, 0) },
      uSpectrumDamping: { value: 1, type: 'f' },
      uWaveIntensity: { value: 10, type: 'f' },
      texture0: { type: 'sampler2D', value: tex },
    }
  }

  init(container, track) {
    //RENDERER SETUP
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, _height)
    this.renderer.debug.checkShaderErrors = true
    container.appendChild(this.renderer.domElement)

    // AUDIO SETUP

    this.track = track
    this.SoundReactorInstance = new SoundReactor(track)
    // if (!this.SoundReactorInstance.isInit) {
    //   this.SoundReactorInstance.init()
    // }

    //MAIN SCENE INSTANCE
    // TODO Why is the color var not being read?
    // var style = getComputedStyle(document.body)
    // const colorPrimary = style.getPropertyValue('--color-primary')
    // const colorAccent = style.getPropertyValue('--color-accent')
    // console.log('colorPrimary', colorPrimary)
    // console.log('colorAccent', colorAccent)

    const bgColor = new Color('hsl(0, 0%, 13%)')
    const fogColor = new Color('hsl(268, 43%, 72%)')

    const fog = new Fog(fogColor, 10, 40)
    // const texture = texLoader.load('/images/cool-bg.png')
    this.clock = new THREE.Clock()
    this.clock.start()

    // Why Does Shader not appear?
    const testShader = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: homeFrag,
      vertexShader: testVert,
    })

    document.addEventListener(
      'mousemove',
      debounce(
        (e) =>
          (this.uniforms.uWaveIntensity.value =
            ((e.clientY / window.innerHeight + e.clientX / window.innerWidth) /
              2) *
            20),
        10
      )
    )

    const shaderTex = new THREE.Texture(testShader)

    const boxGeo = new THREE.BoxGeometry(5, 5, 5)
    const box = new THREE.Mesh(boxGeo, testShader)
    const planeGeo = new THREE.PlaneGeometry(this.width, this.height)
    const plane = new THREE.Mesh(planeGeo, testShader)

    this.scene = new THREE.Scene()
    this.scene.add(plane)
    this.scene.background = shaderTex
    this.scene.fog = fog

    //CAMERA AND ORBIT CONTROLLER
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / _height,
      0.1,
      1000
    )
    this.camera.position.set(0, 0, 10)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enabled = false
    this.controls.maxDistance = 40
    this.controls.minDistance = 3
    this.controls.minPolarAngle = 0
    this.controls.maxPolarAngle = Math.PI / 2 + 0.3 // radians

    CamParralax.init(this.camera)
    // this.SoundReactorInstance.init()
    this.particleSystem.init(this.scene)
    // TODO Play Silently
    // this.SoundReactorInstance.play()

    // MyGUI.hide()
    // if (config.myGui) MyGUI.show()

    // const camFolder = MyGUI.addFolder('Camera')
    // // camFolder.open()

    // camFolder
    //   .add(this.controls, 'enabled')
    //   .onChange(() => {
    //     if (this.controls.enabled) {
    //       CamParralax.active = false
    //     }
    //   })
    //   .listen()
    //   .name('Orbit Controls')
    // camFolder
    //   .add(CamParralax, 'active')
    //   .onChange(() => {
    //     if (CamParralax.active) {
    //       this.controls.enabled = false
    //     }
    //   })
    //   .listen()
    //   .name('Cam Parallax')

    // camFolder
    //   .add(CamParralax.params, 'intensity', 0.001, 0.01)
    //   .name('Parallax Intensity')
    // camFolder.add(CamParralax.params, 'ease', 0.01, 0.1).name('Parallax Easing')

    //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
    window.addEventListener('resize', this.resizeCanvas)
    RAF.subscribe('AuratykHomeSceneUpdate', this.update)
    this.isInit = true
  }

  update() {
    this.time = this.clock.getElapsedTime()
    this.renderer.render(this.scene, this.camera)
    this.particleSystem.update()
    CamParralax.update()
    this.uniforms.uTime.value = this.time
    if (this.SoundReactorInstance.isInit) {
      this.audioProgress = this.SoundReactorInstance.getProgress()
      this.SoundReactorInstance.update()
    }
    this.uniforms.uSpectrum.value.set(
      this.SoundReactorInstance.spectrumVec.x * 2,
      1,
      1
    )
  }

  initializeAudio() {
    this.SoundReactorInstance.init()
  }

  play() {
    if (!this.SoundReactorInstance.isInit) {
      this.SoundReactorInstance.init()
    }

    this.SoundReactorInstance.play()
  }

  pause() {
    this.SoundReactorInstance.pause()
  }

  changeTrack(track) {
    logger('track in Main Scene instance', track, getFileName(__filename))
    this.SoundReactorInstance.changeAudioFile(track)
  }

  resizeCanvas() {
    this.renderer.setSize(window.innerWidth, _height)
    this.camera.aspect = window.innerWidth / _height
    this.uniforms.uResolution.value.x = window.innerWidth
    this.uniforms.uResolution.value.y = _height
    this.camera.updateProjectionMatrix()
  }

  bind() {
    this.resizeCanvas = this.resizeCanvas.bind(this)
    this.update = this.update.bind(this)
    this.init = this.init.bind(this)
  }
}

const _instance = new AuratykScene()
export default _instance
