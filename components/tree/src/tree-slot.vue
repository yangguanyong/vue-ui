<script>
export default {
  props: {
    arg: Object,
    tpl: Function
  },
  render (h) {
    this.arg.node.el = this.$parent
    return h('span', this.tpl({
      node: this.arg.node,
      data: this.arg.data
    }))
  }
}
</script>