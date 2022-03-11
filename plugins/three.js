import MainThreeSceneInstance from '@/assets/js/classes/MainThreeScene'

export default (context, inject) => {
  // console.log('context', context)
  if (context.route.path === '/three') {
    inject('MainThreeSceneInstance', MainThreeSceneInstance)
  }
}
