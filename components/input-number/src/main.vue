<template>
  <div class="t-input" :class="wrapClass">
    <input
      type="number"
      ref="input"
      :value="value"
      :maxLength='maxLength'
      :placeholder='placeholder'
      :disabled="disabled"
      @input="inputFn"
      @keyup="onKeyUp"
      @focus="onFocus"
      @blur="onBlur"
      @paste="pasteHandler"
      @mousewheel="onMouseWheel"
      class="tbc-input-number"
      >
    <div class="t-input__placeholder" @click="$refs.input.focus()" v-if="showPlaceholder">
      {{ placeholder }}
    </div>
  </div>
</template>

<script>
  import iePatcher from '../../../utils/ie-patcher'

  export default {
    name: 't-input-number',
    mixins: [iePatcher],
    inject: {
      'formItem': {
        default: null
      }
    },
    props: {
      value: {
        type: [Number, String]
      },
      float: {
        type: Boolean,
        default: true
      },
      maxLength: [String, Number],
      placeholder: String,
      disabled: Boolean,
      size: Number,
      inline: Boolean,

      /**
       * 输入非数字时的提示，必须搭配 form-item 使用
       * form-item
       *  input-number
       */
      tip: String
    },
    data () {
      return {
        isIe9: typeof window !== "undefined" && window.navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0,
        isFocus: false
      }
    },
    computed: {
      getNumberReg () {
        return this.float ? /\d+(\.(\d+)?)?/ : /\d+/
      },
      pasteTestReg () {
        return this.float ? /^\d+(\.(\d+)?)?$/ : /^\d+$/
      },
      notNumberReg () {
        return this.float ? /[^(0-9).]/ : /[^(0-9)]/
      },
      wrapClass () {
        return {
          't-input--inline': this.inline,
          't-input--sm': this.size === 2,
          't-input--disabled': this.disabled,
          't-input--focus': this.isFocus
        }
      },
      showPlaceholder () {
        return this.isIe9 && (this.value === null || this.value === undefined || String(this.value).length === 0)
      }
    },
    methods: {
      inputFn (e) {
        const value = e.target.value
        if (this.notNumberReg.test(value)) {
          this.showNotNumberTip()
          this.$refs.input.value = this.getNumberValue(this.value)
        } else {
          this.updateValue(e.target.value)
        }
      },
      pasteHandler (e) {
        const clipboardData = e.clipboardData || window.clipboardData
        const test = this.pasteTestReg.test(clipboardData.getData('text'))
        if (!test) {
          e.preventDefault()
          this.showNotNumberTip()
        }
      },
      updateValue (val) {
        const value = this.getNumberValue(val)
        this.$refs.input.value = value
        const updateVal = value ? Number(value) : null
        this.$emit('input', updateVal)
        if (this.formItem) {
          this.formItem.$emit('hideTip')
          this.formItem.$emit('input-number.input')
        }
      },
      showNotNumberTip () {
        if (this.formItem && this.tip) {
          // #12427 估计是灿英提的最后一个bug。。。
          this.formItem.$emit('showTip', this.tip)
        }
      },
      getNumberValue (val) {
        const match = String(val).match(this.getNumberReg)
        const value = match ? match[0] : ''
        return value
      },
      onKeyUp (e) {
        this.$emit('keyup', e)
      },
      onFocus (e) {
        this.$emit('focus', e)
        this.isFocus = true
      },
      onBlur (e) {
        this.$refs.input.value = this.getNumberValue(this.value)
        this.$emit('blur', e)
        if (this.formItem) {
          this.formItem.$emit('input-number.blur')
        }
        this.isFocus = false
      },
      onMouseWheel (e) {
        e.preventDefault()
      }
    }
  }
</script>
