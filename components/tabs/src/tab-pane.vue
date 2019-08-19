<template>
  <div class="t-tabs__content__pane" v-if="$parent.vShow ? true : active" v-show='$parent.vShow ? active : true'>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'tTabItem',
    props: {
      label: String,
      name: String,
      to: [String, Object],
      exact: {
        type: Boolean,
        default: false
      },
      badge: Number
    },
    inject: {
      rootTabs: {
        default: null
      }
    },
    data() {
      return {
        show: null
      }
    },
    watch: {
      badge (n) {
        this.rootTabs.updateTabs()
      }
    },
    computed: {
      active () {
        return (this.$parent.currentName === this.name) || this.show
      }
    },
    mounted () {
      this.rootTabs.updateTabs()
    },
    destroyed () {
      this.rootTabs.updateTabs()
    }
  }
</script>
