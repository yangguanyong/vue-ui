import layout from './layout'
import layoutNav from './layout-nav'
import layoutMain from './layout-main'
import layoutMainItem from './layout-main-item'
import layoutBody from './layout-body'
import layoutAside from './layout-aside'
import layoutAsideHead from './layout-aside-head'
import layoutAsideBody from './layout-aside-body'
import layoutAsideFoot from './layout-aside-foot'

const components = [
  layout,
  layoutNav,
  layoutMain,
  layoutMainItem,
  layoutBody,
  layoutAside,
  layoutAsideHead,
  layoutAsideBody,
  layoutAsideFoot
]

components.forEach(node => {
  node.install = function (Vue) {
    Vue.component(node.name, node)
  }
})

export const _Layout = layout
export const _LayoutNav = layoutNav
export const _LayoutMain = layoutMain
export const _LayoutMainItem = layoutMainItem
export const _LayoutBody = layoutBody
export const _LayoutAside = layoutAside
export const _LayoutAsideHead = layoutAsideHead
export const _LayoutAsideBody = layoutAsideBody
export const _LayoutAsideFoot = layoutAsideFoot
