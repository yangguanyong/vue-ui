import util from '../../utils/util'

const handler = (el, binding) => {
  if (!binding.modifiers.point) {
    let val = binding.value
    if (typeof val === 'number') {
      val = val > 99 ? '99+' : val <= 0 ? undefined : val
    }
    if (val) {
      el.setAttribute('badge-content', val)
    } else {
      el.removeAttribute('badge-content')
    }
    util.addClass(el, 't-badge')
  } else {
    util.addClass(el, 't-badge-point')
  }
}

const badge =  {
  bind (el, binding) {
    handler(el, binding)
  },
  update: handler
}

badge.install = function (Vue) {
  Vue.directive('tBadge', badge)
}

export default badge