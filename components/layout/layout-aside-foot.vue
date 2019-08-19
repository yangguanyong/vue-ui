<template>
  <div class="t-layout__aside-foot">
    <template v-if="isHasSlot">
      <slot></slot>
    </template>
    <div v-else>
      <tBtn :size="2" :type="2" @click="clear">清空</tBtn>
      <tBtn :size="2" @click="search">搜索</tBtn>
    </div>
  </div>
</template>

<script>
import tBtn from './../button/index'
export default {
  name: 't-layout-aside-foot',
  components: {
    tBtn
  },
  inject: {
    tLayoutBody: {
      default: null
    }
  },
  computed: {
    isHasSlot () {
      return this.$slots.default
    }
  },
  methods: {
    clear () {
      this.$emit('clear')
      if (this.tLayoutBody) {
        this.tLayoutBody.$emit('clearByTLayOutFoot')
      }
    },
    search () {
      this.$emit('search')
      if (this.tLayoutBody) {
        this.tLayoutBody.$emit('searchByTLayOutFoot')
      }
    }
  }
}
</script>
