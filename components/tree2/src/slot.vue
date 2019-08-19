<script>
export default {
  props: {
    data: Object,
    node: Object,
    tpl: Function
  },
  render (h) {
    return h('span', this.tpl({
      data: this.data,
      node: this.node
    }))
  }
}
</script>