export default {
  data () {
    return {
      intervalEvent: null
    }
  },
  destroyed () {
    clearInterval(this.intervalEvent)
  },
  methods: {
    createdWatch () {
      // this.createSetInterval()
    },
    createdMutationObserver () {
      this.myObserver = new MutationObserver((mutations, observer) => {
        this.calcHandle()
      })
      this.myObserver.observe(this.childNode, {
        childList: true,
        attributes: true
      })
    },
    createSetInterval () {
      this.intervalEvent = setInterval(() => {
        this.calcHandle()
      }, 500)
    }
  }
}