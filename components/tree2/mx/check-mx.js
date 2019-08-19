/*
 * @Author: guanyong.yang
 * @Date: 2019-01-27 00:26:08
 * @Last Modified by: guanyong.yang
 * @Last Modified time: 2019-01-30 15:33:25
 */
export default {
  computed: {
    isAll () {
      if (this.activeListData.length === 0) {
        return false
      } else {
        let isAll = true
        for (let i = 0; i < this.activeListData.length; i++) {
          if (!this.activeListData[i].checked) {
            isAll = false
            break
          }
        }
        return isAll
      }
    }
  },
  methods: {
    nodeChecked (id, check) {
      if (this.checkedRela) { // 关联多选
        this.nodeCheckedRela(id, check)
      }
      if (this.checkedCheckbox) { // 不关联多选
        this.nodeCheckedCheckbox(id, check)
      }
      if (this.checkedRedio) { // 单选
        this.nodeCheckedRadio(id, check)
      }
    },
    nodeCheckedRela (id, check) {
      const node = this.map[id]
      if (check) {
        this.setNodeCheckAndHalf(node, check)
        this.verChild(id, this.map, (u) => {
          this.setNodeCheckAndHalf(u, check)
        })
        this.verParent(id, this.map, (u) => {
          let half = false
          this.verChild(u.id, this.map, (child) => {
            if (child.level === u.level + 1) { // 只看一级
              if (!child.checked || child.half) { // 子有没选 || 子有半选
                half = true
              }
            }
          })
          this.setNodeCheckAndHalf(u, check, half)
        })
      } else {
        this.setNodeCheckAndHalf(node, check)
        this.verChild(id, this.map, (u) => {
          this.setNodeCheckAndHalf(u, check)
        })
        this.verParent(id, this.map, (u) => {
          let half = false
          let checked = false
          this.verChild(u.id, this.map, (child) => {
            if (child.level === u.level + 1) { // 只看一级
              if (child.checked) { // 子有选
                half = true
                checked = true
              }
            }
          })
          this.setNodeCheckAndHalf(u, checked, half)
        })
      }
      this.$emit('change', node)
    },
    nodeCheckedCheckbox (id, check) {
      const node = this.map[id]
      this.$emit('change', node)
    },
    nodeCheckedRadio (id, check) {
      const node = this.map[id]
      this.allListData.forEach(u => {
        if (u.id !== node.id) {
          this.setNodeCheckAndHalf(u, false)
        }
      })
      this.$emit('change', node)
    },
    changeAll () {
      if (!this.isAll) {
        this.activeListData.forEach(u => {
          this.setNodeCheckAndHalf(u, true, false)
        })
      } else {
        this.activeListData.forEach(u => {
          this.setNodeCheckAndHalf(u, false, false)
        })
      }
    },
    setNodeCheckAndHalf (node, checked, half = false) {
      node.checked = checked
      node.half = half
    },
    /**
    * 使用组件者外部调用方法
    */
    $loop (cba) {
      setTimeout(() => {
        this.allListData.forEach(u => {
          const checked = u.checked
          cba(u)
          if (checked !== u.checked) {
            this.nodeChecked(u.id, u.checked)
          }
        })
      }, 0)
    }
  }
}