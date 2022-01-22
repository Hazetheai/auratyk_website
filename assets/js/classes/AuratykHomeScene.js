import * as THREE from 'three'

import { OrbitControls } from 'three-stdlib'

import RAF from '../utils/RAF'
import config from '../utils/config'
import MyGUI from '../utils/MyGUI'
import { ParticleSystem as PS } from './ParticleClass'
// import ParticleSystem from './ParticleClass'
import CamParralax from './CamParallaxClass'
import { Color } from 'three'
import { Fog } from 'three'

// const ParticleSystem =

class AuratykScene {
  constructor() {
    this.bind()
    this.camera
    this.scene
    this.renderer
    this.controls
    this.particleSystem = new PS(500, 25)
  }

  init(container) {
    //RENDERER SETUP
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.debug.checkShaderErrors = true
    container.appendChild(this.renderer.domElement)

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

    this.scene = new THREE.Scene()
    this.scene.background = bgColor
    this.scene.fog = fog

    //CAMERA AND ORBIT CONTROLLER
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
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

    // Pillards.init(this.scene)
    // Floor.init(this.scene)
    // Spectrum.init(this.scene)
    this.particleSystem.init(this.scene)

    MyGUI.hide()
    if (config.myGui) MyGUI.show()

    const camFolder = MyGUI.addFolder('Camera')
    // camFolder.open()

    camFolder
      .add(this.controls, 'enabled')
      .onChange(() => {
        if (this.controls.enabled) {
          CamParralax.active = false
        }
      })
      .listen()
      .name('Orbit Controls')
    camFolder
      .add(CamParralax, 'active')
      .onChange(() => {
        if (CamParralax.active) {
          this.controls.enabled = false
        }
      })
      .listen()
      .name('Cam Parallax')

    camFolder
      .add(CamParralax.params, 'intensity', 0.001, 0.01)
      .name('Parallax Intensity')
    camFolder.add(CamParralax.params, 'ease', 0.01, 0.1).name('Parallax Easing')

    //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
    window.addEventListener('resize', this.resizeCanvas)
    RAF.subscribe('threeSceneUpdate', this.update)
  }

  update() {
    this.renderer.render(this.scene, this.camera)
    this.scene.rotateY(0.0015)
    // Pillards.update()
    // Spectrum.update()
    this.particleSystem.update()
    CamParralax.update()
  }

  resizeCanvas() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
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
