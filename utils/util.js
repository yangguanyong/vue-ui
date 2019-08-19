/**
 * Created by jun.liu on 2017/5/22.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
export default {
  getRaw (json) {
    return JSON.parse(JSON.stringify(json))
  },
  getPlainText (content) {
    return content.replace(/<\/?[^<>]+>/g, '')
  },
  hasClass (el, className) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className)
  },
  addClass (el, className) {
    if (el.classList) el.classList.add(className)
    else if (!this.hasClass(el, className)) el.className += ' ' + className
  },
  removeClass (el, className) {
    if (el.classList) el.classList.remove(className)
    else el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '')
  },
  stopPropagation (e) {
    e.stopPropagation()
  },
  isSupportPlaceholder () {
    return 'placeholder' in document.createElement('input')
  },
  getHost () {
    if (!window.location.origin) {
      return `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`
    } else {
      return window.location.origin
    }
  },
  copyObjectArr (arr) {
    const res = []
    for (let i = 0; i < arr.length; i++) {
      res.push(Object.assign({}, arr[i]))
    }
    return res
  },
  merge (main, part) {
    for (const i in part) {
      if (part.hasOwnProperty(i) && main.hasOwnProperty(i)) {
        main[i] = part[i]
      }
    }
  },
  HTMLEncode (html) {
    // http://www.cnblogs.com/daysme/p/7100553.html
    let temp = document.createElement('div')
    temp.textContent != null ? (temp.textContent = html) : (temp.innerText = html)
    const output = temp.innerHTML
    temp = null
    return output
  },
  HTMLDecode (text) {
    // 将转义的内容转回正常的符号
    let temp = document.createElement('div')
    temp.innerHTML = text
    const output = temp.innerText || temp.textContent
    temp = null
    return output
  },
  isIe (ver) {
    if (ver === undefined) {
      const UA = window.navigator.userAgent.toLowerCase()
      return /msie|trident/.test(UA)
    } else {
      var b = document.createElement('b')
      b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
      return b.getElementsByTagName('i').length === 1
    }
  },
  oneOf (value, validList) {
    // 判断参数是否是其中之一
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
  },
  hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key);
  },
  getObjectValueByPath (obj, path, fallback) {
    // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
    if (!path || path.constructor !== String) return fallback
    path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
    path = path.replace(/^\./, '') // strip a leading dot
    return this.getNestedValue(obj, path.split('.'), fallback)
  },
  getNestedValue (obj, path, fallback) {
    const last = path.length - 1

    if (last < 0) return obj === undefined ? fallback : obj

    for (let i = 0; i < last; i++) {
      if (obj == null) {
        return fallback
      }
      obj = obj[path[i]]
    }

    if (obj == null) return fallback

    return obj[path[last]] === undefined ? fallback : obj[path[last]]
  }
}
