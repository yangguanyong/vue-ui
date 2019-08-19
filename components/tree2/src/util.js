/*
 * @Author: guanyong.yang
 * @Date: 2019-01-24 16:46:04
 * @Last Modified by: guanyong.yang
 * @Last Modified time: 2019-01-30 14:30:43
 */

export default {
  methods: {
    verParent (id, map, cb) {
      const parent = map[map[id].parentId]
      if (parent) {
        cb(parent)
        this.verParent(parent.id, map, cb)
      }
    },
    verChild (id, map, cb) {
      const list = map[id].childs
      if (list.length !== 0) {
        list.forEach((u) => {
          cb(map[u])
          this.verChild(u, map, cb)
        })
      }
    }
    // $loop (cba) {
    //   this.listData.forEach(u => {
    //     cba(u)
    //   })
    // }
  }
}