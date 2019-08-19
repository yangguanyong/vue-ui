<template>
  <div class="scroll-bar__drag"
  @mousedown="mouseStart">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      xStart: 0,
      yStart: 0,
      xEnd: 0,
      yEnd: 0,
      xDistance: 0,
      yDistance: 0,
      body: 0,
      active: false,
      moveEvent: null,
      upEvent: null,
      toggleMove: true
    }
  },
  mounted () {
    this.body = document.querySelector('body')
  },
  methods: {
    mouseStart (e) {
      this.active = true
      this.xStart = e.clientX
      this.yStart = e.clientY
      this.$emit('dragMouseStart')
      this.moveEvent = this.body.addEventListener('mousemove', (e) => {
        this.throttle(() => {
          this.mouseMove(e)  
        }, 20, 'toggleMove')
      })
      this.upEvent = this.body.addEventListener('mouseup', (e) => {
        this.mouseEnd(e)
      })
    },
    mouseMove (e) {
      if (this.active) {
        this.xDistance = e.clientX - this.xStart
        this.yDistance = e.clientY - this.yStart
        this.$emit('dragMouseMove', {
          startX: this.xStart,
          startY: this.yStart,
          distanceX: this.xDistance,
          distanceY: this.yDistance
        })
      }
    },
    mouseEnd (e) {
      this.body.removeEventListener('mousemove', this.moveEvent)
      this.body.removeEventListener('mouseup', this.upEvent)
      this.active = false
      this.xStart = 0
      this.yStart = 0
      this.xDistance = 0
      this.yDistance = 0
      this.$emit('dragMouseEnd')
    },
    throttle (fn, time, toggleKey) { // 节流
      if (this[toggleKey]) {
        this[toggleKey] = false
        setTimeout(() => {
          fn()
          this[toggleKey] = true
        }, time)
      }
    }
  }
}
</script>
