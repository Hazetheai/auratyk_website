import { init, track, parameters, trackPages } from 'insights-js'

export default (context, inject) => {
  // console.log('context', context)

  inject('InsightsAnalytics', { init, track, trackPages, parameters })
}
