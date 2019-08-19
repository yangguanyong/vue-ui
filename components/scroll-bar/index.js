/*
 * @Author: guanyong.yang
 * @Date: 2019-04-23 16:11:26
 * @Last Modified by:   guanyong.yang
 * @Last Modified time: 2019-04-23 16:11:26
 */
import scrollBar from './src/main'

scrollBar.install = function (Vue) {
  Vue.component(scrollBar.name, scrollBar)
}

export default scrollBar