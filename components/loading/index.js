import _Loading from './src/loading.vue'

let count = 0

export default {
  install (Vue) {
    const LoadingComponent = Vue.extend(_Loading)
    const loading = new LoadingComponent().$mount()
    loading.show = (str) => {
      if (count === 0 && !loading.visible) {
        loading.visible = true
        loading.loadingTip = '' || str
      }
      count += 1
    }
    loading.hide = (duration) => {
      setTimeout(() => {
        count -= 1
        if (count === 0 && loading.visible) {
          loading.visible = false
          loading.loadingTip = ''
        }
      }, duration || 0)
    }

    window.document.body.appendChild(loading.$el)
    if (!window['$tui']) {
      window['$tui'] = {}
    }
    window['$tui']['loading'] = loading

    if (!Vue.prototype.$tui) {
      Vue.prototype.$tui = {}
    }
    Vue.prototype.$tui.loading = loading
  }
}
