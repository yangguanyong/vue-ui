<template>
  <div class="t-layout__main-item" :class="[bgScoped]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 't-layout-main-item',
  props: {
    bg: {
      type: String,
      default: ''
    },
    pd: {
      type: String,
      default:'0px'
    },
    tl: {
      type: String,
      default: 'left'
    }
  },
  computed: {
    bgScoped () {
      const map = {
        'white': 't-layout__main-item--white',
        'pink': 't-layout__main-item--pink',
        'blue': 't-layout__main-item--blue',
        'gray': 't-layout__main-item--gray'
      }
      return map[this.bg] ? map[this.bg] : ''
    }
  }
}
</script>
