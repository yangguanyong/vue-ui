/*
 * @Author: guanyong.yang
 * @Date: 2018-06-23 17:08:14
 * @Last Modified by: guanyong.yang
 * @Last Modified time: 2018-12-20 10:24:02
 */
// 发事件和verify功能一样
function broadcast (componentName, eventName, params) {
  if (this.$children) {
    this.$children.forEach(child => {
      if (child.$options.componentName === componentName) {
        child.$emit.apply(child, [eventName].concat(params))
      }
      if (child) {
        broadcast.apply(child, [componentName, eventName].concat([params]))
      }
    })
  }
}
function dispatch (componentName, eventName, params) {
  var parent = this.$parent
  if (parent && parent.$options.componentName === componentName) {
    parent.$emit.apply(parent, [eventName].concat(params))
  }
  if (parent) {
    dispatch.apply(parent, [componentName, eventName].concat([params]))
  }
}
function verifyParent (componentName, cb) {
  var parent = this.$parent
  if (parent && parent.$options.componentName === componentName) {
    cb(parent)
  }
  if (parent) {
    verifyParent.apply(parent, [componentName, cb])
  }
}
function verifyChild (componentName, cb) {
  if (this.$children) {
    this.$children.forEach(child => {
      if (child && child.$options.componentName === componentName) {
        cb(child)
      }
      if (child) {
        verifyChild.apply(child, [componentName, cb])
      }
    })
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
    verifyParent (componentName, cb) {
      verifyParent.call(this, componentName, cb)
    },
    verifyChild (componentName, cb) {
      verifyChild.call(this, componentName, cb)
    }
  }
}
