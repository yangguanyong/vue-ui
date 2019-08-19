<template>
  <div
  class="t-nav"
  :class="{
    't-nav--default': type === 'default',
    't-nav--dark': type === 'dark',
    't-nav--light': type === 'light',
    't-nav--medium': size === 'medium',
    't-nav--small': size === 'small'
  }">
    <ul>
      <slot></slot>
      <li :style="{clear: 'both', display: 'none'}"></li>
    </ul>
  </div>
</template>

<script>
export default {
  componentName: 'navUl',
  name: 't-nav',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: { // medium / small
      type: String,
      default: 'medium'
    }
  },
  provide () {
    return {
      root: this
    }
  },
  data () {
    return {
      activeParentList: []
    }
  },
  mounted () {
    this.$on('select', (indexOrRoute) => {
      if (indexOrRoute === 'index') {
        this.$emit('change', this.activeParentList[0])
      }
    })
  }
}
</script>
