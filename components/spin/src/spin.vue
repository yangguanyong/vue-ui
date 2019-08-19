<template>
  <div class="t-spinner" v-show="visible">
    <div class="t-spinner__container t-spinner__container1">
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3"></div>
      <div class="circle4"></div>
    </div>
    <div class="t-spinner__container t-spinner__container2">
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3"></div>
      <div class="circle4"></div>
    </div>
    <div class="t-spinner__container t-spinner__container3">
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3"></div>
      <div class="circle4"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 't-spin',
  data () {
    return {
      visible: false
    }
  }
}
</script>
