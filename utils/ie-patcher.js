/**
 * 此文件做了两个兼容处理
 * 1. (ie10 || ie11) && placeholder 条件下会自动触发一次 inputHandler
 * 2. ie9 退格键无法触发 input 事件
 */
const isClient = (function () {
  const root = this
  return typeof window !== 'undefined' && root === window
})()
const isIe9 = (function () {
  if (isClient) {
    return window.navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0
  }
  return false
})()

function trigger (el, type) {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

export default {
  created () {
    if (!isClient) return
    // (ie10 || ie11) && placeholder 条件下会自动触发一次 inputHandler
    const UA = window.navigator.userAgent.toLowerCase()
    const isIe = /msie|trident/.test(UA)
    if (isIe && !isIe9 && Boolean(this.placeholder)) {
      const oriFn = this.inputHandler
      this.inputHandler = e => {
        this.inputHandler = oriFn
        this.$forceUpdate()
      }
    }
  },
  mounted () {
    if (isIe9) {
      // http://www.matts411.com/post/internet-explorer-9-oninput/
      document.addEventListener('selectionchange', this.ie9handler)
    }
  },
  beforeDestroy () {
    if (isIe9) {
      document.removeEventListener('selectionchange', this.ie9handler)
    }
  },
  methods: {
    ie9handler () {
      const el = document.activeElement
      if (el && el === this.$refs.input) {
        trigger(el, 'input')
      }
    }
  }
}
