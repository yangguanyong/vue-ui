<template>
  <div class="t-upload-img">
    <div class="t-upload-img__img">
      <img v-if="imgUrl" :src="imgUrl" alt="">
      <img v-else src="../img/default-good-logo.png" alt="">
      <imgLoading v-show="isShowCircleProgress"></imgLoading>
    </div>
    <div class="t-upload-img__opare">
      <div v-if="disabled">
        <tBtn disabled>上传文件</tBtn>
      </div>
      <Upload
      v-else
      :progress="uploadGrogress"
      :postUrl="postUrl"
      :name="name"
      :type="type"
      :auto="auto"
      :size="size"
      @input="input"
      @beforeUpload="beforeUpload"
      @success="success"
      @fail="fail">
        <tBtn tag="span">上传文件</tBtn>
      </Upload>
      <div>建议上传清晰的图片，建议像素：150*55仅支持.jpg.jpeg.gif.png.bmp格式</div>
    </div>
  </div>
</template>

<script>
import Upload from './upload'
import tBtn from '../../button'
import propMixin from './prop-mx'
import imgLoading from './upload-img-loading'
export default {
  mixins: [propMixin],
  name: 't-upload-img',
  components: {
    Upload,
    tBtn,
    imgLoading
  },
  data () {
    return {
      uploadGrogress: {
        total: 0,
        current: 0
      },
      isShowCircleProgress: false
    }
  },
  methods: {
    input (files) {
      this.isShowCircleProgress = true
      this.$emit('input', files)
    },
    beforeUpload (files) {
      this.$emit('beforeUpload', files)
    },
    success (resp) {
      this.hideCircleProgress()
      this.$emit('success', resp)
    },
    fail (resp) {
      this.hideCircleProgress()
      this.$emit('fail', resp)
    },
    hideCircleProgress () {
      setTimeout(() => {
        this.isShowCircleProgress = false
      }, 500)
    }
  }
}
</script>
