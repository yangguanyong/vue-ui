<template>
    <transition name="slide-from-right">
      <div class="t-modal2" :class="modalClass" v-show="visible" :style="styleZIndex">
        <div class="t-modal2__layer" @click="cancel"></div>
        <div class="t-modal2__dialog" :class="sizeClass" :style="styleWidth">
          <div class="t-modal2__header">
            <slot name="title"></slot>
            <span class="t-modal2__close-icon" @click="cancel" v-if="cancelable">
              &times;
            </span>
          </div>
          <div v-bar ref="scroll" class="t-modal2__body" :class="{'t-modal2__body--no-footer': hideFooter, 't-modal2__body--fix-y': fixScrollY}">
            <div class="t-modal2__body-inner">
              <slot></slot>
            </div>
          </div>
          <div class="t-modal2__footer" v-if="!hideFooter">
            <slot name="footer">
              <t-button tag="span" @click="cancel" v-if="cancelable" :type="2">取消</t-button>
              <t-button tag="span" :disabled="disabled"  @click="confirm">确认</t-button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
</template>

<script>
  import Vue from 'vue'
  import EasyBar from 'easy-bar'
  import manager from '../modal/src/modal-manager'
  import tButton from '../button'
  Vue.use(EasyBar)

  export default {
    name: 't-modal2',
    provide () {
      return {
        modal2: this
      }
    },
    components: {
      tButton
    },
    props: {
      visible: Boolean,
      disabled: Boolean,
      size: {
        type: String,
        default: 'normal'
      },
      hideFooter: {
        type: Boolean,
        default: false
      },
      cancelable: {
        type: Boolean,
        default: true
      },
      fixScrollY: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        num: 0
      }
    },
    watch: {
      visible (n, o) {
        if (n === true && o === false) {
          this.num = manager.modals.length
          this.maskId = manager.add(this.cancel, true, true)
          this.$nextTick(() => {
            // this.$refs.scroll._easyBar.scrollCevBox.scrollTop = 0
          })
          this.$emit('open')
        }
        if (n === false && o === true) {
          manager.remove(this.maskId)
          this.$emit('close')
        }
      }
    },
    computed: {
      sizeClass () {
        return 't-modal2__dialog--' + this.size + this.num
      },
      modalClass () {
        return 't-modal2__' + this.num
      },
      styleWidth () {
        let width
        if (this.size === 'normal') {
          width = 600 - this.num * 10
        } else if (this.size === 'bg') {
          width = 800 - this.num * 10
        } else if (this.size === 'xl') {
          width = 1300 - this.num * 10
        } else {
          width = 1000 - this.num * 10
        }
        return { 'width': width + 'px' }
      },
      styleZIndex () {
        const zIndex = 1050
        let culIndex = 1050 + this.num * 2
        return { 'z-index': culIndex }
      }
    },
    beforeDestroy () {
      manager.remove(this.maskId)
    },
    methods: {
      cancel () {
        if (this.cancelable) {
          this.$emit('cancel')
          this.$emit('update:visible', false)
        }
      },
      confirm () {
        this.$emit('confirm')
      }
    }
  }
</script>
