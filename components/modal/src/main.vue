<template>
  <div class="t-modal" v-show="visible">
    <div class="t-modal__dialog" :class="{'t-modal__dialog--bg': size === 'bg', 't-modal__dialog--md': size === 'md'}">
      <div v-if="!hideHeader" class="t-modal__header">
        <slot name="title"></slot>
        <span class="t-modal__close-icon" @click="hide" v-if="cancelable">
          &times;
        </span>
      </div>
      <div class="t-modal__body" :class="{'t-modal__body--no-footer': hideFooter}">
        <slot></slot>
      </div>
      <div class="t-modal__footer" v-if="!hideFooter && !$slots.footer" dir="rtl">
        <t-button tag="span" :disabled="disabled"  @click="confirm">确认</t-button>
        <t-button tag="span" @click="hide" v-if="cancelable" :type="2">取消</t-button>
      </div>
      <div class="t-modal__footer" v-if='$slots.footer'>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../../../utils/util'
  import manager from './modal-manager.js'
  import tButton from '../../button'

  export default {
    name: 't-modal',
    components: {
      tButton
    },
    provide () {
      return {
        modal: this
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      cancelable: {
        type: Boolean,
        default: true
      },
      size: {
        type: String,
        default: 'normal'
      },
      hideHeader: {
        type: Boolean,
        default: false
      },
      hideFooter: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      visible (n, o) {
        if (n === true && o === false) {
          this.modalId = manager.add(this.hide, false)
          this.$nextTick(() => {
            this.$el.scrollTop = 0
          })
          this.$emit('open')
        }
        if (n === false && o === true) {
          manager.remove(this.modalId)
          this.$emit('close')
        }
      }
    },
    mounted () {
      // 防止在 scroll-x 组件中无法滚动
      this.$el.addEventListener('wheel', util.stopPropagation)
      this.$el.addEventListener('mousewheel', util.stopPropagation)
    },
    beforeDestroy () {
      this.$el.removeEventListener('wheel', util.stopPropagation)
      this.$el.removeEventListener('mousewheel', util.stopPropagation)
      manager.remove(this.modalId)
    },
    methods: {
      hide () {
        if (this.cancelable) {
          this.$emit('update:visible', false)
          this.$emit('cancel')
        }
      },
      confirm () {
        this.$emit('confirm')
      }
    }
  }
</script>
