<template>
  <span ref="myUploadForm">
    <form action="">
      <label class="t-upload">
        <slot></slot>
        <input type="file" @change="input" :name="name" :accept="accept[type]" v-if="resetInput">
      </label>
    </form>
    <iframe :id="idIframe" :name="idIframe" style="display:none;" v-if="control && postUrl !== ''">
    </iframe>
  </span>
</template>

<script>
// import toast from 'components/common/toast'
const toast = function (info) {
  alert(info.message)
}
import propMixin from './prop-mx'
import util from './util'
var id = 0
export default {
  name: 't-upload',
  mixins: [propMixin],
  components: {
  },
  computed: {
    calcMtoByte () {
      return this.size * 1024 * 1024
    }
  },
  data () {
    id++
    return {
      control: true,
      resetInput: true,
      accept: {
        'img': 'image/*',
        'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
        'pdf': '.pdf'
      },
      idIframe: 'idIframe_' + id,
      file: {
        body: null, // 文件体
        name: '' // 文件名
      }
    }
  },
  methods: {
    validateType (obj) {
      var type = util.getType(obj)
      if (this.type === 'img') {
        if (type !== 'jpg' && type !== 'png' && type !== 'gif' && type !== 'image/png' && type !== 'image/jpeg') {
          this.resetHandle()
          toast({
            message: '必须上传jpg .jpeg .gif .png .bmp格式的图片',
            duration: 2000
          })
          return false
        }
      } else if (this.type === 'excel') {
        if (type !== 'xlsx' && type !== 'xls') {
          this.resetHandle()
          toast({
            message: '必须上传excel文件',
            duration: 2000
          })
          return false
        }
      } else if (this.type === 'pdf') {
        if (type !== 'pdf') {
          this.resetHandle()
          toast({
            message: '必须上传pdf文件',
            duration: 2000
          })
          return false
        }
      }
      return true
    },
    validateFileSize (obj) {
      const size = util.getFileSize(obj)
      if (size && size > this.calcMtoByte) {
        toast({
          message: `上传文件的大小不能超过${this.size}M`
        })
        return false
      }
      return true
    },
    input (e) {
      const obj = e.target
      if (obj.value) {
        const isPassType = this.validateType(obj)
        const isPassFileSize = this.validateFileSize(obj)
        if (isPassType && isPassFileSize) {
          this.file = {
            body: util.getFile(obj),
            name: util.getSrc(obj, this.type).src
          }
          this.$emit('input', this.file)
          if (this.auto) {
            this.submit()
          }
        }
      }
    },
    submit () {
      this.$emit('beforeUpload', [this.file])
      this.progress.total = 0.00
      this.progress.current = 0.00
      setTimeout(() => {
        if (util.isIE9()) {
          this.submitHtml4()
        } else {
          this.submitHtml5()
        }
      }, 100)
    },
    submitHtml5 () {
      const form = new window.FormData()
      form.append(this.name, this.file.body)
      const xhr = new XMLHttpRequest()
      const uploaded = () => {
        try {
          var resp = JSON.parse(xhr.responseText)
        } catch (err) {
          var resp = { code: 'error', message: '' }
        }
        if (resp.code && resp.code === 'error') {
          this.$emit('fail', resp)
        } else {
          if (resp.code === 0) {
            this.$emit('success', resp)
          } else {
            this.$emit('fail', resp)
          }
        }
        this.resetHandle()
      }
      xhr.onload = (e) => {
        uploaded()
      }
      xhr.onerror = (e) => {
        uploaded()
      }
      xhr.upload.onprogress = (e) => {
        this.progress.total = e.total
        this.progress.current = e.loaded
      }
      xhr.open('POST', this.postUrl)
      xhr.send(form)
    },
    submitHtml4 () {
      var myForm = this.$refs.myUploadForm.querySelector('form')
      setTimeout(() => {
        myForm.action = this.postUrl
        myForm.method = 'post'
        myForm.enctype = 'multipart/form-data'
        myForm.target = this.idIframe
        myForm.submit()
        var iframe = document.getElementById(this.idIframe)
        util.getFrameResponseIframeOnload(iframe, (status, resp) => {
          if (status === 'load') {
            if (resp.code !== 0) {
              this.$emit('fail', resp)
            } else {
              this.$emit('success', resp)
            }
          }
          if (status === 'error') {
            this.$emit('fail', {
              code: 'error',
              message: ''
            })
          }
          this.resetHandle()
          this.progress.total = 100.00
          this.progress.current = 100.00
        })
      }, 0)
    },
    resetHandle () {
      /**
       * 是否清空，点击上传的话如果第一次上传失败，用户还可能会再次点击上传，这时候需要input框保存file的值，可以不清空
       * 这里与input的change也有关系
       */
      if (this.reset) {
        this.resetInputFn()
        this.resetFile()
      }
      this.resetIframe()
    },
    resetInputFn () {
      this.resetInput = false
      setTimeout(() => {
        this.resetInput = true
      }, 500)
    },
    resetIframe () {
      this.control = false
      setTimeout(() => {
        this.control = true
      }, 500)
    },
    resetFile () {
      this.file = {
        body: null,
        name: ''
      }
    }
  }
}
</script>
