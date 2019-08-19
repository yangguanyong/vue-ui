import DatePicker from './src/picker'
import easybar from 'easy-bar'

DatePicker.install = function (Vue) {
    Vue.use(easybar)
    Vue.component(DatePicker.name, DatePicker)
}

export default DatePicker
