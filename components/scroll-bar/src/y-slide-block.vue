<template>
  <div class="scroll-bar__y-bar" :class="{'scroll-bar__y-bar--active': active}">
    <div
      class="scroll-bar__y-slide-block"
      :class="{'scroll-bar__y-slide-block--active': active}"
      :style="{height: `${height}px`, top: `${top}px`}">
      <myDrag @dragMouseMove="dragMouseMove" @dragMouseStart="dragMouseStart" @dragMouseEnd="dragMouseEnd"></myDrag>
    </div>
  </div>
</template>

<script>
import myDrag from './drag'
export default {
  components: {
    myDrag
  },
  data () {
    return {
    }
  },
  props: {
    height: Number,
    top: Number,
    active: Boolean
  },
  methods: {
    dragMouseStart () {
      this.$emit('dragMouseStart')
    },
    dragMouseMove (arg) {
      this.$emit('dragMouseMove', {
        distanceY: arg.distanceY
      })
    },
    dragMouseEnd () {
      this.$emit('dragMouseEnd')
    }
  }
}
</script>
