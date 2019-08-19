<template>
  <div class="t-upload-file">
    <div v-if="disabled">
      <tBtn disabled>上传文件</tBtn>
    </div>
    <Upload
    ref="Upload"
    v-else
    :progress="uploadGrogress"
    :postUrl="postUrlAddFileName"
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
    <span class="t-upload-file__desc" v-if="isNeedFile">支持小于10M的Windows上常见的文件格式.pdf.pdfx</span>

    <file-block :list="list" v-if="isNeedFile"></file-block>
    
    <loading-modal ref="loadingModal" :name="file.name" :total="uploadGrogress.total" :current="uploadGrogress.current">
    </loading-modal>
    
    <success-modal ref="successModal" :name="file.name" @confirm="successConfirm">
    </success-modal>
    
    <fail-modal ref="failModal" :name="file.name" @confirm="failConfirm">
    </fail-modal>
  </div>
</template>

<script>
import propMixin from './prop-mx'
import Upload from './upload'
import porcess from '../../progress'
import tBtn from '../../button'
import loadingModal from './upload-modal-loading'
import failModal from './upload-modal-fail'
import successModal from './upload-modal-success'
import fileBlock from './upload-file-block'
export default {
  name: 't-upload-file',
  mixins: [propMixin],
  components: {
    Upload,
    porcess,
    tBtn,
    loadingModal,
    failModal,
    successModal,
    fileBlock
  },
  data () {
    return {
      uploadGrogress: {
        total: 0,
        current: 0
      },
      file: {
        name: ''
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    input (file) {
      this.file = file
      this.$emit('input', file)
    },
    beforeUpload (files) {
      this.$refs.loadingModal.open()
      this.$emit('beforeUpload', files)
    },
    submit () { // 外部调用
      this.$refs.Upload.submit()
    },
    success (resp) {
      this.sleep(() => {
        this.$refs.loadingModal.close()
        if (this.showSuccessModal) {
          this.$refs.successModal.open(resp)
        }
        this.$emit('success', resp)
        if (this.isNeedFile) { // 只有成功才更新文件列表
          this.list.push({
            name: this.file.name
          })
        }
      })
    },
    fail (resp) {
      this.sleep(() => {
        this.$refs.loadingModal.close()
        if (this.showFailModal) {
          this.$refs.failModal.open(resp)
        }
        this.$emit('fail', resp)
      })
    },
    successConfirm () {
      this.$emit('successConfirm')
    },
    failConfirm () {
      this.$emit('failConfirm')
    },
    sleep (cb) {
      setTimeout(() => {
        cb()
      }, 500)
    }
  },
  computed: {
    isNeedFile () {
      return this.list
    },
    postUrlAddFileName () {
      return encodeURI(`${this.postUrl}&fileName=${this.file.name}`) // 额外添加文件名在路径后面,后端需要；不用encodeURIComponent，会对路径也进行编码
    }
  }
}
</script>
