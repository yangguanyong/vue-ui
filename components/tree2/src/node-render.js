export default {
  render (h) {
    // 箭头
    const arrowNode = h('span', {
      class: ['toggle-btn', this.node.foldChildsStatus ? 'tree-arrow-right' : 'tree-arrow-down'],
      on: {
        click: this.foldChildHandle
      }
    })
    const arrowNodePlace = h('span', {
      class: ['toggle-btn']
    })
    const arrowRelust = this.node.foldChildsStatus !== 'none' ? [arrowNode] : [arrowNodePlace]

    // 勾选
    const nodeSlot = h('nodeSlot', {
      props: {
        tpl: this.root.$scopedSlots.default,
        data: this.node.data,
        node: this.node
      }
    })

    if (this.node.checkable) {
      if (!this.node.disabled) {
        var checkboxNode = [h('tCheckedBox', {
          props: {
            checked: this.node.checked,
            isSemi: this.node.half
          },
          on: {
            inputModel: (value) => { this.node.checked = value },
            change: this.checkHandle
          }
        }, [nodeSlot])]
      } else {
        var checkboxNode = [h('tCheckedBox', {
          props: {
            checked: this.node.checked,
            isSemi: this.node.half,
            disabled: true
          },
          on: {
            inputModel: (value) => { this.node.checked = value },
          }
        }), h('span', {}, [nodeSlot])]
      }
    } else {
      var checkboxNode = [h('span', {}, [nodeSlot])]
    }
    
    const wrap = h('div', {
      class: 'tree2-node',
      style: {
        paddingLeft: this.node.level * 10 + 'px',
        height: this.root.lineHeight + 'px'
      }
    }, [arrowRelust].concat(checkboxNode))

    return wrap
  }
}