<template>
  <span class="t-selectable-tag" :class="wrapClass" @click="toggle">
    <slot></slot>
  </span>
</template>

<script>
  export default {
    inject: {
      'formItem': {
        default: null
      }
    },
    name: 't-selectable-tag',
    props: {
      value: {
        type: null,
        default: true
      },
      checked: {
        type: null,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      size: {
        type: Number,
        default: 1
      },
      type: {   // 标签风格，1为镂空，2为色块
        type: Number,
        default: 1
      },
      banFormEvent: {    // 触发form-item校验
        type: Boolean,
        default: false
      },
      autoWidth: {
        type: Boolean,
        default: true
      }
    },
    model: {
      prop: 'checked',
      event: 'change'
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    computed: {
      active () {
        if (this.checked instanceof Array) {
          return this.checked.indexOf(this.value) !== -1
        } else {
          return this.checked === this.value
        }
      },
      wrapClass () {
        return {
          [`t-selectable-tag--sm`]: this.size === 2,    // 小尺寸
          [`t-selectable-tag--type-${this.type}--active`]: this.active,    // 样式1被选中
          [`t-selectable-tag--type-${this.type}--active--disabled`]:  this.active && this.disabled,    // 样式1禁用被选中
          [`t-selectable-tag--type-${this.type}--disabled`]: this.disabled,    // 样式1禁用
          [`t-selectable-tag--auto`]: this.autoWidth,
          [`t-selectable-tag--type-${this.type}`]: true
        }
      }
    },
    methods: {
      toggle () {
        if (this.disabled) { return false }
        if (this.checked instanceof Array) {
          if (this.checked.indexOf(this.value) !== -1) {
            this.$emit('change', this.checked.filter(val => val !== this.value))
          } else {
            this.$emit('change', this.checked.concat(this.value))
          }
        } else {
          const value = this.value === this.checked ? null : this.value
          this.$emit('change', value)
        }
        if (this.formItem && !this.banFormEvent) {
          this.formItem.$emit('selectable-tag.change')
        }
      }
    }
  }
</script>
