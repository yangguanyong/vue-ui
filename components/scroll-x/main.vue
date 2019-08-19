<template>
  <div ref="main" class="ps-Wrap">
    <div class="ps-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import Ps from 'perfect-scrollbar'
  // import 'perfect-scrollbar/css/perfect-scrollbar.css'

  export default {
    props: {
      disabled: Boolean
    },
    mounted () {
      if (!this.disabled) {
        Ps.initialize(this.$refs.main)
      }
    },
    updated () {
      if (!this.disabled) {
        Ps.update(this.$refs.main)
      }
    }
  }
</script>

<style scoped>
  /* .ps-Wrap{
    position:relative;
    margin:0px auto;
    padding:0px;
    width:100%;
    overflow:hidden;
  }
  .ps-container{
    white-space: nowrap;
  } */
</style>

