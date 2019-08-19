/*
 * @Author: guanyong.yang 
 * @Date: 2018-10-22 14:42:27 
 * @Last Modified by: guanyong.yang
 * @Last Modified time: 2019-04-19 15:35:06
 */
export default {
  props: {
    postUrl: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: false,
      default: 'file'
    },
    type: {
      type: String,
      required: false,
      default: ''
    },
    auto: {
      type: Boolean,
      default: true,
      required: false
    },
    reset: { // 上传一次后是否清空
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: 10 // M
    },
    list: { // key: name
      type: Array
    },
    showSuccessModal: { // 是否显示成功modal
      type: Boolean,
      default: true
    },
    showFailModal: { // 是否显示失败modal
      type: Boolean,
      default: true
    },
    progress: {
      type: Object,
      default () {
        return {
          total: 0.00,
          current: 0.00
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    imgUrl: {
      type: String
    }
  }
}