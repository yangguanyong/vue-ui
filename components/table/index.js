import easybar from 'easy-bar'
import Table from './src/main'

Table.install = function (Vue) {
  Vue.use(easybar)
  Vue.component(Table.name, Table)
}

export default Table