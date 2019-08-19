import tabPane from '../tabs/src/tab-pane'

tabPane.install = function (Vue) {
  Vue.component(tabPane.name, tabPane)
}

export default tabPane
