import { Validator } from 'vee-validate'
import _form from './src/form'
import _formItem from './src/form-item'

const comp = [_form, _formItem]

comp.forEach(com => {
  com.install = function (Vue) {
    Vue.component(com.name, com)
  }
})

_formItem.install = function (Vue, options = {}) {
  if (options.getValidateSettings instanceof Function) {
    options.getValidateSettings(Validator)
  }
  // const zh = {
  //   name: 'zh',
  //   messages: {
  //     required: () => {
  //       return 'hahahaha'
  //     }
  //   }
  // }
  // Validator.localize({ zh })
  // Validator.localize('zh')
  Vue.component(_formItem.name, _formItem)
}

export default _form
export const formItem = _formItem
