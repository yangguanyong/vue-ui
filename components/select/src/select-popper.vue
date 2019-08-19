<template>
  <div :style="elStyle" class="t-select__popper-list">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      // 是否出现横向滚动条
      scrollX: Boolean,
      disabled: Boolean
    },
    data () {
      return {
        height: null
      }
    },
    mounted () {
      this.getHeight()
      window.addEventListener('resize', this.getHeight)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.getHeight)
    },
    computed: {
      elStyle () {
        if (this.disabled) {
          return {}
        }
        return {
          'max-height': this.height === null ? 'auto' : this.height + 'px',
          'overflow-x': this.scrollX ? 'auto' : 'hidden',
          'overflow-y': 'auto'
        }
      }
    },
    methods: {
      getHeight () {
        // const height = this.$refs.mid.offsetHeight
        const limitHeight = document.documentElement.clientHeight / 3
        // console.log(height)
        this.height = Math.min(limitHeight)
      }
    }
  }
</script>

<style scoped>

</style>
