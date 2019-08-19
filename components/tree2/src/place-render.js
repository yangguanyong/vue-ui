export default {
  render (h) {
    const loading = h('div', {
      class: `tree-place-word tree-place-word-${this.position}`
    }, [])
    return h('div', {
      class: 'tree-place',
      style: { height: (this.nodeCount * this.listHeight) + 'px' }
    }, [loading])
  }
}