<template>
  <span :class="wrapClass" @click="isClickMode ? toggleHandler() : watchHandler()" :style="{backgroundColor: bgc}">
    {{ value ? onTxt : offTxt }}
    <span :class="{ 'toggle-mask': this.disabled }"></span>
  </span>
</template>

<script>
  export default {
    name: 't-toggle',
    props: {
      value: {
        type: [Boolean, Number, String],
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      onColor: {
        type: String,
        default: '#374fbb'
      },
      offColor: {
        type: String,
        default: '#cccccc'
      },
      onTxt: {
        type: String,
        default: '启用'
      },
      offTxt: {
        type: String,
        default: '停用'
      },
      isClickMode: {    // 开关是否可以直接点击，用于监听外部事件
        type: Boolean,
        default: true
      },

      // 用来决定 v-model 绑定数据的类型 只支持 number boolean
      // 如果指定 boolean ，那么开启状态对应 true ， 关闭状态对应 false
      // 如果指定 number, 开启状态对应 1 ，关闭状态对应 0
      valueType: {
        type: String,
        default: 'boolean'
      },
      /*
      * 尺寸，目前有两种
      * 1是大尺寸, 2是小尺寸
      * */
      size: {
        type: Number,
        default: 1
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    computed: {
      wrapClass () {
        return {
          ['t-toggle__toggle']: this.size === 1,
          ['t-toggle__toggle--sm']: this.size === 2,
          ['t-toggle__toggle--active']: this.isActive,
          ['t-toggle__toggle--unactive']: !this.isActive,
          ['t-toggle__toggle--sm--active']: this.size === 2 && this.isActive,
          ['t-toggle__toggle--sm--unactive']: this.size === 2 && !this.isActive,
          [`t-toggle__toggle--active--${this.txtLength}`]: this.isActive,
          [`t-toggle__toggle--unactive--${this.txtLength}`]: !this.isActive,
          [`t-toggle__toggle--sm--active--${this.txtLength}`]: this.size === 2 && this.isActive,
          [`t-toggle__toggle--sm--unactive--${this.txtLength}`]: this.size === 2 && !this.isActive,
          ['t-toggle__toggle--disabled']: this.disabled,
          ['t-toggle__toggle--sm--disabled']: this.size === 2 && this.disabled
        }
      },
      txtLength () {
        let txtType
        switch(this.onTxt)
        {
        case 'on':
          txtType = 3
          break;
        case '是':
          txtType = 1
          break;
        default:
          txtType = 2
        }
        return txtType
      },
      isActive () {
        return this.value === this.onVal
      },
      bgc () {
        return this.value ? this.onColor : this.offColor
      },
      onVal () {
        if (this.valueType === 'number') {
          return 1
        } else if (this.valueType === 'boolean') {
          return true
        } else {
          return true
        }
      },
      offVal () {
        if (this.valueType === 'number') {
          return 0
        } else if (this.valueType === 'boolean') {
          return false
        } else {
          return false
        }
      }
    },
    methods: {
      toggleHandler () {
        if (this.disabled) {
          return
        }
        const val = this.value ? this.offVal : this.onVal
        this.$emit('change', val)
      },
      watchHandler () {
        this.$emit('watchHandler')
      }
    },

  }
</script>
