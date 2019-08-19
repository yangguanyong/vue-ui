<template>
<div class="t-circle-progress__wrap" :style="{ width: widthPx, height: widthPx }">
  <div class="t-circle-progress__ctn" :style="{ width: widthPx, height: widthPx }">
    <svg :height="width" :width="width">
      <circle :cx="c" :cy="c" :r="r" fill="none" stroke="#E5E9F2" :stroke-width="crude" stroke-linecap="round"/>
      <circle :cx="c" :cy="c" :r="r" fill="none" :stroke="bgColor" :stroke-width="crude" :stroke-dasharray="dasharray"/>
    </svg>
  </div>
  <div class="t-circle-progress__percent" :style="{ width: widthPx, height: widthPx, lineHeight: widthPx }" v-if="isShowNum">
    {{ pertange + '%' }}
  </div>
  <div class="t-circle-progress__word" :style="{ width: widthPx, height: widthPx }" v-else>
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  name: 't-circle-progress',
  props: {
    total: {
      type: Number,
      default: 0
    },
    part: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    crude: {
      type: Number,
      default: 0
    },
    isShowNum: {
      type: Boolean,
      default: true
    },
    bg: {
      type: String,
      default: '#364FBB'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    c () {
      return this.width / 2 // 坐标
    },
    r () {
      return this.width / 2 - this.crude / 2 // 半径
    },
    pertange () {
      if (this.total === 0) {
        return 0
      }
      return Math.round(this.part / this.total * 100)
    },
    widthPx () {
      return this.width + 'px'
    },
    dasharray () {
      var circleLength = Math.round(2 * Math.PI * this.r)
      var val = parseFloat(this.pertange).toFixed(2) // 两位小数
      val = Math.max(0, val)
      val = Math.min(100, val)
      var length = circleLength * val / 100
      return `${length},1000`
    },
    bgColor () {
      if (this.bg && this.bg !== '') { return this.bg } else { return '#364FBB' }
    }
  }
}
</script>
