export default {
  methods: {
    foldChildHandle (node) {
      node.foldChildsStatus = !node.foldChildsStatus
      if (node.foldChildsStatus) { // 关闭
        let count = 0
        this.verChild(node.id, this.map, (u) => {
          if (!u.foldId) {
            u.foldId = node.id
            count++
            this.foldDataList.push(node)
          }
        })
        this.foldCount += count
        /**
         * 新开一个显示数据，过滤掉折叠的数据
         * 重新计算值
         */
      } else {
        let count = 0
        this.verChild(node.id, this.map, (u) => {
          if (u.foldId === node.id) {
            u.foldId = null
            count++
          }
        })
        this.foldCount-=count
      }
      this.foldFinishCalc()
    },
    foldFinishCalc () {
      this.pickShowData()
    },
    foldAll () {
      this.activeListData.forEach(item => {
        if (item.level !== 0) {
          item.foldId = item.parentId
        }
        if (item.foldChildsStatus !== 'none') { // 最底层没有箭头
          item.foldChildsStatus = true
        }
      })
      this.foldFinishCalc()
      this.foldAllStatus = true
    },
    openAll () {
      this.activeListData.forEach(item => {
        if (item.level !== 0) {
          item.foldId = null
        }
        if (item.foldChildsStatus !== 'none') { // 最底层没有箭头
          item.foldChildsStatus = false
        }
      })
      this.foldFinishCalc()
      this.foldAllStatus = false
    }
  }
}