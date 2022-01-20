import { Mesh, MeshNormalMaterial } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import LoadingController from './LoadingControllerClass'

class FloorClass {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader(LoadingController)
  }
  init(scene) {
    this.scene = scene
    this.floor

    this.modelLoader.load('/models/floor.glb', (glb) => {
      glb.scene.traverse((child) => {
        if (child instanceof Mesh) {
          this.floor = child
        }
        if (this.floor) {
          this.floor.translateY(-4)
          this.floor.scale.multiplyScalar(1.5)
          this.scene.add(this.floor)
        }
      })
    })
  }
  update() {}
  bind() {}
}
const _instance = new FloorClass()
export default _instance
