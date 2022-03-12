import * as THREE from 'three'
const _instance = new THREE.LoadingManager()

_instance.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log(
    'Started loading file: ' +
      url +
      '.\nLoaded ' +
      itemsLoaded +
      ' of ' +
      itemsTotal +
      ' files.'
  )
}

_instance.onLoad = function () {
  console.log('Loading complete!')
}

_instance.onProgress = function (url, itemsLoaded, itemsTotal) {
  console.log(
    'Loading file: ' +
      url +
      '.\nLoaded ' +
      itemsLoaded +
      ' of ' +
      itemsTotal +
      ' files.'
  )
}

_instance.onError = function (url) {
  console.log('There was an error loading ' + url)
}

// const loader = new THREE.OBJLoader(_instance)
// loader.load('file.obj', function (object) {
//   //
// })
export default _instance
