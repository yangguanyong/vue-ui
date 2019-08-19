<template>
  <t-checkbox v-if="show" :checked="checked" :size="2" :disabled="disabled" @change="onChange" :label="label" />
</template>

<script>
  import tCheckbox from '../../checkbox/index'
  export default {
    name: 't-select-current',
    inject: {
      checkManager: {
        default: null
      }
    },
    props: {
      label: String
    },
    components: {
      tCheckbox
    },
    computed: {
      checked () {
        return this.checkManager && this.checkManager.isCurrentChecked()
      },
      disabled () {
        return this.checkManager && this.checkManager.isCurrentDisabled()
      },
      show () {
        return this.checkManager && !this.checkManager.isSingleChoice
      }
    },
    methods: {
      onChange (e) {
        const isCheck = e.target.checked
        this.checkManager.onCurrentChange(isCheck)
      }
    }
  }
</script>
