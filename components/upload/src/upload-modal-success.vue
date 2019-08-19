<template>
  <tModal :visible.sync="visible" :hideFooter="false" :hideHeader="false" :cancelable="false">
    <div slot="title">
      <!-- <span class="t-icon-kulian t-upload-file__logo t-upload-file__logo--success"></span> -->
      <span class="t-upload-file__head-title">上传成功</span>
    </div>
    <div class="t-upload-file__success">
      <div class="t-upload-file__success__content">
        <div class="t-upload-file__success__response" v-if="false">{{ resp.message }}</div>
        <div class="t-upload-file__success__filaname">文件：{{ name }}</div>
      </div>
    </div>
    <div slot="footer">
      <t-button @click="confirmHandle">我知道了</t-button>
    </div>
  </tModal>
</template>

<script>
import tModal from '../../modal'
import tBtn from '../../button'
export default {
  components: {
    tModal,
    tBtn
  },
  props: {
    name: String
  },
  data () {
    return {
      visible: false,
      resp: {
        message: ''
      }
    }
  },
  methods: {
    confirmHandle () {
      this.$emit('confirm')
      this.close()
    },
    open (resp) {
      this.visible = true
      this.resp = resp
    },
    close () {
      this.visible = false
    }
  }
}
</script>