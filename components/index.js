import '../styles/index.scss'
import _DatePicker from './datepicker'
import _Checkbox from './checkbox'
import _Radio from './radio'
import _Input from './input'
import _Button from './button'
import _Select from './select'
import _Pagin from './pagin'
import _Toggle from './toggle'
import _InputNumber from './input-number'
import _Table from './table'
import _TableColumn from './table-column'
import _Progress from './progress'
import _CircleProgress from './circle-progress'
import {
  _Layout,
  _LayoutNav,
  _LayoutMain,
  _LayoutMainItem,
  _LayoutBody,
  _LayoutAside,
  _LayoutAsideHead,
  _LayoutAsideBody,
  _LayoutAsideFoot
} from './layout'
import _SelectableTag from './selectable-tag'
import {_Step, _StepItem} from './step'
import _Tag from './tag'
import {_Nav, _NavItem, _NavSub, _NavSubItem} from './nav'
import {_Upload, _UploadFile, _UploadImg} from './upload'
import _Tabs from './tabs'
import _TabPane from './tab-pane'
import _Tree from './tree'
import _Tree2 from './tree2'
import _Badge from './badge'
import _Spin from './spin'
import _Loading from './loading'
import _Modal from './modal'
import _Modal2 from './modal2'
import _Tooltip from './tooltip'
import _Form, {formItem as _FormItem} from './form'
import _SelectTree from './select-tree'
import _SelectAdv from './select-adv'
import { SelectWrapper as _SelectWrapper, SelectCurrent as _SelectCurrent, SelectAll as _SelectAll, SelectItem as _SelectItem } from "./list-select"
import _Textarea from './textarea'
import _ScrollBar from './scroll-bar'
import _locale from '../locale'

const components = [
  _DatePicker,
  _Checkbox,
  _Input,
  _Button,
  _Select,
  _Pagin,
  _Toggle,
  _InputNumber,
  _Radio,
  _Table,
  _TableColumn,
  _Progress,
  _CircleProgress,
  _Layout,
  _LayoutNav,
  _LayoutMain,
  _LayoutMainItem,
  _LayoutBody,
  _LayoutAside,
  _LayoutAsideHead,
  _LayoutAsideBody,
  _LayoutAsideFoot,
  _SelectableTag,
  _Step,
  _StepItem,
  _Tag,
  _Nav,
  _NavItem,
  _NavSub,
  _NavSubItem,
  _Upload,
  _UploadFile,
  _UploadImg,
  _Tabs,
  _TabPane,
  _Tree,
  _Tree2,
  _Badge,
  _Spin,
  _Loading,
  _Modal,
  _Modal2,
  _Tooltip,
  _Form,
  _FormItem,
  _SelectTree,
  _SelectWrapper,
  _SelectCurrent,
  _SelectAll,
  _SelectItem,
  _SelectAdv,
  _Textarea,
  _ScrollBar
]
export const DatePicker = _DatePicker
export const Checkbox = _Checkbox
export const Radio = _Radio
export const Input = _Input
export const Button = _Button
export const Select = _Select
export const Pagin = _Pagin
export const Toggle = _Toggle
export const InputNumber = _InputNumber
export const Table = _Table
export const TableColumn = _TableColumn
export const Progress = _Progress
export const CircleProgress = _CircleProgress
export const Layout = _Layout
export const LayoutNav = _LayoutNav
export const LayoutMain = _LayoutMain
export const LayoutMainItem = _LayoutMainItem
export const LayoutBody = _LayoutBody
export const LayoutAside = _LayoutAside
export const LayoutAsideHead = _LayoutAsideHead
export const LayoutAsideBody = _LayoutAsideBody
export const LayoutAsideFoot = _LayoutAsideFoot
export const SelectableTag = _SelectableTag
export const Step = _Step
export const StepItem = _StepItem
export const Tag = _Tag
export const Nav = _Nav
export const NavItem = _NavItem
export const NavSub = _NavSub
export const NavSubItem = _NavSubItem
export const Upload = _Upload
export const UploadFile = _UploadFile
export const UploadImg = _UploadImg
export const Tab = _Tabs
export const Tabs = _Tabs
export const TTabItem = _TabPane
export const Tree = _Tree
export const Tree2 = _Tree2
export const Badge = _Badge
export const Spin = _Spin
export const Loading = _Loading
export const Modal = _Modal
export const Modal2 = _Modal2
export const Tooltip = _Tooltip
export const Form = _Form
export const FormItem = _FormItem
export const SelectTree = _SelectTree
export const SelectAdv = _SelectAdv
export const SelectWrapper = _SelectWrapper
export const SelectCurrent = _SelectCurrent
export const SelectAll = _SelectAll
export const SelectItem = _SelectItem
export const Textarea = _Textarea
export const ScrollBar = _ScrollBar
export const locale = _locale

export default {
  install(Vue, options) {
    options.locale && locale.use(options.locale)
    options.i18n && locale.i18n(options.i18n)
    // 部分组件的 install 回调会注册到下面两个对象中
    window['$tui'] = {
      loading: null
    }
    Vue.prototype.$tui = {
      loading: null
    }
    components.forEach((component, idx) => {
      Vue.use(component, options)
    })
  }
}