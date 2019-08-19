<template>
  <div class="t-layout__main"
    :class="{
      't-layout__main--white': bg === 'white',
      't-layout__animate': inAnimate && !isIe
    }"
    :style="{width: width}">
    <slot></slot>
  </div>
</template>

<script>
import util from './../../utils/util'
export default {
  name: 't-layout-main',
  props: {
    bg: {
      type: String,
      default: ''
    }
  },
  inject: {
    tLayoutBody: {
      default: null
    }
  },
  data () {
    return {
      inAnimate: false
    }
  },
  watch: {
    'tLayoutBody.asideShow' () {
      this.inAnimate = true
      setTimeout(() => {
        this.inAnimate = false
      }, 500)
    }
  },
  computed: {
    width () {
      if (this.tLayoutBody && this.tLayoutBody.asideIf) {
        if (this.tLayoutBody && this.tLayoutBody.asideShow) {
          return 'calc(100% - 265px)'
        } else {
          return 'calc(100% - 55px)'
        }
      } else {
        return '100%'
      }
    },
    isIe () {
      return util.isIe() // ie的transition不能响应width的calc
    }
  }
}
</script>
