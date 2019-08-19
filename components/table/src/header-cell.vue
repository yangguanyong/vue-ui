<script>
  import { VISIBLE, TYPE_SELECT, NO_CHILDREN } from './utils'
  import selectCurrent from '../../list-select/src/select-current'
  export default {
    props: {
      colData: Object
    },
    components: {
      selectCurrent
    },
    render (h) {
      const { headerTpl, cols, rows, label, type } = this.colData
      const opts = {
        attrs: {
          colspan: cols,
          rowspan: rows,
          't-table-col': this.colData[NO_CHILDREN] || undefined
        },
        style: {
          visibility: !this.colData[VISIBLE] && 'hidden'
        }
      }
      return type === TYPE_SELECT ? h('th', {
        ...opts
      }, [h('div', {
        style: {
          textAlign: 'center'
        }
      }, [h('select-current')])]) : headerTpl ? h('th', {
        ...opts
      }, headerTpl()) : h('th', {
        ...opts,
        domProps: {
          innerHTML: label
        }
      })
    }
  }
</script>
