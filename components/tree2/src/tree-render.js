export default {
  render (h) {

    const opareList = [h('div', {
      style: { position: 'absolute', top: '0px', left: '0px', width: '100%', height: '35px' }
    }, [
      checkedBoxAll, foldAndOpen
    ])]

    const checkedBoxAll = [h('tCheckedBox', {
      props: {
        checked: this.isAll
      },
      on: {
        change: this.changeAll
      }
    }, ['全选'])]

    const foldAndOpen = [h('button', {
      on: {
        click: this.foldAll
      }
    }, ['收起全部']), h('button', {
      on: {
        click: this.openAll
      }
    }, ['打开全部'])]

    const topPlace = h('place', {
      props: {
        nodeCount: this.min,
        listHeight: this.lineHeight,
        position: "top"
      }
    })
    const bottomPlace = h('place', {
      props: {
        nodeCount: this.bottomNodeCount,
        listHeight: this.lineHeight,
        position: "bottom"
      }
    })
    const nodeList = this.showData.filter((u, index) => index >= this.min && index <= this.max).map((u, index) => {
      return h('node', {
        key: index,
        props: {
          node: u
        }
      })
    })

    const nodeWrap = [h('div', {
      ref: 'main',
      style: { height: 'calc(100% - 35px);', width: '100%', overflow: 'auto' },
      on: {
        scroll: this.scroll
      }
    }, [h('div', {}, [topPlace].concat(nodeList).concat([bottomPlace]))])]


    return h('div', {
      class: 't-tree',
      style: { height: '100%', width: '100%', overflow: 'auto', position: 'relative' },
    }, opareList.concat(nodeWrap))
  }
}