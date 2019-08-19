import nav from './src/nav'
import navItem from './src/nav-item'
import navSub from './src/nav-sub'
import navSubItem from './src/nav-sub-item'

const components = [nav, navItem, navSub, navSubItem]

components.forEach(node => {
  node.install = function (Vue) {
    Vue.component(node.name, node)
  }
})

export const _Nav = nav
export const _NavItem = navItem
export const _NavSub = navSub
export const _NavSubItem = navSubItem
