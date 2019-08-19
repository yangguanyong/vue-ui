<template>
  <div class="t-select" :class="wrapperClass">
    <div class="t-select__holder" :class="holderClass" @click="onHolderClick" ref="holder">
      <div class="t-select__icon"></div>
      <div class="t-select__content" :class="placeholderText && 't-select__content--ph'">
        <div v-if="label" class="t-select__text" :class="autoHeight && 't-select__text--auto-height'" :title="label">
          {{ label }}
        </div>{{ placeholderText }}
      </div>
    </div>

    <transition name="slide-down">
      <div ref="popper" v-show="isShow" class="t-select__popper-shadow">
        <div class="t-select__popper" :class="popperClass">
          <div style="padding: 6px 9px;">
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
          <select-popper ref="selectList" :disabled="!!lazyHeight">
            <t-tree
              :data="data"
              ref="tree"
              :id-key="trackBy"
              :value-key="checkBy"
              :child-key="childBy"
              :all="false"
              :lazy-height="lazyHeight"
              :checkModel="type"
              @change="onTreeChange">
              <div style="padding-left: 14px;" v-if="resetText" slot="resetItem">
                <!--<input type="checkbox" :size="2" :label="resetText" :checked="isResetItemSelected" @input="onReset" />-->
                <!--<span>{{ resetText }}</span>-->
                <t-checkbox :label="resetText" :size="2" :checked="isResetItemSelected" @change="onReset" />
              </div>
              <template slot-scope="{ data }">
                <slot :data="data"></slot>
              </template>
            </t-tree>
          </select-popper>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import popper from '../../../utils/click-popper'
  import selectPopper from '../../select/src/select-popper'
  import tInput from '../../input'
  import tTree from '../../tree'
  import tCheckbox from '../../checkbox'
  import locale from '../../../mixins/locale'

  function throttle (fn, ms) {
    let timer
    return function () {
      clearTimeout(timer)
      timer = setTimeout(fn, ms, ...Array.from(arguments))
    }
  }

  export default {
    name: 't-select-tree',
    mixins: [popper, locale],
    components: {
      selectPopper,
      tInput,
      tTree,
      tCheckbox
    },
    props: {
      // 0: 关联多选, 1: 不关联多选, 2: 单选
      type: {
        type: Number,
        default: 0
      },
      label: String,
      // 搜索的字段，用于 tree 组件搜索方法
      searchKeys: {
        type: Array,
        default () { return [] }
      },
      data: {
        type: Array,
        default () {
          return []
        }
      },
      trackBy: {
        type: String,
        default: 'id'
      },
      checkBy: {
        type: String,
        default: 'checked'
      },
      childBy: {
        type: String,
        default: 'children'
      },
      // 重置选项
      resetText: {
        type: String
      },

      // 2 为小尺寸
      size: Number,
      inline: Boolean,
      disabled: Boolean,
      placeholder: String,
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

      // 懒加载高度
      lazyHeight: String
    },
    watch: {
      isShow (n) {
        this.$emit(n ? 'open' : 'close')
        if (n) {
          this.keyword = ''
          this.$nextTick(() => {
            this.$refs.searchInput.$el.querySelector('input').focus()
            this.$refs.selectList.$el.scrollTop = 0
          })
        }
      },
      keyword () {
        this.search()
      },
      label () {
        this.update()
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
          't-select__holder-has-value': this.label
        }
      },
      popperClass () {
        return {
          't-select__popper--sm': this.size === 2
        }
      },
      isResetItemSelected () {
        return this.label === this.resetText
      },
      placeholderText () {
        if (this.placeholder && this.placeholder.length > 0 && !this.label) {
          return this.placeholder
        }
        return null
      },
      loop () {
        return this.$refs.tree.loop
      }
    },
    data () {
      return {
        isShow: false,
        keyword: '',
        isHold: true
      }
    },
    mounted () {
      this.update()
      this.search = throttle(this.onSearch, 180) // 输入节流
    },
    methods: {
      reset () {
        this.$refs.tree.loop(this.data, item => {
          item[this.checkBy] = false
        })
      },
      onHolderClick () {
        if (this.disabled) {
          return
        }
        this.isShow = !this.isShow
      },
      onReset (e) {
        const isCheck = e.target.checked
        if (isCheck) {
          this.reset()
          this.$emit('reset', this.data)
        } else {
          // 不能反选
          e.target.checked = true
        }
        this.handleClick()
      },
      onTreeChange ({ itemData, isAll }) {
        this.$emit('change', itemData)
        this.handleClick()
      },
      onSearch () {
        this.$refs.tree.search({
          value: this.keyword,
          field: this.searchKeys
        }).then(() => {
          this.$nextTick(this.update)
        })
      },
      handleClick () {
        if (this.type === 2) {
          this.isShow = false
          this.$emit('close')
        }
      }
    }
  }
</script>
