<template>
  <div class="scroll-bar__x-bar" :class="{'scroll-bar__x-bar--active': active}">
    <div
      class="scroll-bar__x-slide-block"
      :class="{'scroll-bar__x-slide-block--active': active}"
      :style="{width: `${width}px`, left: `${left}px`}">
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
    width: Number,
    left: Number,
    active: Boolean
  },
  methods: {
    dragMouseStart () {
      this.$emit('dragMouseStart')
    },
    dragMouseMove (arg) {
      this.$emit('dragMouseMove', {
        distanceX: arg.distanceX
      })
    },
    dragMouseEnd () {
      this.$emit('dragMouseEnd')
    }
  }
}
</script>
