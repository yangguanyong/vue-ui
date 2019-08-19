/*
 * @Author: guanyong.yang
 * @Date: 2018-06-23 17:08:14
 * @Last Modified by: guanyong.yang
 * @Last Modified time: 2018-10-22 11:26:29
 */
function broadcast (componentName, eventName, params) { // 只一级
  if (this.$children) {
    this.$children.forEach(child => {
      if (child.$options.componentName === componentName) {
        child.$emit.apply(child, [eventName].concat(params))
      }
      if (child) {
        // broadcast.apply(child, [componentName, eventName].concat([params]))
      }
    })
  }
}
function dispatch (componentName, eventName, params) { // 只一级
  var parent = this.$parent
  if (parent && parent.$options.componentName === componentName) {
    parent.$emit.apply(parent, [eventName].concat(params))
  }
  if (parent) {
    // dispatch.apply(parent, [componentName, eventName].concat([params]))
  }
}

function dispatchToRoot (componentName, eventName, params) { // 传递到root截止，包括root
  var parent = this.$parent
  parent.$emit.apply(parent, [eventName].concat(params))
  if (parent && parent.$options.componentName !== componentName) {
    dispatchToRoot.apply(parent, [componentName, eventName].concat([params]))
  }
}

export default {
  methods: {
    dispatch (componentName, eventName, params) {
      dispatch.call(this, componentName, eventName, params)
    },
    broadcast (componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    },
    dispatchToRoot (componentName, eventName, params) {
      dispatchToRoot.call(this, componentName, eventName, params)
    }
  }
}
