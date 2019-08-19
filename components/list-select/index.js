import _SelectWrapper from './src/select-wrapper'
import _SelectAll from './src/select-all'
import _SelectCurrent from './src/select-current'
import _SelectItem from './src/select-item'

[_SelectWrapper, _SelectAll, _SelectCurrent, _SelectItem].forEach(function (comp) {
  comp.install = function (Vue) {
    Vue.component(comp.name, comp)
  }
})

export const SelectWrapper = _SelectWrapper
export const SelectAll = _SelectAll
export const SelectCurrent = _SelectCurrent
export const SelectItem = _SelectItem