import * as THREE from "three";

class ParticleSystem {
  constructor() {
    this.bind();
    this.particleCount = 5000;
    this.boxSize = 25;
  }

  init(scene) {
    this.scene = scene;
    this.particlesGeom = new THREE.BufferGeometry();
    this.particlesPos = [];

    for (let p = 0; p < this.particleCount; p++) {
      let x = Math.random() * this.boxSize - this.boxSize / 2;
      let y = Math.random() * this.boxSize - this.boxSize / 2;
      let z = Math.random() * this.boxSize - this.boxSize / 2;

      // Create the vertex
      this.particlesPos.push(x, y, z);
    }

    this.particlesGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.particlesPos, 3)
    );

    this.particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.015,
    });

    this.particleSystem = new THREE.Points(
      this.particlesGeom,
      this.particleMaterial
    );
    // console.log(this.particlesGeom.attributes.position.array);
    this.scene.add(this.particleSystem);
  }

  update() {
    let i = 0;
    while (i < this.particleCount) {
      const particleArr = this.particlesGeom.attributes.position.array;
      //   const x = (particleArr[i * 3 + 0] += 0.01);
      // prettier-ignore
      const y = (particleArr[i * 3 + 1] += 0.01);
      //   const z = (particleArr[i * 3 + 2] += 0.01);
      // prettier-ignore
      if (particleArr[i * 3 + 1] > this.boxSize / 2) {
          // prettier-ignore
        particleArr[i * 3 + 1]  = -this.boxSize / 2;
      }
      i++;
    }

    this.particlesGeom.attributes.position.needsUpdate = true;
  }

  bind() {
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
  }
}

const _instance = new ParticleSystem();

export { ParticleSystem };
export default _instance;
