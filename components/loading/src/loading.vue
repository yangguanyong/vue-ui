<template>
  <div class="fullScreen" v-show="visible">
    <div class="t-spin">
      <div class="t-spin__container t-spin__container1">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
      <div class="t-spin__container t-spin__container2">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
      <div class="t-spin__container t-spin__container3">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
      <div v-if="hasTip" class="t-spin__loading-tip">{{ loadingTip }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 't-loading',
  data () {
    return {
      visible: false,
      loadingTip: ''
    }
  },
  computed: {
    hasTip () {
      return typeof this.loadingTip === 'string' ? this.loadingTip.trim() : ''
    }
  }
}
</script>
