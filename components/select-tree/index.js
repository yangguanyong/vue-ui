import SelectTree from './src/main'

SelectTree.install = function (Vue) {
  Vue.component(SelectTree.name, SelectTree)
}

export default SelectTree