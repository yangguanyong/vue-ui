<template>
  <div class="t-layout__body"
    :class="{
      't-layout__body--white': bg === 'white'
    }">
    <slot></slot>
  </div>
</template>

<script>
import queryMx from './query-mx'
export default {
  mixins: [queryMx],
  name: 't-layout-body',
  props: {
    bg: {
      type: String,
      default: ''
    }
  },
  data () {
    const localState = !!Number(localStorage.getItem('talebase-ui-layout-aside-state')) // 如果有缓存读缓存
    return {
      asideIf: false, // 是否加载侧边
      asideShow: localState // 是否显示侧边
    }
  },
  provide () {
    return {
      tLayoutBody: this
    }
  }
}
</script>
