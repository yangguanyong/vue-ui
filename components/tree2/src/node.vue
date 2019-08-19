<template>
  <div
    class="tree2-node"
    :class="`tree2-node-level-${node.level}`"
    :style="{
      paddingLeft: node.level * 10 + 'px',
      height: root.lineHeight + 'px'}">
    
    <template v-if="root.expand">
      <span
      :class="{'tree-arrow-down':!node.foldChildsStatus,'tree-arrow-right':node.foldChildsStatus}"
      class="toggle-btn" @click="foldChildHandle" v-if="node.foldChildsStatus !== 'none'">
      </span>
      <span v-else class="toggle-btn"></span>
    </template>

    <span class="node-content" :class="{'node-content-has-arrow': root.expand, 'node-content-has-hover': root.hover}">
      <template v-if="root.checkable && node.checkable">
      <tCheckedBox
        v-if="!node.disabled"
        v-model="node.checked"
        @change="checkHandle"
        :isSemi="node.half">
        <nodeSlot :tpl="root.$scopedSlots.default" :data="node.data" :node="node"></nodeSlot>
      </tCheckedBox>
      <template v-else>
        <tCheckedBox v-model="node.checked" :isSemi="node.half" :disabled="true">
        </tCheckedBox>
        <span>
          <nodeSlot :tpl="root.$scopedSlots.default" :data="node.data" :node="node"></nodeSlot>
        </span>
      </template>
      </template>
      <span v-else>
        <nodeSlot :tpl="root.$scopedSlots.default" :data="node.data" :node="node"></nodeSlot>
      </span>
    </span>
    
  </div>
</template>

<script>
import tCheckedBox from '../../checkbox'
import nodeSlot from './slot'
import readerMx from './node-render.js'
export default {
  mixins: [readerMx],
  components: {
    tCheckedBox,
    nodeSlot
  },
  props: {
    node: Object
  },
  inject: {
    root: {
      default: null
    }
  },
  methods: {
    checkHandle () {
      this.root.nodeChecked(this.node.id, this.node.checked)
    },
    foldChildHandle () {
      this.root.foldChildHandle(this.node)
    }
  }
}
</script>
<!--
<style scoped lang="scss">
.tree2-node{
  transition: height 0.25s;
  overflow: hidden;
  .node-content{
    height: 30px;
    line-height: 24px;
    padding: 3px 6px;
    display: inline-block;
    width: calc(100% - 1px);
    box-sizing: border-box;
    &-has-arrow{
      width: calc(100% - 20px);
    }
    &-has-hover{
      &:hover{
        background: #f0f0f0;
      }
    }
  }
  /deep/ .t-checkbox__checkbox-wrapper{
    height: 24px;
    line-height: 24px;
  }
}
.toggle-btn{
  display: inline-block;
  width: 12px;
  height: 12px;
  cursor: pointer;
  position: relative;
}
.tree-arrow-down{
  &:after{
    content: '';
    width: 0px;
    height: 0px;
    display: inline-block;
    border: 5px solid transparent;
    border-top: 5px solid gray;
    position: absolute;
    top: 3px;
    left: 0px;
  }
}
.tree-arrow-right{
  &:after{
    content: '';
    width: 0px;
    height: 0px;
    display: inline-block;
    border: 5px solid transparent;
    border-left: 5px solid gray;
    position: absolute;
    left: 3px;
    top: 0px;
  }
}
</style>
-->