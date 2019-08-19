<template>
  <form @submit.prevent="validate">
    <div class="t-form" :class="{'t-form--label-top': labelPosition === 'top', 't-form--inline': inline, 't-form--sm': size === 'sm'}">
      <slot></slot>
    </div>
  </form>
</template>

<script>
  import scrollIntoView from 'scroll-into-view'
  export default {
    name: 't-form',
    props: {
      labelPosition: String,
      labelWidth: {
        type: String,
        default: '80px'
      },
      formData: Object,

      // 控制 formItem 是否是行内元素
      inline: Boolean,

      // 控制表单元素大小
      // size: sm
      size: String
    },
    provide () {
      return {
        form: this
      }
    },
    data () {
      return {
        formItems: []
      }
    },
    methods: {
      registFormItem (item) {
        if (this.formItems.indexOf(item) === -1) {
          this.formItems.push(item)
        }
      },
      unregistFormItem (item) {
        const idx = this.formItems.indexOf(item)
        if (idx !== -1) {
          this.formItems.splice(idx, 1)
        }
      },
      validate () {
        return Promise.all(this.formItems.map(item => item.validate())).then(() => {
          const els = this.$el.querySelectorAll('input, textarea') || []
          Array.from(els).forEach(el => {
            // #13286
            el.blur()
          })
          this.$emit('submit')
          return true
        }).catch(errData => {
          const el = errData.el
          if (el) {
            scrollIntoView(el, () => {
              const inputEl = el.querySelector('input, textarea')
              if (inputEl) {
                inputEl.focus()
              }
            })
          }
          return Promise.reject(false)
        })
      },
      resetValidate () {
        this.formItems.forEach(item => {
          item.resetValidate()
        })
      }
    }
  }
</script>
