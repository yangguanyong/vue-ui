<script>
  // 未完成
  export default {
    props: {
      tag: {
        type: String,
        default: 'div'
      },
      placeholder: String,
      value: null,
      size: {
        type: Number,
        default: 1
      }
    },
    computed: {
      isShow () {
        return this.value === null ||
          this.value === undefined ||
          String(this.value) === ''
      }
    },
    mounted () {
      this.inputEl = this.$el.querySelector('input')
    },
    methods: {
      onClick () {
        if (!this.inputEl || this.inputEl.disabled) return
        this.inputEl.focus()
      }
    },
    render (h) {
      const tag = this.tag
      const isShow = this.isShow
      const holderText = this.placeholder
      const holder = h('div', {
        'class': ['t-form-placeholder__text']
      }, holderText)
      return h(tag, {
        'class': {
          't-form-placeholder': true,
          't-form-placeholder--show': isShow
        },
        'on': {
          click: this.onClick
        }
      }, [this.$slots.default, isShow && holder])
    }
  }
</script>

<style scoped>

</style>
