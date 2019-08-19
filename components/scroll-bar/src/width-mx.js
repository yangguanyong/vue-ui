export default {
  data () {
    return {
      // x轴
      wrapperWidth: 0,
      childNodeWidth: 0,
      contentWrapWidth: 0,
      proportionX: 0,
      slideXBlockWidth: 0,
      slideXBlockLeft: 0,
      showXSlideBlock: false,
      // y轴
      wrapperHeight: 0,
      childNodeHeight: 0,
      contentWrapHeight: 0,
      proportionY: 0,
      slideYBlockHeight: 0,
      slideYBlockTop: 0,
      showYSlideBlock: false
    }
  },
  computed: {
  },
  methods: {
    calcHandle () {
      this.calcWidth()
      this.calcHeight()
    },
    calcWidth () {
      this.wrapperWidth = this.wrapper.offsetWidth
      this.childNodeWidth = this.childNode.scrollWidth // 多个子元素浮动，父元素的宽度不会被子元素撑开，会跟随父级并出滚动条，这时候可以使用scrollWidth获取父元素宽度，同理用scrollHeight获取高度
      this.contentWrapWidth = this.contentWrap.offsetWidth // 元素尺寸跟随父级
      this.proportionX = this.contentWrapWidth / this.childNodeWidth
      this.calcSlideXBlockWidth() // 重定向滚动块的宽度和位置
      this.calcSlideXBlockLeft()
      if (this.proportionX > 0 && this.proportionX < 1) {
        this.showXSlideBlock = true
      } else {
        this.showXSlideBlock = false
      }
    },
    calcHeight () {
      this.wrapperHeight = this.wrapper.offsetHeight
      this.childNodeHeight = this.childNode.scrollHeight
      this.contentWrapHeight = this.contentWrap.offsetHeight
      this.proportionY = this.contentWrapHeight / this.childNodeHeight
      this.calcSlideYBlockHeight()
      this.calcSlideYBlockTop()
      if (this.proportionY > 0 && this.proportionY < 1) {
        this.showYSlideBlock = true
      } else {
        this.showYSlideBlock = false
      }
    },
    calcSlideXBlockWidth () { // 计算x滑块宽度
      this.slideXBlockWidth = this.contentWrapWidth * this.proportionX
    },
    calcSlideXBlockLeft () { // 计算x滑块位置
      this.slideXBlockLeft = this.contentWrap.scrollLeft * this.proportionX
    },
    calcSlideYBlockHeight () { // 计算y滑块宽度
      this.slideYBlockHeight = this.contentWrapHeight * this.proportionY
    },
    calcSlideYBlockTop () { // 计算y滑块位置
      this.slideYBlockTop = this.contentWrap.scrollTop * this.proportionY
    }
  }
}