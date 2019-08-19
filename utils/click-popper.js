import popper from './popper'

/**
 * data.isHold
 * data.isShow
 */
export default {
  mixins: [popper],
  watch: {
    isShow (n) {
      if (n) {
        this.bindEvents()
      } else {
        this.unBindEvents()
      }
    }
  },
  beforeDestroy () {
    this.unBindEvents()
  },
  methods: {
    bindEvents () {
      document.addEventListener('click', this.onClick)
    },
    unBindEvents () {
      document.removeEventListener('click', this.onClick)
    },
    onClick (e) {
      const holder = this.$refs.holder.$el || this.$refs.holder
      const popper = this.$refs.popper.$el || this.$refs.popper
      const tar = e.target
      const inHolder = !holder || holder && holder.contains(tar)
      const inPopper = !popper || popper && popper.contains(tar)
      if (this.isShow && !this.disabled && (!this.isHold || this.isHold && !inPopper) && !inHolder) {
        this.isShow = false
        this.$emit('close')
      }
    }
  }
}
