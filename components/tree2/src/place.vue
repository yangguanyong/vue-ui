<!--
<template>
  <div
    class="tree-place"
    :style="{
      height: nodeCount * listHeight + 'px'
    }">
      <div class="tree-place-word" :class="`tree-place-word-${position}`">
        加载中...
      </div>
    </div>
</template>
-->

<script>
import placeMx from './place-render.js'
export default {
  mixins: [placeMx],
  props: {
    nodeCount: {
      type: Number,
      default: 0
    },
    listHeight: {
      type: Number,
      required: true
    },
    position: {
      type: String,
      default: 'bottom'
    }
  },
  watch: {
    nodeCount (n, o) {
    }
  }
}
</script>
<!--
<style scoped lang="scss">
.tree-place{
  position: relative;
  width: 100%;
  overflow: hidden;
  &-word{
    position: absolute;
    margin-left: 50%;
    left: -25px;
    &-top{
      bottom: 20px;
    }
    &-bottom{
      top: 20px;
    }
  }
}
</style>
-->