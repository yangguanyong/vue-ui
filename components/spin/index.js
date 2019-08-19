import _Spin from './src/spin.vue'
import Vue from 'vue'

var SpinComponent = Vue.extend(_Spin)
const spin =  {
  bind (el, binding) {
    el.style.position = 'relative'
    el.spinning = new SpinComponent().$mount()
    el.appendChild(el.spinning.$el)
    el.spinning.visible = binding.value
  },
  update (el, binding) {
    el.spinning.visible = binding.value
  }
}

spin.install = function (Vue) {
  Vue.directive('tSpin', spin)
}

export default spin
