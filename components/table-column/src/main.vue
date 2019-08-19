<!-- eslint-disable-next-line -->
<template></template>

<script>
  export default {
    name: 't-table-column',
    props: {
      prop: String,
      label: String,
      width: Number,
      fixed: [Boolean, String],
      hide: Boolean,
      styles: [Object, Function],
      type: String
    },
    beforeDestroy () {
      this['@@wather'] = null
    }
  }
</script>