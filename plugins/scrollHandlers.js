import { enableScroll, disableScroll } from '@/assets/js/utils/scrollHandlers'

export default (context, inject) => {
  // console.log('context', context)

  inject('scrollHandlers', { enableScroll, disableScroll })
}
