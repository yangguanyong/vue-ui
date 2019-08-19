/**
 * Created by jun.liu on 2017/6/19.
 */
import Popper from 'popper.js'

const util = {
  getOffset (offset) {
    if (offset instanceof Array && offset.length > 0) {
      if (offset.length === 1) {
        return {
          top: offset[0],
          left: offset[0]
        }
      } else {
        return {
          top: offset[1],
          left: offset[0]
        }
      }
    } else {
      return {
        left: 0,
        top: 0
      }
    }
  }
}

export default {
  props: {
    isAppendToBody: {
      type: Boolean,
      default: true
    },
    boundariesElement: {
      type: typeof HTMLElement === 'undefined' ? String : [String, HTMLElement],
      default: 'scrollParent'
    },
    preventOverflow: {
      type: Boolean,
      default: true
    },
    flip: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    offsets: {
      type: Array,
      default () {
        return [0]
      }
    },
    zIndex: {
      type: Number,
      default: 100
    },
    autoWidth: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    isShow (n, o) {
      n && this.update()
      if (n === true && o === false) {
        this.$emit('show')
      }
      if (n === false && o === true) {
        this.$emit('hide')
      }
    }
  },
  beforeDestroy () {
    const popper = this.$refs.popper.$el || this.$refs.popper

    this.popperIns && this.popperIns.destroy()
    this.popperIns = null

    if (this.isAppendToBody && popper.parentNode === document.body) {
      document.body.removeChild(popper)
    }
  },
  methods: {
    update () {
      this.popperIns ? this.popperIns.update() : this.create()
    },
    create () {
      const popper = this.$refs.popper.$el || this.$refs.popper
      const holder = this.$refs.holder.$el || this.$refs.holder

      if (this.isAppendToBody) {
        document.body.appendChild(popper)
      }

      this.popperIns = new Popper(holder, popper, {
        placement: this.placement,
        modifiers: {
          computeStyle: {
            gpuAcceleration: false
          },
          flip: {
            enabled: this.flip
          },
          preventOverflow: {
            enabled: this.preventOverflow,
            padding: 0,
            boundariesElement: this.boundariesElement
          },
          offset: {
            fn: data => {
              const offset = util.getOffset(this.offsets)
              const oPm = data.originalPlacement
              const pm = data.placement
              if (oPm === pm) {
                data.offsets.popper.top += offset.top
                data.offsets.popper.left += offset.left
              } else {
                data.offsets.popper.top -= offset.top
                data.offsets.popper.left -= offset.left
              }

              return data
            }
          },
          preset: {
            order: 800,
            enabled: true,
            fn: data => {
              data.styles.zIndex = this.zIndex
              if (this.autoWidth && holder && holder.getBoundingClientRect) {
                const rect = holder.getBoundingClientRect()
                data.styles.width = rect.width
              }
              data.styles.left = data.offsets.popper.left
              data.styles.top = data.offsets.popper.top
              return data
            }
          },
          hide: { enabled: false }
        },
        onCreate: () => {
          this.$nextTick(this.update)
        }
      })
    }
  }
}
