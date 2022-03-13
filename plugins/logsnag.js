import { LogSnag } from 'logsnag'
const logsnag = new LogSnag('ab220717d5e17b49b3be52e6b9947134')

export default (context, inject) => {
  // console.log('context', context)

  inject('logsnag', logsnag)
}
