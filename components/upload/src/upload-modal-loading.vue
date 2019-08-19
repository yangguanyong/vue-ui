<template>
  <tModal :visible.sync="visible" :hideFooter="true" :hideHeader="false" :cancelable="false">
    <div slot="title">文件上传中...</div>
    <div class="t-upload-file__loading">
      <div class="t-upload-file__loading__title">文件：{{ name }}</div>
      <porcess :total="total" :current="current" :showText="true" :width="14" :inner="true"></porcess>
    </div>
  </tModal>
</template>

<script>
import tModal from '../../modal'
import porcess from '../../progress'
export default {
  components: {
    tModal,
    porcess
  },
  props: {
    total: Number,
    current: Number,
    name: String
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>