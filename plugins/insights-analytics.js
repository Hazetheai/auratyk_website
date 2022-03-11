import { init, track, parameters, trackPages } from 'insights-js'

export default (context, inject) => {
  // console.log('context', context)
  // if (context.route.path === '/') {
  inject('InsightsAnalytics', { init, track, trackPages, parameters })
  // }
}
