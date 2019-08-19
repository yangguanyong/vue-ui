<template>
  <div class="t-select" :class="wrapperClass">
    <div class="t-select__holder" :class="holderClass" @click="onHolderClick" ref="holder">
      <div class="t-select__icon"></div>
      <div class="t-select__icon-clean" v-if="resetable" @click.stop="onReset"></div>
      <div class="t-select__content" :class="placeholderText && 't-select__content--ph'">
        <select-content :auto-height="autoHeight" :size="size" :content="currentLables" :label-by="labelBy" @delete="onTagDelete" />{{ placeholderText }}
      </div>
    </div>

    <transition name="slide-down">
      <div ref="popper" v-show="isShow" class="t-select__popper-shadow">
        <div class="t-select__popper" :class="popperClass">
          <div style="padding: 6px 9px;" v-if="!disableSearch">
            <t-input
              ref="searchInput"
              class="t-select__search"
              v-model="keyword"
              :size="2"
              :placeholder="t('tUi.select.searchPh')"
              prefix-icon="t-icon-search"
              ban-form-event
              @click.stop>
              <span slot="suffixIcon" class="t-icon-qingchu" v-show="keyword.length" @click.stop="keyword = ''"></span>
            </t-input>
          </div>
          <select-popper ref="selectList">
            <ul>
              <li
                  v-if="resetText"
                  class="t-select__popper-item"
                  :title="resetItem[labelBy]"
                  :class="isResetItemSelected && 't-select__popper-item--active'"
                  @click="onReset"
              >{{ resetItem[labelBy] }}</li>
              <li
                  v-for="(item, idx) in filteredItems"
                  :key="idx"
                  class="t-select__popper-item"
                  :class="isSelected(item) && 't-select__popper-item--active'"
                  :title="item[labelBy]"
                  @click="onSelect(item)"
              >
                {{ item[labelBy] }}
              </li>
            </ul>
          </select-popper>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import popper from '../../../utils/click-popper'
  import selectPopper from './select-popper'
  import tInput from '../../input'
  import selectContent from './content'
  import locale from '../../../mixins/locale'
  // import placeholder from './placeholder'

  function getNew (data) {
    return JSON.parse(JSON.stringify(data))
  }

  export default {
    name: 't-select',
    mixins: [popper, locale],
    components: {
      selectPopper,
      tInput,
      selectContent
    },
    inject: {
      'formItem': {
        default: null
      }
    },
    props: {
      value: [String, Array, Number, Boolean],
      items: {
        type: [Array, Object],
        default () {
          return []
        }
      },
      trackBy: {
        type: String,
        default: 'key'
      },
      labelBy: {
        type: String,
        default: 'label'
      },
      /**
       * value 的类型
       * string | array
       * string: '1,2,3,4'
       * array: [1,2,3,4]
       *
       * 用于处理在 多选 情况下，处理value的输入输出类型
       */
      multiType: {
        type: String,
        default: 'string'
      },
      // 重置选项
      resetText: String,
      resetValue: {
        type: null,
        default: null
      },
      // 能否重置
      canReset: {
        type: Boolean,
        default: true
      },

      // 2 为小尺寸
      size: Number,
      inline: Boolean,
      disabled: Boolean,
      placeholder: String,
      isMulti: Boolean,
      isAppendToBody: {
        type: Boolean,
        default: false
      },
      preventOverflow: {
        type: Boolean,
        default: false
      },
      zIndex: {
        type: Number,
        default: 2000
      },
      // 如果在多选情况下，标签一行放不下时，是否会往下排列，默认禁止
      autoHeight: Boolean,
      // 禁止搜索
      disableSearch: Boolean
    },
    watch: {
      isShow (n) {
        this.$emit(n ? 'open' : 'close')
        if (n) {
          this.keyword = ''
          this.$nextTick(() => {
            if (!this.disableSearch) {
              this.$refs.searchInput.$el.querySelector('input').focus()
            }
            this.$refs.selectList.$el.scrollTop = 0
          })
        }
      },
      keyword () {
        this.$nextTick(this.update)
      },
      disabled (n) {
        if (n) {
          this.$refs.searchInput && this.$refs.searchInput.$el.querySelector('input').blur()
          this.isShow = false
          this.keyword = ''
        }
      }
    },
    computed: {
      wrapperClass () {
        return {
          't-select--inline': this.inline
        }
      },
      holderClass () {
        return {
          't-select__holder--sm': this.size === 2,
          't-select__holder--disabled': this.disabled,
          't-select__holder--opened': this.isShow,
          't-select__holder-has-value': this.currentLables.length !== 0,
          't-select__holder-can-reset': this.resetable
        }
      },
      popperClass () {
        return {
          't-select__popper--sm': this.size === 2
        }
      },
      isHold () {
        return this.isMulti
      },
      resetItem () {
        return {
          [this.trackBy]: this.resetValue,
          [this.labelBy]: this.resetText
        }
      },
      isResetItemSelected () {
        return JSON.stringify(this.value) === JSON.stringify(this.resetItem[this.trackBy])
      },
      selectItems () {
        if (this.items instanceof Array) {
          return this.items
        }
        // 对象转成数组
        return Object.keys(this.items).map(key => {
          const item = this.items[key]
          if (item[this.trackBy] === undefined) {
            item[this.trackBy] = key
          }
          return item
        })
      },
      isSelected () {
        const type = this.multiType
        const isMul = this.isMulti
        const trackBy = this.trackBy
        const value = this.value
        if (!isMul) {
          return item => item[trackBy] === value
        }
        if (type === 'string') {
          if (value === null) {
            return () => false
          } else {
            return item => {
              const keys = value.split(',').filter(k => k !== '')
              return keys.indexOf(String(item[trackBy])) !== -1
            }
          }
        } else if (type === 'array') {
          if (value === null) {
            return () => false
          } else {
            return item => {
              return value.indexOf(item[trackBy]) !== -1
            }
          }
        }
      },
      currentLables () {
        if (this.resetText && this.isResetItemSelected) {
          // 如果有重置选项
          return this.resetText
        }
        if (!this.isMulti) {
          const item = this.selectItems.find(item => item[this.trackBy] === this.value)
          return item ? String(item[this.labelBy]) : ''
        } else {
          if (this.multiType === 'string') {
            const ids = this.value === null ? [] : this.value.split(',').filter(k => k !== '')
            const labels = this.selectItems.filter(item => {
              return ids.indexOf(String(item[this.trackBy])) !== -1
            })
            return labels
          } else {
            const ids = this.value === null ? [] : this.value
            const labels = this.selectItems.filter(item => {
              return ids.indexOf(item[this.trackBy]) !== -1
            })
            return labels
          }
        }
      },
      placeholderText () {
        if (this.placeholder && this.placeholder.length > 0 && this.currentLables.length === 0) {
          return this.placeholder
        }
        return null
      },
      filteredItems () {
        return this.selectItems.filter(item => {
          return this.keyword === '' || String(item[this.labelBy]).indexOf(this.keyword) !== -1
        })
      },
      resetable () {
        /**
         * 是否显示重置按钮
         * 当设置了重置选项（resetText），则选择器不提供重置按钮功能
         */
        return this.canReset && Boolean(this.resetText) === false
      }
    },
    data () {
      return {
        isShow: false,
        keyword: ''
      }
    },
    mounted () {
      this.update()
    },
    methods: {
      onHolderClick () {
        if (this.disabled) {
          return
        }
        this.isShow = !this.isShow
      },
      onSelect (item) {
        if (!this.isMulti) {
          this.$emit('input', item[this.trackBy])
          this.$emit('change', item)
          if (this.formItem) {
            this.formItem.$emit('select.input')
          }
        } else {
          const isSelect = this.isSelected(item)
          let value
          if (this.multiType === 'string') {
            value = this.value === null ? [] : this.value.split(',').filter(k => k !== '')
          } else if (this.multiType === 'array') {
            value = this.value === null ? [] : this.value.slice()
          }

          if (isSelect) {
            value.splice(value.indexOf(this.multiType === 'string' ? String(item[this.trackBy]) : item[this.trackBy]), 1)
          } else {
            value.push(item[this.trackBy])
          }

          this.$emit('input', this.multiType === 'string' ? value.join(',') : value)
          this.$emit('change', this.selectItems.filter(item => {
            return value.indexOf(this.multiType === 'string' ? String(item[this.trackBy]) : item[this.trackBy]) !== -1
          }))
          if (this.formItem) {
            this.formItem.$emit('select.input')
          }
        }
        this.$nextTick(() => {
          this.update()
        })
      },
      onTagDelete (tag) {
        this.onSelect(tag)
      },
      onReset () {
        const v = getNew(this.resetValue)
        this.$emit('input', v)
        this.$emit('change', v)
        if (this.formItem) {
          this.formItem.$emit('select.input')
        }
        this.isShow = false
        this.$nextTick(() => {
          this.update()
        })
      }
    }
  }
</script>
