import * as THREE from "three";
const _instance = new THREE.LoadingManager();
_instance.onProgress = (url, loaded, total) => {
  console.log(`url, loaded, total`, url, loaded, total);
};
export default _instance;
