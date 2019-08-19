import modal from './src/main'

modal.install = function (Vue) {
  Vue.component(modal.name, modal)
}

export default modal