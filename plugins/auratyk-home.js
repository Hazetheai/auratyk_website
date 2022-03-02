import AuratykHomeSceneInstance from '@/assets/js/classes/AuratykHomeScene'

export default (context, inject) => {
  console.log('context', context)
  // if (context.route.path === '/') {
  inject('AuratykHomeSceneInstance', AuratykHomeSceneInstance)
  // }
}
