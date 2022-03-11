import { enableScroll, disableScroll } from '@/assets/js/utils/scrollHandlers'

export default (context, inject) => {
  // console.log('context', context)
  // if (context.route.path === '/') {
  inject('scrollHandlers', { enableScroll, disableScroll })
  // }
}
