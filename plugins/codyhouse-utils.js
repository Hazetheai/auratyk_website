import socialSharing from '@/assets/js/codyhouse-utils/_1_social-sharing.js'
import stickyShareBar from '@/assets/js/codyhouse-utils/_2_sticky-sharebar.js'

export default (context, inject) => {
  // console.log('context', context)
  inject('codyhouseUtils', { socialSharing, stickyShareBar })
}
