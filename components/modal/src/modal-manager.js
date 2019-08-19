import Vue from 'vue'
import mask from './mask.vue'
import util from '../../../utils/util'

const modals = []
const INITZINDEX = 1049  // 初始z-index 需少于modal的z-index值
let modalId = 0

function setMask(modal) {
  modal.Mask = Vue.extend(mask)
  modal.instance = new modal.Mask().$mount(document.createElement('div'))
  document.body.appendChild(modal.instance.$el)

  // 兼容IE9
  window.requestAnimationFrame = window.requestAnimationFrame || function(fn){return setTimeout(fn,1000/60)}
  window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout

  window.requestAnimationFrame(() => {
    if (modal.instance && modal.instance.$el && modal.instance.$el.style) {
      modal.instance.$el.style.zIndex = INITZINDEX + 2 * (modals.length-1)
    }
    // const maskDom = document.querySelectorAll('.t-modal2__mask')
    // if (maskDom.length > 0) {
    //   util.addClass(maskDom[maskDom.length-1], 't-modal2__mask__' + (maskDom.length-1))
    //   maskDom[maskDom.length-1].style.zIndex = 1049 + 2 * (maskDom.length-1)
    // }
  })
  // Vue.nextTick(() => {
  //   const maskDom = document.querySelectorAll('.t-modal2__mask')
  //   if (maskDom.length > 0) {
  //     util.addClass(maskDom[maskDom.length-1], 't-modal2__mask__' + (maskDom.length-1))
  //     maskDom[maskDom.length-1].style.zIndex = 1049 + 2 * (maskDom.length-1)
  //   }
  // })
}

function addListener () {
  document.addEventListener('keydown', escHandler)
}

function removeListener () {
  document.removeEventListener('keydown', escHandler)
}

function escHandler (e) {
  if (e.which !== 27) return
  const modal = modals[0]
  if (typeof modal.closeFn === 'function') {
    modal.closeFn()
  }
}

function doFirst (isOpenMask, modal) {
  addListener()
  isOpenMask && (modal.instance.visible = true)
  util.addClass(document.querySelector('body'), 't-modal2-open')
  document.querySelector('body').style.overflow = 'hidden'
}

function doEmpty (modal) {
  removeListener()
  modal.instance.visible = false
  util.removeClass(document.querySelector('body'), 't-modal2-open')
  document.querySelector('body').style.overflow = 'auto'
}

export default {
  modals,
  add (closeFn, isOpenMask = true, isMultiple = false) {
    const isFirst = modals.length === 0
    const id = modalId++
    const modal = {
      id,
      closeFn,
      Mask: null,
      instance: null
    }
    if (isMultiple) {
      setMask(modal)
      modals.unshift(modal)
      doFirst(isOpenMask, modal)
    } else {
      if (isFirst) {
        setMask(modal)
        modals.unshift(modal)
        doFirst(isOpenMask, modal)
      }
    }
    return id
  },
  remove (id) {
    const modal = modals.find(m => m.id === id)
    if (modal) {
      if (modals.length === 1) {
        doEmpty(modal)
      } else {
        modal.instance.visible = false
      }
      modals.splice(modals.indexOf(modal), 1)
    }
  }
}
