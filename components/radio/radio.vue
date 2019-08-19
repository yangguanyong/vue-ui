<template>
  <label class="t-radio__radio-wrapper">
    <span>
      <input class="t-radio__radio" :class="freeStyle" type="radio" @change="changeHandler" :value="value" v-model="model" :disabled="disabled">
      <span :class="{ 't-radio__span': isChecked && !disabled }"></span>
    </span>
    <span :class="{ 't-radio__disabled-text': disabled }">
      <slot></slot>
      <span v-if='!$slots.default'>{{label}}</span>
    </span>
  </label>
</template>
<script>
export default {
  name: 'tRadio',
  inject: {
    'formItem': {
      default: null
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    banFormEvent: {
      type: Boolean,
      default: false
    },
    value: null,
    checked: null
  },
  model: {
    prop: 'checked'
  },
  computed: {
    freeStyle () {
      if (this.disabled) {
        return {
          't-radio__disabled': true
        }
      }
    },
    isChecked () {
      if (this.checked === this.value) {
        return true
      } else {
        return false
      }
    },
    model: {
      get () {
        return this.checked
      },
      set (val) {
        if (this.formItem && !this.banFormEvent) {
          this.formItem.$emit('radio.change')
        }
        this.$emit('input', val)
      }
    }
  },
  methods: {
    changeHandler (e) {
      this.$emit('change', this.model)
    }
  }
}
</script>
<style scoped lang="stylus">
</style>

