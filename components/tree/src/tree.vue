<template>
  <div ref="main" class="t-tree" v-if="showTreeData && showTreeData.length !== 0" @scroll="scroll" :class="{'t-tree__lazy': isLazy}" :style="{'height': lazyHeight}">
    <label v-if="all && showCheckbox" style='padding-bottom:10px;' class="tree-all-check">
      <tCheckedBox :checked="isAll" id='allLabel' @change.native="changeAll"></tCheckedBox>
      <label for='allLabel'></label>
      全选
    </label>
    <ul class="t-tree__root">
      <slot name="resetItem"></slot>
      <permissionRank1 v-for="(o, index) in showTreeData" :data="o" :key="index" v-if="isLazy ? index <= maxNum : true">
        <permissionSlot :arg="{ data: o, node: { parent: null, level: level } }" :tpl="$scopedSlots.default"></permissionSlot>
      </permissionRank1>
    </ul>
    <loading v-show="loading"></loading>
  </div>
  <div v-else style="text-align: center;padding: 25px 0px;color: #5e7382;">
    暂无数据
  </div>
</template>

<script>
import permissionRank1 from './tree-node'
import permissionSlot from './tree-slot'
import emitter from './emitter'
import loading from './loading'
import tCheckedBox from '../../checkbox'
let onlyId = new Date().getTime()
export default {
  mixins: [emitter],
  name: 't-tree',
  components: {
    permissionRank1,
    permissionSlot,
    loading,
    tCheckedBox
  },
  props: {
    data: Array,
    valueKey: String,
    childKey: String,
    idKey: String,
    lazyHeight: String, // 懒加载需要设置高度
    showCheckbox: { // 节点是否可被选择
      type: Boolean,
      default: true
    },
    isNeedExpand: { // 是否需要箭头展开
      type: Boolean,
      default: true
    },
    expandInit: { // 默认展开
      type: Boolean,
      default: true
    },
    checkModel: { // 0: 关联多选, 1: 不关联多选, 2: 单选
      type: Number,
      default: 0
    },
    all: { // 是否显示全选
      type: Boolean,
      default: true
    },
    left: { // 级别间距
      type: String,
      default: '20px'
    },
    size: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      level: 0,
      maxNum: 50,
      loading: false,
      showTreeData: this.data, // 搜索过滤后呈现的显示数据
      isRela: this.checkModel === 0,
      isCheckbox: this.checkModel === 1,
      isRadio: this.checkModel === 2,
      searchArr: []
    }
  },
  watch: {
    'data' (n, o) {
      const main = this.$refs.main
      if (main && n.length !== o.length && this.isLazy) {
        main.scrollTo && main.scrollTo(0, 0)
      }
      this.showTreeData = n
    }
  },
  provide () {
    return {
      root: this
    }
  },
  methods: {
    search (arg) {
      const { value, field } = arg // 搜索关键字，搜索数据源，搜索的字段key
      var isSingleFiled = typeof field === 'string'
      return new Promise((resolve, reject) => {
        const arr = []
        this.searchArr = []
        this.data.forEach(u => {
          this.loop([u], (e) => {
            if (isSingleFiled) {
              if (e[field] && e[field].indexOf(value) !== -1) {
                this.searchArr.push(e)
                if (!arr.includes(u)) { // 如果存在则不必查
                  arr.push(u)
                }
              }
            } else {
              for (let i = 0; i < field.length; i++) {
                if (e[field[i]] && e[field[i]].indexOf(value) !== -1) {
                  this.searchArr.push(e)
                  if (!arr.includes(u)) {
                    arr.push(u)
                  }
                }
              }
            }
          })
        })
        this.showTreeData = arr
        this.$nextTick(() => { // todo：第二条问题
          this.broadcast('permissionRank', 'search', value)
        })
        resolve(arr)
      })
    },
    scroll () {
      if (!this.loading && this.isLazy) {
        const main = this.$refs.main
        if (main.scrollTop + main.clientHeight === main.scrollHeight && this.maxNum < this.showTreeData.length) {
          this.loading = true
          this.maxNum += 50
          setTimeout(() => {
            this.loading = false
          }, 300)
        }
        if (main.scrollTop < 100) { // 拉到顶部
          this.maxNum = 50
        }
      }
    },
    change (data) {
      this.$emit('change', {
        data,
        all: this.isAll
      })
    },
    changeAll (event) {
      const hasValue = this.valueKey
      this.loop(this.showTreeData, (e) => {
        e[hasValue] = event.target.checked
      })
      this.$emit('change', {
        data: this.showTreeData,
        all: this.isAll
      })
    },
    getIds () {
      const arr = []
      const id = this.idKey
      const hasValue = this.valueKey
      this.loop(this.showTreeData, (e) => {
        if (e[hasValue]) {
          arr.push(e[id])
        }
      })
      return arr
    },
    setOnlyId () {
      return onlyId++
    },
    // loop (data, cba = () => {}) {
    //   const child = this.childKey
    //   data.forEach(e => {
    //     cba(e)
    //     if (e[child]) {
    //       this.loop(e[child], cba)
    //     }
    //   })
    // },
    loop (data, cba = () => {}) {
      const child = this.childKey
      data.forEach(e => {
        if (this.isRela) { var { type, checked } = this.loopRecordItem(e) }
        cba(e)
        if (this.isRela) { this.loopAfterHandle({ type, checked, node: e }) }
        if (e[child]) {
          this.loop(e[child], cba)
        }
      })
    },
    loopRecordItem (item) {
      let type = null
      const valueKey = this.valueKey
      const id = this.idKey
      if (item[valueKey] === undefined) { // 初始化
        return {
          type: 1,
          checked: null
        }
      } else { // 后续操作
        return {
          type: 2,
          checked: item[valueKey]
        }
      }
    },
    loopAfterHandle ({ type, checked, node }) {
      const setFn = (node) => {
        setTimeout(() => {
          this.broadcast('permissionRank', 'setChecked', {
            id: node[this.idKey],
            checked: node[valueKey]
          })
        }, 10)
      }
      const valueKey = this.valueKey
      const id = this.idKey
      if (type === 1) {
        if (node[valueKey]) { // 初始化而且是设置为true
          setFn(node)
        }
      } else if (type === 2) {
        if (node[valueKey] !== checked) { // 后续而且使用者改变了值
          setFn(node)
        }
      }
    },
    expand (param) {
      this.broadcast('permissionRank', 'expand', param)
    }
  },
  computed: {
    isAll () {
      let a = true
      const hasValue = this.valueKey
      this.loop(this.showTreeData, (e) => {
        if (!e[hasValue]) {
          a = false
        }
      })
      return a
    },
    isLazy () {
      return !!this.lazyHeight
    }
  }
}
</script>
