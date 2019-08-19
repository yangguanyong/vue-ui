<template>
  <t-checkbox v-if="show" :checked="checked" :size="2" @change="onChange" :label="label" :disabled="disabled" />
</template>

<script>
  import tCheckbox from '../../checkbox/index'
  export default {
    name: 't-select-all',
    inject: {
      checkManager: {
        default: null
      }
    },
    props: {
      label: {
        type: String,
        default: '所有页'
      }
    },
    components: {
      tCheckbox
    },
    computed: {
      checked () {
        return this.checkManager && this.checkManager.isAllChecked()
      },
      show () {
        return this.checkManager && !this.checkManager.isSingleChoice
      },
      disabled () {
        return this.checkManager && this.checkManager.isAllDisabled()
      }
    },
    methods: {
      onChange (e) {
        const isCheck = e.target.checked
        this.checkManager.onAllChange(isCheck)
      }
    }
  }
</script>
