<template>
  <div class="t-form__item" :class="wrapperClass">
    <span
        v-if="label"
        class="t-form__label"
        :class="{'t-form__label--required': isRequired2, 't-form__label--normal': labelPosition === 'normal'}"
        :style="{width: labelWidth2}">{{ label }}</span>
    <div class="t-form__control" :style="{marginLeft: labelWidth2}" :class="{'t-form__control--error': Boolean(errorTexts), 't-form__control--normal': labelPosition === 'normal'}">
      <slot></slot>
      <div class="t-form__error" v-if="Boolean(errorTexts) && showErrText">{{ errorTexts }}</div>
    </div>
  </div>
</template>

<script>
  import { Validator } from 'vee-validate'
  import KeyPath from 'key-path'

  export default {
    name: 't-form-item',
    props: {
      label: String,
      prop: String,
      rules: String,

      // 如果配置了value，组件将无视 prop, 直接校验value值，不校验 formData[prop]
      value: null,
      validateOn: {
        type: String,
        default: 'blur'
      },
      /*
      * 为 true 时label前会补星号
      * 当 rules 含有 required 时，不配置该属性，也会带上星号
      * */
      isRequired: Boolean,

      /**
       * 用来覆盖form上的定义
       * top normal
       */
      labelPosition: String,
      labelWidth: [Number, String],

      inline: Boolean
    },
    inject: {
      'form': {
        default: null
      }
    },
    provide () {
      return {
        formItem: this
      }
    },
    computed: {
      wrapperClass () {
        return {
          't-form__item--inline': this.inline,
          't-form__item--label-top': this.labelPosition === 'top'
        }
      },
      labelWidth2 () {
        if (this.labelPosition && this.labelPosition === 'top' || this.form && this.form.labelPosition === 'top') {
          return undefined
        }
        if (this.labelWidth) {
          return this.labelWidth
        }
        if (this.form) {
          return this.form.labelWidth
        }
        return '80px'
      },
      errorTexts () {
        if (!this.error) return ''
        return this.error.first(this.validateName) || this.tip
      },
      needValidate () {
        return Boolean(this.rules)
      },
      isRequired2 () {
        return this.isRequired || this.rules && this.rules.split('|').indexOf('required') !== -1
      }
    },
    data () {
      return {
        validateName: 'validate',
        hasBindValidateEvents: false,
        error: null,
        showErrText: false,
        tip: ''
      }
    },
    watch: {
      rules () {
        this.initValidator()
        this.initValidateEvents()
      },
      prop () {
        this.kp = KeyPath.get(this.prop)
      }
    },
    mounted () {
      if (this.form) {
        this.form.registFormItem(this)
      }
      if (this.rules) {
        this.initValidator()
        this.initValidateEvents()
      }
      if (this.prop) {
        this.kp = KeyPath.get(this.prop)
      }
      this.errorTextTimer = null

      this.$on('showTip', tip => {
        this.tip = tip
        if (this.needValidate) {
          this.error.clear()
        }
        this.showErrText = true
        clearTimeout(this.errorTextTimer)
        this.errorTextTimer = setTimeout(() => {
          this.showErrText = false
        }, 2000)
      })
      this.$on('hideTip', () => {
        this.tip = null
        this.showErrText = false
        clearTimeout(this.errorTextTimer)
      })
    },
    beforeDestroy () {
      if (this.form) {
        this.form.unregistFormItem(this)
      }
      this.resetValidate()
      clearTimeout(this.errorTextTimer)
    },
    methods: {
      initValidator () {
        this.validator = new Validator({
          [this.validateName]: this.rules
        })
        this.error = this.validator.errors
      },
      initValidateEvents () {
        if (this.hasBindValidateEvents) return
        this.hasBindValidateEvents = true
        this.$on([
          'input.input',
          'select.input',
          'date.change',
          'radio.change',
          'checkbox.change',
          'radio2.change',
          'ueditor.change',
          'input-number.input',
          'rangepicker.select',
          'selectable-tag.change'
        ], () => {
          if (this.validateOn === 'change') {
            this.validate()
          }
        })

        /* date 的 blur 事件先于 change 事件，故无法检测最新的 val，所以 date 的blur校验时机设置在change事件发出时 */
        this.$on([
          'input.blur',
          'select.input',
          'date.change',
          'radio.change',
          'radio2.change',
          'checkbox.change',
          'ueditor.blur',
          'rangepicker.select',
          'input-number.blur',
          'selectable-tag.change'
        ], () => {
          if (this.validateOn === 'blur') {
            this.validate()
          }
        })
      },
      async validate () {
        if (!this.needValidate) return Promise.resolve(true)
        this.showErrText = true
        const val = await this.getValue()
        return this.validator.validate(this.validateName, val).then(r => {
          if (!r) {
            clearTimeout(this.errorTextTimer)
            this.errorTextTimer = setTimeout(() => {
              this.showErrText = false
            }, 2000)
            return Promise.reject({
              el: this.$el,
              error: true
            })
          }
          return {
            error: false
          }
        })
      },
      getValue () {
        if ('value' in this.$options.propsData) { // 如果有传 value，则不从formData中获取value。用于脱离 formData 校验
          return new Promise(resolve => {
            this.$nextTick(() => {
              resolve(this.$options.propsData.value)
            })
          })
        }
        if (!this.form || !this.kp) return ''
        return this.kp.getValueFrom(this.form.formData || {})
      },
      resetValidate () {
        if (!this.needValidate) return
        this.error.clear()
      }
    }
  }
</script>

<style scoped>

</style>
