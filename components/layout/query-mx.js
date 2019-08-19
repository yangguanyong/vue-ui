export default {
  props: {
    mainQuery: Object, // 调接口用的参数
    asideQuery: Object // 搜索组件用的参数
  },
  data () {
    return {
      templMainQuery: null,
      templAsideQuery: null
    }
  },
  mounted () {
    if (this.mainQuery) {
      this.templMainQuery = JSON.parse(JSON.stringify(this.mainQuery))
    }
    if (this.asideQuery) {
      this.templAsideQuery = JSON.parse(JSON.stringify(this.asideQuery))
    }
  },
  created () {
    if (this.mainQuery && this.asideQuery) {
      this.$on('clearByTLayOutFoot', () => { // 清除
        for (let i in this.templAsideQuery) {
          this.asideQuery[i] = this.templAsideQuery[i]
        }
      })
      this.$on('searchByTLayOutFoot', () => { // 搜索
        if (this.mainQuery.pageIndex) { this.mainQuery.pageIndex = 1 }
        for (let i in this.asideQuery) {
          if (i !== 'limit' && i !== 'pageIndex') {
            this.mainQuery[i] = this.asideQuery[i]
          }
        }
        this.$emit('getData')
      })
      this.$on('pageChangeByPagin', (page) => { // 分页
        if (this.mainQuery.pageIndex) { this.mainQuery.pageIndex = page }
        this.$emit('getData')
      })
      this.$on('sizeChangeByPagin', (size) => { // 条数
        if (this.mainQuery.limit) { this.mainQuery.limit = size }
        this.$emit('getData')
      })
    }
  }
}