<script>
  import { VISIBLE } from './utils'
  export default {
    props: {
      data: Object,
      colData: Object,
      rowIdx: Number
    },
    render (h) {
      const type = this.colData.type
      let content
      if (type === 'index') { // 序号情况，会改变 slot-scope 传入的值
        if (this.colData.tpl) {
          content = this.colData.tpl({
            index: this.rowIdx,
            data: this.data
          })
        } else {
          content = [this.rowIdx + 1]
        }
      } else {
        if (this.colData.tpl) {
          content = this.colData.tpl(this.data)
        } else if (this.colData.prop) {
          content = this.data[this.colData.prop]
        } else {
          content = ''
        }
      }
      const style = this.colData.styles instanceof Function ? this.colData.styles(this.data, this.colData.prop) : this.colData.styles
      return h('td', {
        style: {
          ...style,
          visibility: !this.colData[VISIBLE] && 'hidden'
        }
      }, content)
    }
  }
</script>
