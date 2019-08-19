/*
 * @Author: guanyong.yang
 * @Date: 2019-01-27 00:26:22
 * @Last Modified by: guanyong.yang
 * @Last Modified time: 2019-01-29 17:51:31
 */
const loopData = (list, childKey, cb) => {
  list.forEach(ele => {
    if (ele) {
      cb(ele)
      if (ele[childKey]) { // child
        loopData(ele[childKey], childKey, cb)
      }
    }
  })
}

const diguiPop = (list) => {
  const last = list[list.length - 1]
  if (last && last.child === 1) {
    list.pop()
    diguiPop(list)
  } else {
    if (list.length !== 0) {
      list[list.length - 1].child--
    }
  }
}

const setNodeInfo = (parentIdList, node, map) => { // 根据parentIdList设置node信息
  const lastParent = parentIdList[parentIdList.length - 1]
  node.level = parentIdList.length
  node.parentId = lastParent.id
  map[lastParent.id].childs.push(node.id)
}

const pushParentList = (parentIdList, node, childKey) => { // 更新parentIdList数据
  parentIdList.push({
    id: node.id,
    child: node.data[childKey].length
  })
}

export default {
  methods: {
    treeToList (tree) {
      let parentId = null
      const parentIdList = []
      const list = []
      const map = {}
      let index = 0
      loopData(tree, this.childKey, (ele) => {
        const node = { // 定义node，初始化的时候checked和half都为false
          data: ele,
          checked: false, // 是否勾选
          checkable: true, // 是否需要勾选
          level: null,
          id: ele[this.idKey] || index,
          half: false, // 半选
          show: true,
          index: index,
          disabled: false, // 禁用
          childs: [],
          parentId: null,
          foldChildsStatus: false, // 是否收起子级
          foldId: null // 被哪个父级收起的
        }
        if (!ele[this.childKey] || ele[this.childKey].length === 0) { // 最底层
          setNodeInfo(parentIdList, node, map)
          diguiPop(parentIdList)
          node.foldChildsStatus = 'none'
        } else {
          if (parentIdList.length === 0) { // 最顶层
            node.level = 0
            pushParentList(parentIdList, node, this.childKey)
          } else { // 中间层
            setNodeInfo(parentIdList, node, map)
            pushParentList(parentIdList, node, this.childKey)
          }
        }
        index++
        map[node.id] = node
        list.push(node)
      })
      return {
        list,
        map
      }
    },
    pickShowData () {
      this.showData = this.activeListData.filter(u => !u.foldId)
      this.topNodeCount = this.calcTopCount()
      this.min = this.calcMin()
      this.max = this.calcMax()
      this.bottomNodeCount = this.calcBottomCount()
    }
  }
}