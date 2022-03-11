import {
  Mesh,
  MeshNormalMaterial,
  MeshMatcapMaterial,
  TextureLoader,
  IcosahedronGeometry,
  Vector3,
  Group,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import SoundReactor from './SoundReactor'
// import MyGUI from '../utils/MyGUI'
import LoadingController from './LoadingControllerClass'

class PillardClass {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader(LoadingController)
    this.texLoader = new TextureLoader(LoadingController)
  }
  init(scene) {
    this.scene = scene
    this.pillard
    this.pillardsGroup = new Group()
    this.upVec = new Vector3(0, 1, 0)
    this.params = { waveSpeed: 1, subDivisions: 3, pillardsSize: 0.2 }

    const gTex = this.texLoader.load('/textures/gray-matcap.png')
    const bTex = this.texLoader.load('/textures/black-matcap.png')

    this.gMatcap = new MeshMatcapMaterial({
      matcap: gTex,
    })
    this.bMatcap = new MeshMatcapMaterial({
      matcap: bTex,
    })

    this.modelLoader.load('/models/pillard.glb', (glb) => {
      glb.scene.traverse((child) => {
        if (child.name === 'Base') {
          this.pillard = child
          child.material = this.bMatcap
        }

        if (child.name === 'Tube') {
          child.material = this.gMatcap
        }
      })

      this.computePositions()
    })

    // const sphereFolder = MyGUI.addFolder('Sphere Pillards')
    // sphereFolder.open()
    // sphereFolder.add(this.params, 'waveSpeed', 0.001, 3).name('Wave Speed')
    // sphereFolder
    //   .add(this.params, 'subDivisions', 1, 5, 1)
    //   .name('Ico Subdivisions')
    //   .onChange(this.computePositions)
    // sphereFolder
    //   .add(this.params, 'pillardsSize', 0.01, 1)
    //   .name('Pillards Size')
    //   .onChange(this.computePositions)
  }
  computePositions() {
    let ico
    this.scene.traverse((child) => {
      if (child.name === 'ico') {
        ico = child
      }
    })

    if (ico) {
      this.scene.remove(ico)
    }

    const sphereGeo = new IcosahedronGeometry(2, this.params.subDivisions)
    const sphereMat = this.gMatcap
    const sphere = new Mesh(sphereGeo, sphereMat)

    sphere.name = 'ico'

    // const sphere = new Mesh(
    //   sphereGeo,
    //   new MeshNormalMaterial({ wireframe: true })
    // );

    this.scene.add(sphere)
    this.pillardsGroup.clear()

    const vertArray = []

    for (let i = 0; i < sphereGeo.attributes.position.array.length; i += 3) {
      const x = sphereGeo.attributes.position.array[i]
      const y = sphereGeo.attributes.position.array[i + 1]
      const z = sphereGeo.attributes.position.array[i + 2]

      vertArray.push(new Vector3(x, y, z))
    }

    const pillPos = []
    for (let i = 0; i < vertArray.length; i++) {
      let existsFlag = false
      for (let j = 0; j < pillPos.length; j++) {
        if (
          pillPos[j].x === vertArray[i].x &&
          pillPos[j].y === vertArray[i].y &&
          pillPos[j].z === vertArray[i].z
        ) {
          existsFlag = true
        }
      }
      if (!existsFlag) {
        const posV3 = new Vector3(
          vertArray[i].x,
          vertArray[i].y,
          vertArray[i].z
        )
        pillPos.push(posV3)

        const c = this.pillard.clone()
        c.position.copy(posV3)
        // c.children[0].position.y = 1;
        c.scale.multiplyScalar(this.params.pillardsSize)
        c.quaternion.setFromUnitVectors(this.upVec, posV3.normalize())
        this.pillardsGroup.add(c)
      }
    }
    this.scene.add(this.pillardsGroup)
  }
  update() {
    // console.log(`updating`);
    if (SoundReactor.playFlag) {
      let i = 0
      while (i < this.pillardsGroup.children.length) {
        this.pillardsGroup.children[i].children[0].position.y =
          (SoundReactor.fftdata[i] / 255) * 4
        i++
      }
    } else {
      let i = 0
      while (i < this.pillardsGroup.children.length) {
        this.pillardsGroup.children[i].children[0].position.y =
          (Math.sin(
            Date.now() * 0.01 * this.params.waveSpeed +
              this.pillardsGroup.children[i].position.x
          ) +
            1) *
          1.5
        i++
      }
    }
  }
  bind() {
    this.computePositions = this.computePositions.bind(this)
  }
}
const _instance = new PillardClass()
export default _instance
