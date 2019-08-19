import tabs from './src/tabs'

tabs.install = function (Vue) {
  Vue.component(tabs.name, tabs)
}

export default tabs
