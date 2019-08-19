<template>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:after-enter="afterEnter"

    v-on:before-leave="beforeLeave"
    v-on:leave="leave"
    v-on:after-leave="afterLeave"
  >
    <slot></slot>
  </transition>
</template>

<script>
import util from './util'
export default {
  methods: {
    beforeEnter (el) {
      util.addClass(el, 'collapse-transition')
      el.style.height = '0'
    },
    enter (el) {
      if (el.scrollHeight !== 0) {
        el.style.height = el.scrollHeight + 'px'
      } else {
        el.style.height = ''
      }
      el.style.overflow = 'hidden'
    },
    afterEnter (el) {
      util.removeClass(el, 'collapse-transition')
      el.style.height = ''
      el.style.overflow = ''
    },
    beforeLeave (el) {
      el.style.height = el.scrollHeight + 'px'
      el.style.overflow = 'hidden'
    },
    leave (el) {
      if (el.scrollHeight !== 0) {
        util.addClass(el, 'collapse-transition')
        el.style.height = 0
      }
    },
    afterLeave (el) {
      util.removeClass(el, 'collapse-transition')
      el.style.height = ''
      el.style.overflow = ''
    }
  }
}
</script>
