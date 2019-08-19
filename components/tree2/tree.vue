<template>
<div class="t-tree2" :class="{'t-tree2--has-opera': isShowOpareList}">
  <div class="t-tree2-opera" v-if="isShowOpareList">
    <tCheckedBox :checked="isAll" @change="changeAll" v-if="all">
    全选
    </tCheckedBox>
    <span @click="foldAll" v-if="expandAll"></span>
    <span @click="openAll" v-if="expandAll"></span>
  </div>
  <div
    ref="main"
    class="node-wrap"
    @scroll="scroll">
    <place :nodeCount="topNodeCount" :listHeight="lineHeight" position="top"></place>
    <node
      v-for="(item, index) in showData"
      :key="index"
      :node="item"
      v-if="index >= min && index < max">
    </node>
    <place :nodeCount="bottomNodeCount" :listHeight="lineHeight" position="bottom"></place>
  </div>
</div>
</template>

<script>
import util from './src/util'
import checkMx from './mx/check-mx.js'
import scrollMx from './mx/scroll-mx.js'
import searchMx from './mx/search-mx.js'
import initPickMx from './mx/init-pick-mx.js'
import foldMx from './mx/fold-mx.js'
import node from './src/node'
import place from './src/place'
import tCheckedBox from './../checkbox'
import renderMx from './src/tree-render.js'
export default {
  mixins: [util, checkMx, scrollMx, searchMx, initPickMx, foldMx, renderMx],
  name: 't-tree2',
  components: {
    node,
    place,
    tCheckedBox
  },
  props: {
    data: Array,
    childKey: {
      type: String,
      default: 'child'
    },
    idKey: {
      type: String,
      default: 'id'
    },
    checkModel: { // 0: 关联多选, 1: 不关联多选, 2: 单选
      type: Number,
      default: 0
    },
    all: {
      type: Boolean,
      default: true
    },
    expandAll: {
      type: Boolean,
      default: false
    },
    expand: {
      type: Boolean,
      default: true
    },
    checkable: {
      type: Boolean,
      default: true
    },
    hover: {
      type: Boolean,
      default: true
    }
  },
  provide () {
    return {
      root: this
    }
  },
  data () {
    const topPage = 40 // 上部分加载完但是隐藏的条数
    const activePage = 40 // 中部分，建议为当前窗口能显示的条数
    const bottomPage = 40 // 下部分加载完但是隐藏的条数
    const range = topPage + activePage + bottomPage // 当前加载的条数是上中下加起来
    const lineHeight = 30
    const topHeight = topPage * lineHeight
    return {
      topPage,
      activePage,
      bottomPage,
      range,
      lineHeight,
      topHeight,
      allListData: [], // 全部节点数据
      activeListData: [],
      showData: [], // 显示数据
      foldDataList: [],
      map: {}, // 数据对象表
      min: 0, // 开始一定是0
      max: range,
      topNodeCount: 0, // 顶部place的node数量
      bottomNodeCount: 0, // 底部place的node数量
      innerCheckIds: [],
      foldCount: 0, // 折叠个数
      foldAllStatus: false // 是否收起全部
    }
  },
  watch: {
    data (n, o) {
      if (this.data.length !== 0) {
        this.init()
      }
    }
  },
  mounted () {
    if (this.data.length !== 0) {
      this.init()
    }
  },
  computed: {
    main () {
      return this.$refs.main
    },
    checkedRela () { return this.checkModel === 0 },
    checkedCheckbox () { return this.checkModel === 1 },
    checkedRedio () { return this.checkModel === 2 },
    isShowOpareList () {
      return this.all || this.expandAll
    }
  },
  methods: {
    init () {
      const { map, list } = this.treeToList(this.data)
      this.map = map
      this.allListData = list
      this.activeListData = this.allListData
      this.pickShowData()
    }
  }
}
</script>
<!--
<style scoped lang="scss">
.t-tree2{
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 0px 10px 10px;
}
.t-tree2--has-opera{
  padding-top: 30px;
}
.t-tree2-opera{
  height: 30px;
  width: 100%;
  top: 0px;
  left: 0px;
  position: absolute;
  box-sizing: border-box;
  padding-left: 10px;
  padding-top: 6px;
  /deep/ .t-checkbox__checkbox-wrapper{
    height: 24px;
    line-height: 24px;
  }
}
.node-wrap{
  height: 100%;
  overflow: auto;
}
</style>
-->