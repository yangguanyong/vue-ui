<template>
  <div class="t-textarea" :class="wrapClass">
    <label>
      <textarea
        ref="input"
        :cols="cols"
        :rows="rows"
        :disabled="disabled"
        :name="name"
        :value="value"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :type="type"
        :readonly="readonly"
        v-on="$listeners"
        @input="inputHandler"
        @blur="blurHandler"
      />
      <div class="t-input__placeholder" :style="inputStyle" @click="$refs.input.focus()" v-if="showPlaceholder">
        {{ placeholder }}
      </div>
    </label>
  </div>
</template>

<script>
  import iePatcher from '../../../utils/ie-patcher'

  export default {
    name: 't-textarea',
    mixins: [iePatcher],
    inject: {
      'formItem': {
        default: null
      }
    },
    props: {
      value: [String, Number, Object],
      name: String,
      disabled: Boolean,
      placeholder: String,
      maxlength: Number,
      type: String,
      readonly: Boolean,

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
      cols: String,
      rows: String,

      banFormEvent: Boolean
    },
    data () {
      return {
        isIe9: typeof window !== "undefined" && window.navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0
      }
    },
    model: {
      prop: 'value',
      event: 'modelEvent'
    },
    computed: {
      wrapClass () {
        return {
          't-area--inline': this.inline,
          't-area--sm': this.size === 2,
          't-area--disabled': this.disabled
        }
      },
      showPlaceholder () {
        return this.isIe9 && (this.value === null || this.value === undefined || String(this.value).length === 0)
      }
    },
    methods: {
      inputHandler (e) {
        this.$emit('input', e)
        this.$emit('modelEvent', e.target.value)
        if (this.formItem && !this.banFormEvent) {
          this.formItem.$emit('input.input')
        }
      },
      blurHandler (e) {
        this.$emit('blur', e)
        if (this.formItem && !this.banFormEvent) {
          this.formItem.$emit('input.blur')
        }
      }
    }
  }
</script>
