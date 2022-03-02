import gsap from '@/libs/gsap-bonus'
import VelocityTracker from '@/libs/gsap-bonus/utils/VelocityTracker'

gsap.registerPlugin(VelocityTracker)

export default (context, inject) => {
  console.log('context', context)
  console.log('gsap', gsap)
  inject('gsap', gsap)
}
