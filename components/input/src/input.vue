<template>
  <div class="t-input" :class="wrapClass">
    <label>
      <span v-if="showPrefixIcon" :class="prefixIcon" class="t-input__icon">
        <slot name="prefixIcon"></slot>
      </span>
      <input
        ref="input"
        :disabled="disabled"
        :name="name"
        :value="value"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :type="type"
        :readonly="readonly"
        :style="inputStyle"
        v-on="$listeners"
        @input="inputHandler"
        @focus="focusHandler"
        @blur="blurHandler"
      >
      <span v-if="showSuffixIcon" :class="suffixIcon" class="t-input__icon t-input__icon-suf">
        <slot name="suffixIcon"></slot>
      </span>
      <div class="t-input__placeholder" :style="inputStyle" @click="$refs.input.focus()" v-if="showPlaceholder">
        {{ placeholder }}
      </div>
    </label>
    <btn tag="span" :size="size" v-if="search" @click="searchHandler" class="t-input__search">
      <span class="t-icon-search"></span>
    </btn>
  </div>
</template>

<script>
  import iePatcher from '../../../utils/ie-patcher'
  import btn from '../../button'

  export default {
    name: 't-input',
    mixins: [iePatcher],
    inject: {
      'formItem': {
        default: null
      }
    },
    components: {
      btn
    },
    props: {
      value: [String, Number, Object],
      name: String,
      disabled: Boolean,
      placeholder: String,
      maxlength: Number,
      type: String,
      readonly: Boolean,

      // 是否显示搜索按钮，为true时显示，点击时会发起 search 事件
      search: Boolean,

      // 是否行内元素
      inline: Boolean,

      /*
      * 尺寸，目前有两种
      * 1是大尺寸, 2是小尺寸
      * */
      size: {
        type: Number,
        default: 1
      },

      // 图标的类名
      prefixIcon: String,
      suffixIcon: String,

      banFormEvent: Boolean
    },
    data () {
      return {
        isIe9: typeof window !== "undefined" && window.navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0,
        isFocus: false
      }
    },
    model: {
      prop: 'value',
      event: 'modelEvent'
    },
    computed: {
      wrapClass () {
        return {
          't-input--inline': this.inline,
          't-input--sm': this.size === 2,
          't-input--disabled': this.disabled,
          't-input--search': this.search,
          't-input--focus': this.isFocus
        }
      },
      showPlaceholder () {
        return this.isIe9 && (this.value === null || this.value === undefined || String(this.value).length === 0)
      },
      showPrefixIcon () {
        return this.prefixIcon && this.prefixIcon.length > 0 || this.$slots.prefixIcon
      },
      showSuffixIcon () {
        return this.suffixIcon && this.suffixIcon.length > 0 || this.$slots.suffixIcon
      },
      inputStyle () {
        return {
          'padding-left': this.showPrefixIcon ? '30px' : '',
          'padding-right': this.showSuffixIcon ? '30px' : ''
        }
      }
    },
    methods: {
      inputHandler (e) {
        // this.$emit('input', e)
        this.$emit('modelEvent', e.target.value)
        if (this.formItem && !this.banFormEvent) {
          this.formItem.$emit('input.input')
        }
      },
      focusHandler () {
        this.isFocus = true
      },
      blurHandler (e) {
        // this.$emit('blur', e)
        if (this.formItem && !this.banFormEvent) {
          this.formItem.$emit('input.blur')
        }
        this.isFocus = false
      },
      searchHandler () {
        this.$emit('search')
      }
    }
  }
</script>
