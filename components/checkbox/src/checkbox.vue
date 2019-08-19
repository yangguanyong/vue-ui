<template>
  <label class="t-checkbox__checkbox-wrapper" :class="{ 't-checkbox__disabled': disabled }">
    <span class="t-checkbox__inner-wrapper">
      <input class="t-checkbox__checkbox" :class="{ 't-checkbox__disabled': disabled }" :disabled="disabled" type="checkbox" @change="changeHandler" @input="inputHandler" :value="value" v-model="model">
      <span class="t-checkbox__label" :class="{ 't-checkbox__semi': isSemi, 't-checkbox__disabled__label': disabled, 't-checkbox__semi__disabled': isSemi && disabled }"></span>
    </span>
    <span v-if='$slots.default || label'>
      <slot></slot>
      <template v-if='!$slots.default'>{{label}}</template>
    </span>
  </label>
</template>
<script>
export default {
  name: 'tCheckbox',
  componentName: 'tCheckbox',
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
    isSemi: {
      type: Boolean,
      default: false
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
    prop: 'checked',
    event: 'inputModel'
  },
  computed: {
    model: {
      get () {
        return this.checked
      },
      set (val) {
        if (this.formItem && !this.banFormEvent) {
          this.formItem.$emit('checkbox.change')
        }
        this.$emit('inputModel', val)
      }
    }
  },
  methods: {
    inputHandler (e) {
      this.$nextTick(() => {
        this.$emit('input', e)
      })
    },
    changeHandler (e) {
      this.$nextTick(() => {
        this.$emit('change', e)
        this.$emit('changeModel', this.model)
      })
    }
  }
}
</script>
