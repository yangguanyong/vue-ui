/*
 * @Author: guanyong.yang
 * @Date: 2019-01-27 00:26:31
 * @Last Modified by: guanyong.yang
 * @Last Modified time: 2019-01-30 18:52:24
 */
export default {
  methods: {
    scroll () {
      setTimeout(() => {
        if (this.isActiveLazy()) {
          this.topNodeCount = this.calcTopCount()
          this.min = this.calcMin()
          this.max = this.calcMax()
          this.bottomNodeCount = this.calcBottomCount()
          console.log(this.topNodeCount, this.max, this.bottomNodeCount)
        }
      }, 0)
    },
    calcMin () { // 计算渲染的起始值 = 上部分占位条数
      const min = this.topNodeCount
      return min <= 0 ? 0 : min
    },
    calcMax () { // 计算渲染的结束值 = 起始值 + 范围
      const max = this.min + this.range
      return max >= this.showData.length ? this.showData.length : max
    },
    calcTopCount () { // 上部分占位条数 = （ 滚动高度 - 上部分数据 ） / 行高
      const topCount = Math.round((this.main.scrollTop - this.topHeight) / this.lineHeight)
      const max = this.showData.length - this.activePage - this.topPage // 最大值：上部分占位条数 = 总条数 - 中间数据- 上半数据
      if (topCount <= 0) {
        return 0
      } else if (topCount >= max) {
        return max
      } else {
        return topCount
      }
    },
    calcBottomCount () { // 下部分占位条数 = 总条数 - 上部分占位条数 - 范围 
      const bottomCount = this.showData.length - this.calcTopCount() - this.range
      const max = this.showData.length - this.range // 最大值：总条数 - 范围
      if (bottomCount <= 0) {
        return 0
      } else if (bottomCount >= max) {
        return max
      } else {
        return bottomCount
      }
    },
    isActiveLazy () { // 是否触发懒加载
      return this.showData.length > this.activePage + this.topPage 
    }
  }
}