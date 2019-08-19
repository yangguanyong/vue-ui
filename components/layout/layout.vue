<template>
  <div class="t-layout" ref="wrap" :style="{minHeight: minHeight}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 't-layout',
  props: {
    minHeight: {
      type: String,
      default: "calc(100% - 0px)" // 0px 为底部版权标注高度
    }
  }
}
</script>
