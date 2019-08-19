<template>
  <div class="t-layout__aside"
    :class="{'t-layout__animate': inAnimate && !isIe, 't-layout__hidden': overflowHidden}"
    :style="{width: width, height: height}">
    <div class="t-layout__aside-close" @click="toggle">
      <span :class="tLayoutBody.asideShow ? 't-icon-arrow-right' : 't-icon-arrow-left'"></span>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import util from './../../utils/util'
export default {
  name: 't-layout-aside',
  inject: {
    tLayoutBody: {
      default: null
    }
  },
  data () {
    return {
      inAnimate: false,
      overflowHidden: !this.tLayoutBody.asideShow // 初始化也根据是否显示来控制
    }
  },
  created () {
    this.tLayoutBody.asideIf = true
  },
  methods: {
    toggle () {
      if (!this.inAnimate) {
        this.inAnimate = true
        this.tLayoutBody.asideShow = !this.tLayoutBody.asideShow
        this.saveLocal()
        if (!this.tLayoutBody.asideShow) { this.overflowHidden = true }
        setTimeout(() => {
          this.inAnimate = false
          if (this.tLayoutBody.asideShow) { this.overflowHidden = false }
        }, 500)
      }
    },
    saveLocal () { // 储存到浏览器本地
      localStorage.setItem('talebase-ui-layout-aside-state', this.tLayoutBody.asideShow ? 1 : 0)
    }
  },
  computed: {
    width () {
      return this.tLayoutBody.asideShow ? '250px' : '40px'
    },
    height () {
      return this.tLayoutBody.asideShow ? 'auto' : '32px'
    },
    isIe () {
      return util.isIe() // ie的transition不能响应width的calc
    }
  }
}
</script>
