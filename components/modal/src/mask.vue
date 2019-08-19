<template>
  <transition name="fade-in">
    <div class="t-modal2__mask" v-if="visible"></div>
  </transition>
</template>

<script>
  export default {
    props: {
      visible: Boolean
    }
  }
</script>
