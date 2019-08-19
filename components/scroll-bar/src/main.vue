<template>
  <div class="scroll-bar__wrapper" ref="wrapper" v-if="!disabled"
    @mouseover="mouseoverHandle"
    @mouseenter="mouseenterHandle"
    @mouseleave="mouseleaveHandle"
    @mousewheel="mousewheelHandle">
    <div class="scroll-bar__content-wrap" ref="contentWrap">
      <slot></slot>
    </div>
    <slideXBlock
      :width="slideXBlockWidth"
      :left="slideXBlockLeft"
      @dragMouseMove="dragMouseMoveX"
      @dragMouseStart="dragMouseStartX"
      @dragMouseEnd="dragMouseEndX"
      v-if="showXSlideBlock"
      :active="overActive || dragActive"
      v-show="true"></slideXBlock>
    <slideYBlock
      :height="slideYBlockHeight"
      :top="slideYBlockTop"
      @dragMouseMove="dragMouseMoveY"
      @dragMouseStart="dragMouseStarY"
      @dragMouseEnd="dragMouseEndY"
      v-if="showYSlideBlock"
      :active="overActive || dragActive"
      v-show="true"></slideYBlock>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script>
import watchDomMx from './watch-mx.js'
import widthMx from './width-mx.js'
import slideXBlock from './x-slide-block'
import slideYBlock from './y-slide-block'
import util from './util.js'
export default {
  mixins: [watchDomMx, widthMx],
  name: 't-scroll-bar',
  components: {
    slideXBlock,
    slideYBlock
  },
  props: {
    disabled: { type: Boolean, default: false }
  },
  data () {
    return {
      startX: 0,
      startY: 0,
      overActive: false,
      dragActive: false
    }
  },
  mounted () {
    this.createdWatch()
  },
  updated () {
    this.calcHandle()
  },
  computed: {
    childNode () {
      return this.$slots.default[0].elm
    },
    wrapper () {
      return this.$refs.wrapper
    },
    contentWrap () {
      return this.$refs.contentWrap
    }
  },
  methods: {
    dragMouseStartX () {
      this.dragActive = true
      this.startX = this.contentWrap.scrollLeft
    },
    dragMouseMoveX (arg) {
      this.contentWrap.scrollLeft = this.startX + (arg.distanceX / this.proportionX)
      this.calcSlideXBlockLeft()
    },
    dragMouseEndX () {
      this.dragActive = false
    },
    dragMouseStarY () {
      this.dragActive = true
      this.startY = this.contentWrap.scrollTop
    },
    dragMouseMoveY (arg) {
      this.contentWrap.scrollTop = this.startY + (arg.distanceY / this.proportionY) // scrollLeft相当于自带边界值，因为滚到边再负也会滚不动
      this.calcSlideYBlockTop()
    },
    dragMouseEndY () {
      this.dragActive = false
    },
    mouseoverHandle () { // 悬浮移动中计算滚动条
      this.calcHandle()
    },
    mouseenterHandle () {
      this.calcHandle()
      setTimeout(() => {
        this.overActive = true
      }, 10)
    },
    mouseleaveHandle () {
      this.overActive = false
    },
    mousewheelHandle (e) { // 处理滚轮事件
      if (this.showYSlideBlock) {
        e.preventDefault()
        util.wheelHandle(e, () => {
          this.contentWrap.scrollTop -= 20
        }, () => {
          this.contentWrap.scrollTop += 20
        })
        this.calcSlideYBlockTop()
      } else if (this.showXSlideBlock) {
        e.preventDefault()
        util.wheelHandle(e, () => {
          this.contentWrap.scrollLeft -= 20
        }, () => {
          this.contentWrap.scrollLeft += 20
        })
        this.calcSlideXBlockLeft()
      }
    }
  }
}
</script>