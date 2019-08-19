<template>
  <t-checkbox v-if="!isSingleChoice" :checked="checked" :size="2" :disabled="disabled" @change="onChange" />
  <t-radio v-else :checked="checked" :value="true" :size="2" :disabled="disabled" @change="onChange" />
</template>

<script>
  import tCheckbox from '../../checkbox/index'
  import tRadio from '../../radio/index'
  export default {
    name: 't-select-item',
    inject: {
      checkManager: {
        default: null
      }
    },
    components: {
      tCheckbox,
      tRadio
    },
    props: {
      value: null
    },
    computed: {
      checked () {
        return this.checkManager && this.checkManager.isItemChecked(this.value)
      },
      disabled () {
        return this.checkManager && this.checkManager.isItemDisabled()
      },
      isSingleChoice () {
        return this.checkManager && this.checkManager.isSingleChoice
      }
    },
    methods: {
      onChange (e) {
        if (this.isSingleChoice) {
          this.checkManager.onItemChange(this.value)
        } else {
          const isCheck = e.target.checked
          this.checkManager.onItemChange(this.value, isCheck)
        }
      }
    }
  }
</script>
