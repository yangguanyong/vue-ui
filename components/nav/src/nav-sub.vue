<template>
  <div
    class="t-nav-sub"
    :class="{
      't-nav-sub--bottom-left': isFirstStep && firstStepPosi === 'left',
      't-nav-sub--bottom-right': isFirstStep && firstStepPosi === 'right',
      't-nav-sub--left': !isFirstStep && secondaryStepPosi === 'left',
      't-nav-sub--right': !isFirstStep && secondaryStepPosi === 'right',
      't-nav-sub--default': styleType === 'default',
      't-nav-sub--dark': styleType === 'dark',
      't-nav-sub--light': styleType === 'light',
      't-nav-sub--menu': styleType === 'menu',
      't-nav-sub--medium': size === 'medium',
      't-nav-sub--small': size === 'small'
    }">
    <ul
      v-show="isShow"
      class="tbc-nav-sub">
        <slot></slot>
    </ul>
  </div>
</template>

<script>
import emitter from './emitter.js'
export default {
  name: 't-nav-sub',
  mixins: [emitter],
  componentName: 'navUlSub',
  components: {
  },
  inject: {
    root: {
      default: null
    }
  },
  props: {
    type: String,
    float: String
  },
  data () {
    return {
      isShow: false,
      isFirstStep: this.$parent.$options.componentName === 'navLi',
      styleType: this.type || this.root.type,
      size: this.root.size
    }
  },
  mounted () {
    this.$on('toggleShow', (value) => {
      this.isShow = value
    })
  },
  computed: {
    firstStepPosi () { // 第一级默认在左边
      return this.float || 'left'
    },
    secondaryStepPosi () { // 次要级默认在右边
      return this.float || 'right'
    }
  }
}
</script>
