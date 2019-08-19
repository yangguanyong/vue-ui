import tree from './src/tree'

tree.install = function (Vue) {
  Vue.component(tree.name, tree)
}

export default tree