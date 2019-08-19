<template>
  <div class="t-progress" :class="{ 't-progress--inner': !inner && showText }">
    <div class="t-progress__bar" :style="{ height: width + 'px' }">
      <span class="t-progress__progress" :style="{width: percentValue}">
        <var v-if="inner && showText">{{ percentText }}</var>
      </span>
      <var v-if="inner && showText" class="t-progress__left-word">{{ percentText }}</var>
    </div>
    <var v-if="!inner && showText" class="t-progress__right-word" :style="{lineHeight: `${width}px`}">{{ percentText }}</var>
  </div>
</template>

<script>
  export default {
    name: 't-progress',
    props: {
      total: {
        type: Number,
        default: 0
      },
      current: {
        type: Number,
        default: 0
      },
      inner: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 14
      },
      showText: {
        type: Boolean,
        default: true
      },
      percent: { // 直接传百分数字符串
        type: String
      }
    },
    computed: {
      percentNum () {
        if (!this.total || !this.current) {
          return 0
        } else {
          return this.current / this.total * 100
        }
      },
      percentValue () {
        return this.percent ? this.percent : this.percentNum + '%'
      },
      percentText () {
        return this.percent ? this.percent : `${(this.percentNum + '').match(/\d+(\.[123456789]{1})?/)[0]}%`
      }
    }
  }
</script>
