import {
  Color,
  Mesh,
  MeshNormalMaterial,
  ShaderMaterial,
  TextureLoader,
  Vector3,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import spectrumFrag from '../../shaders/spectrum.frag'
import spectrumVert from '../../shaders/spectrum.vert'
import MyGUI from '../utils/MyGUI'
import LoadingController from './LoadingControllerClass'

class SpectrumClass {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader(LoadingController)
    this.texLoader = new TextureLoader(LoadingController)
  }
  init(scene) {
    this.scene = scene
    this.spectrum
    this.uniforms = {
      uMatCap: {
        value: this.texLoader.load('/textures/black-matcap.png'),
      },
      uSpecterSize: {
        value: 0.8,
      },
      uWaveBorderSize: {
        value: 0.3,
      },
      uWaveSpeed: {
        value: 0.1,
      },
      uBorderColor: {
        value: new Color('hsl(287, 80%, 80%)'),
      },
      uTime: {
        value: 0,
      },
    }

    const shaderFolder = MyGUI.addFolder('Spectrum')
    shaderFolder.open()
    shaderFolder
      .add(this.uniforms['uSpecterSize'], 'value', -1, 1)
      .name('Specter Size')
    shaderFolder
      .add(this.uniforms['uWaveBorderSize'], 'value', 0.01, 1)
      .name('Wave Border Size')
    shaderFolder
      .add(this.uniforms['uWaveSpeed'], 'value', 0.01, 1)
      .name('Wave Speed')
    // shaderFolder
    //   .add(this.uniforms["uBorderColor"], "value")
    //   .name("Border Color");

    this.shaderMat = new ShaderMaterial({
      vertexShader: spectrumVert,
      fragmentShader: spectrumFrag,
      uniforms: this.uniforms,
      transparent: true,
    })

    this.modelLoader.load('/models/spectrum.glb', (glb) => {
      glb.scene.traverse((child) => {
        if (child instanceof Mesh) {
          child.material = this.shaderMat
          child.scale.multiplyScalar(2.7)
          child.position.y = -2.7
        }

        this.scene.add(child)
      })
    })
  }
  update() {
    this.uniforms.uTime.value += 1
  }
  bind() {}
}
const _instance = new SpectrumClass()
export default _instance
