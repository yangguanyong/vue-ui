export default {
  addClass (el, className) {
    if (el.classList) el.classList.add(className)
    else if (!this.hasClass(el, className)) el.className += ' ' + className
  },
  removeClass (el, className) {
    if (el.classList) el.classList.remove(className)
    else el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '')
  },
  hasClass (el, className) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className)
  }
}