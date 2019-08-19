/*
 * @Author: guanyong.yang
 * @Date: 2019-01-27 00:26:46
 * @Last Modified by: guanyong.yang
 * @Last Modified time: 2019-01-29 14:39:16
 */
export default {
  methods: {
    $search (param) {
      const { value, field } = param
      var isSingleFiled = typeof field === 'string'
      if (value === '') {
        this.allListData.forEach(node => {
          node.foldId = null
          if (node.foldChildsStatus !== 'none') {
            node.foldChildsStatus = false
          }
          // node.disabled = false // 搜索禁用逻辑
        })
        this.activeListData = this.allListData
        this.pickShowData()
      } else {
        const idArr = [] // 记录查到的ID
        const results = [] // 根据ID过滤出数据数组
        let index = 0
        this.allListData.forEach(u => {
          if (!idArr.includes(u.id)) {
            if (isSingleFiled) { // 单个字段的查询
              var isPass = u.data[field].indexOf(value) !== -1
            } else { // 多字段搜索
              var fieldList = field.map(fieldItem => { return u.data[fieldItem] })
              var isPass = false
              for (let i = 0; i < fieldList.length; i++) {
                if (fieldList[i].indexOf(value) !== -1) {
                  isPass = true
                  break
                }
              }
            }
            if (isPass) {
              // u.disabled = false
              u.foldId = null
              if (u.foldChildsStatus !== 'none') {
                u.foldChildsStatus = false
              }
              idArr.push(u.id)
              index = idArr.length - 1 // 下标
              this.verParent(u.id, this.map, (node) => {
                if (!idArr.includes(node.id)) {
                  // node.disabled = true
                  node.foldId = null
                  node.foldChildsStatus = false
                  idArr.splice(index, 0, node.id) // 搜到的话依序插入子节点前面
                }
              })
              this.verChild(u.id, this.map, (node) => { // 搜到的话所有子级不再进下面操作
                if (!idArr.includes(node.id)) {
                  // node.disabled = false
                  node.foldId = null // 搜索默认打开全部子级
                  if (node.foldChildsStatus !== 'none') {
                    node.foldChildsStatus = false
                  }
                  idArr.push(node.id)
                }
              })
            }
          }
        })
        idArr.forEach(id => {
          results.push(this.map[id])
        })
        this.activeListData = results
        this.pickShowData()
      }
    }
  }
}