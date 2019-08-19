<template>
  <div
    @mouseenter="isHolderHover = true"
    @mouseleave="isHolderHover = false"
    :class="wrapperClass"
  >
    <form-input
      ref="holder"
      readonly
      :value="text"
      :placeholder="placeholderText"
      :disabled="disabled"
      :inline="inline"
      :size="size"
      ban-form-event
      :style="{'min-width': holderWidth}"
      @click="onHolderClick"
    >
      <span slot="prefixIcon" class="t-icon-riqi"></span>
      <span slot="suffixIcon" class="t-icon-qingchu" v-if="canReset" v-show="isHolderHover && !disabled" @click="onReset"></span>
    </form-input>
    <transition name="slide-down">
      <component :is="type" :value="value" :show-time="showTime" :disabled-date="disabledDate" :disabled-time="disabledTime" v-show="isShow" ref="popper" @select="onConfirm" :canReset="canReset" :loose="loose"></component>
    </transition>
  </div>
</template>

<script>
  import popper from '../../../utils/click-popper'
  import formInput from '../../input'
  import rangePicker from './range-picker'
  import datePicker from './date-picker'
  import locale from 'talebase-ui/mixins/locale'

  export default {
    name: 't-datepicker',
    inject: {
      formItem: {
        default: null
      }
    },
    mixins: [popper, locale],
    props: {
      /**
       * 范围选择时传字符串数组，否则传字符串
       * 字符串需要是时间格式
       */
      value: [Array, String],

      /**
       * 表单属性
       */
      inline: Boolean,
      size: Number,
      disabled: Boolean,
      placeholder: String,

      /**
       * 控件类型，range为选择日期范围
       */
      type: {
        type: String,
        default: 'date'
      },

      /**
       * 能否重置日期
       */
      canReset: {
        type: Boolean,
        default: true
      },

      /**
       * 是否可以选择时间
       */
      showTime: Boolean,
      /**
       * 禁用日期
       * date: Date => boolean
       */
      disabledDate: Function,
      /**
       * 禁用时间
       * (date: Date, pos?:String) => { disabledHours?: [], disabledMinutes?: [], disabledSeconds?: [] }
       * 在 type = range，即范围选择中，会返回 pos，start表示起始位置，end表示终止位置
       * 需返回一个对象，对象可包括三个键，值为一个数组，表示禁用的时、分、秒中的哪些数字
       */
      disabledTime: Function,

      /**
       * popper 选项
       */
      zIndex: {
        type: Number,
        default: 2000
      },
      preventOverflow: {
        type: Boolean,
        default: true
      },
      autoWidth: {
        type: Boolean,
        default: false
      },
      offsets: {
        type: Array,
        default () {
          return [0, 5]
        }
      },

      /**
       * 是否可以单选时间
       * 默认需要选择两个时间才生效
       */
      loose: {
        type: Boolean,
        default: false
      }
    },
    components: {
      formInput,
      range: rangePicker,
      date: datePicker
    },
    watch: {
      isShow (n, o) {
        if (n) {
          this.$refs.popper.init()
        }
      }
    },
    data () {
      return {
        isShow: false,
        isHold: true,
        isHolderHover: false
      }
    },
    mounted () {
      // popper 里发出
      this.$on('close', () => {
        const val = this.$refs.popper.getValue()
        if (val !== this.value) {
          this.emitSelect(val)
        }
      })
    },
    computed: {
      text () {
        const val = this.value
        if (this.type === 'range') {
          if (val instanceof Array) {
            const len = val.filter(item => Boolean(item)).length
            if (len) {
              return val.join(this.t('tUi.datepicker.to'))
            }
          }
          return ''
        } else {
          return val
        }
      },
      placeholderText () {
        if (this.placeholder) {
          return this.placeholder
        }
        return this.type === 'range' ? this.t('tUi.datepicker.chooseDateRange') : this.t('tUi.datepicker.chooseDate')
      },
      holderWidth () {
        if (this.type === 'range') {
          return this.showTime ? '340px' : '225px'
        } else {
          return this.showTime ? '190px' : '130px'
        }
      },
      wrapperClass () {
        return {
          't-datepicker--inline': this.inline
        }
      }
    },
    methods: {
      onReset (e) {
        e.preventDefault()
        this.emitSelect(this.type === 'range' ? [null, null] : null)
      },
      onHolderClick () {
        this.isShow = !this.isShow
      },
      onConfirm (val) {
        this.emitSelect(val)
        this.isShow = false
      },
      emitSelect (val) {
        this.$emit('input', val)
        this.$emit('change', val)
        if (this.formItem) {
          this.formItem.$emit('rangepicker.select')
        }
      }
    }
  }
</script>
