<script>
  export default {
    name: 't-button',
    props: {
      // 渲染的标签
      tag: {
        type: String,
        default: 'button'
      },
      disabled: Boolean,

      size: {
        type: [Number, String],
        default: 1
      },

      round: Boolean,
      block: Boolean,

      /**
       * 按照设计稿，有三种类型
       * 1. 色块按钮
       * 2. 线框按钮1
       * 3. 线框按钮2
       */
      type: {
        type: [Number, String],
        default: 1
      },
      color: {
        type: [Number, String],
        default: 1
      }
    },
    computed: {
      typeClass () {
        return {
          [`t-btn--type-${this.type}`]: true
        }
      },
      sizeClass () {
        return {
          [`t-btn--size-${this.size}`]: true
        }
      },
      roundClass () {
        return {
          't-btn--round': this.round
        }
      },
      blockClass () {
        return {
          't-btn--block': this.block
        }
      },
      colorClass () {
        return {
          [`t-btn--col-${this.color}`]: true
        }
      }
    },
    methods: {
      onClick (e) {
        if (this.disabled) {
          return
        }
        this.$emit('click', e)
      }
    },
    render (h) {
      const props = this.tag === 'router-link' ? ['to', 'replace'].reduce((prop, key) => {
        prop[key] = this.$attrs[key]
        return prop
      }, {}) : {}
      return h(this.tag, {
        'class': {
          't-btn': true,
          ...this.typeClass,
          't-btn--disabled': this.disabled,
          ...this.sizeClass,
          ...this.roundClass,
          ...this.blockClass,
          ...this.colorClass
        },
        'on': {
          ...Object.assign({}, this.$listeners, {
            click: this.onClick
          })
        },
        'domProps': {
          disabled: this.disabled
        },
        'props': {
          ...props
        }
      }, this.$slots.default)
    }
  }
</script>
