<template>
  <div class="t-select" :class="wrapClass">
    <div class="t-select__holder" :class="holderClass" @click="focusHandler" ref="holder">
      <div class="t-select__icon"></div>
      <div class="t-select__icon-clean" v-if="resetable" @click.stop="onReset"></div>
      <div class="t-select__content" :class="placeholderText && 't-select__content--ph'">
        <select-content :auto-height="autoHeight" :size="size" :content="holderContent" label-by="name" @delete="tagRemoveHandler" />{{ placeholderText }}
      </div>
    </div>

    <transition name="slide-down">
      <div ref="popper" v-show="isShow && canSelect" class="t-select__popper-shadow" :style="{zIndex: zIndex}">
        <div class="t-select__popper" :class="popperClass">
          <div style="padding: 6px 9px;">
            <t-input
                ref="input"
                class="t-select__search"
                v-model="keyword"
                :size="2"
                :placeholder="searchPlaceholder"
                prefix-icon="t-icon-search"
                ban-form-event
                @click.stop
                @keydown.13="enterHandler"
                @keydown.8="backHandler"
                @input="inputHandler"
                @paste="pasteHandler">
              <span slot="suffixIcon" class="t-icon-qingchu" v-show="keyword.length" @click="keyword = '';inputHandler()"></span>
            </t-input>
          </div>
          <select-popper ref="selectList">
            <list
              v-if="canSelect"
              :style="'max-height: ' + itemsHeight + 'px'"
              :items="searchRes"
              :trackBy="trackBy"
              :labelBy="labelBy"
              :names="selectedNames"
              :ids="selectedIds"
              :blankText="blankText"
              :resetText="resetText"
              :isSelectResetText="tags.length === 0"
              @add="listAddHandler"
              @remove="listRemoveHandler"
              @reset="onReset"
              />
          </select-popper>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import tag from './tag'
  import popper from '../../../utils/popper'
  import list from './list'
  import spin from './spin'
  import selectContent from '../../select/src/content'
  import tInput from '../../input'
  import selectPopper from '../../select/src/select-popper'

  const u = {
    getNew (arr1, arr2) {
      return arr1.filter(item => arr2.indexOf(item) === -1)
    },
    getRemove (arr1, arr2) {
      return arr2.filter(item => arr1.indexOf(item) === -1)
    }
  }

  export default {
    name: 't-select-adv',
    mixins: [popper],
    components: {
      tag,
      list,
      spin,
      selectContent,
      tInput,
      selectPopper
    },
    props: {
      /**
       * isMulti === true 时，names ids 为数组
       */
      names: null,
      ids: null,
      splitBy: {
        type: String,
        default: ','
      },
      /**
       * 黏贴时的切割符号
       */
      pasteSplitBy: {
        type: RegExp,
        default () {
          return /,|，|\n|\s/
        }
      },

      /*
      * 用来为初始的 ids 生成标签
      * 因为 id 对应的标签内容，是通过 getData 或 items 获取
      * 初始化时，id 找不到对应的 name，由此属性来匹配到对应的 name
      * 该属性只在组件 created 时用到，并遵循 trackBy labelBy 解析
      * */
      initItems: Array,

      /**
       * items 和 getData 都是获取候选列表项
       * 如果同时存在，会忽略 getData
       */
      items: Array,

      /**
       * 输入时获取下拉选项
       * ({ keyword }) => Promise => resolve([...])
       * 返回Promise，并拿到数组作为下拉框数据
       */
      getData: Function,

      /**
       * trackBy 和 labelBy 定义如何解析下拉框数据
       * trackBy 指定的字段，会同步到 ids
       * labelBy 的字段，用来作为 tag 的唯一性标识和用来呈现选中的选项
       */
      trackBy: {
        type: String,
        default: 'key'
      },
      labelBy: {
        type: String,
        default: 'label'
      },
      /**
       * 是否允许输入时回车生成标签
       * 需要同步 names
       */
      canCreate: {
        type: Boolean,
        default: true
      },
      /**
       * 是否开启候选功能
       * 关闭后，无视 items | getData 属性
       */
      canSelect: {
        type: Boolean,
        default: true
      },
      /**
       * 是否单选
       * 若是单选，ids, names 为非数组
       */
      isMulti: {
        type: Boolean,
        default: true
      },
      placeholder: String,
      disabled: Boolean,

      // 用来控制下拉框的 zIndex
      zIndex: Number,

      inline: Boolean,
      size: {
        type: Number,
        default: 1
      },
      canReset: Boolean,
      autoHeight: Boolean,
      // 输入框placeholder
      searchPlaceholder: {
        type: String,
        default: '请输入关键字'
      },
      // 无数据文案
      blankText: {
        type: String,
        default: '无相关结果'
      },
      resetText: String
    },
    watch: {
      names2 (n, o) {
        const newNames = u.getNew(n, o)
        const removeNames = u.getRemove(n, o)

        if (newNames.length) {
          newNames.forEach(name => this.createTagByName(name))
        }

        if (removeNames.length) {
          removeNames.forEach(name => this.removeTagByName(name))
        }
      },
      ids2 (n, o) {
        const newIds = u.getNew(n, o)
        const removeIds = u.getRemove(n, o)

        if (newIds.length) {
          newIds.forEach(id => this.createTagById(id))
        }

        if (removeIds.length) {
          removeIds.forEach(id => this.removeTagById(id))
        }
      },
      isShow (n, o) {
        if (n === true && o === false) {
          this.getItems()
          this.$nextTick(() => {
            this.$refs.selectList.$el.scrollTop = 0
          })
        }
      },
      tags () {
        this.update()
      },
      disabled (n) {
        if (n) {
          this.$refs.input && this.$refs.input.$el.querySelector('input').blur()
          this.isShow = false
          this.keyword = ''
        }
      },
      searchRes () {
        this.update()
      }
    },
    created () {
      if (this.names2) {
        this.names2.forEach(name => this.createTagByName(name))
      }
      if (this.ids2 && this.initItems) {
        // 初始化 id 相关的标签
        this.listAddCache = this.initItems.filter(item => {
          return this.ids2.indexOf(item[this.trackBy]) !== -1
        }).reduce((res, item) => {
          res[item[this.trackBy]] = item
          return res
        }, {})
        this.ids2.forEach(id => this.createTagById(id))
      }
    },
    mounted () {
      document.addEventListener('click', this.documentClickHandler)
    },
    beforeDestroy () {
      document.removeEventListener('click', this.documentClickHandler)
      clearTimeout(this.inputDebounce)
    },
    data () {
      return {
        mapByName: {},
        mapById: {},
        idx: 0,
        keyword: '',
        isPaste: false,
        searchKeyWord: '',
        searchRes: [],
        isShow: false,
        waitToUpdateItemsCount: [],
        listAddCache: {},
        listRemoveCache: {},
        loading: false,
        itemsHeight: null
      }
    },
    computed: {
      holderContent () {
        if (this.tags.length) {
          return this.tags
        } else if (Boolean(this.resetText) === true) {
          return this.resetText
        }
        return null
      },
      tags () {
        const names = Object.keys(this.mapByName).map(name => this.mapByName[name])
        const ids = Object.keys(this.mapById).map(id => this.mapById[id])
        return names.concat(ids).sort((a, b) => a.idx - b.idx)
      },
      selectedNames () {
        return Object.keys(this.mapByName)
      },
      selectedIds () {
        return Object.keys(this.mapById)
      },
      names2 () {
        if (this.isMulti) {
          return this.names
        } else {
          return Boolean(this.names) === false ? [] : [this.names]
        }
      },
      ids2 () {
        if (this.isMulti) {
          return this.ids
        } else {
          return Boolean(this.ids) === false ? [] : [this.ids]
        }
      },
      wrapClass () {
        return {
          't-select--inline': this.inline
        }
      },
      holderClass () {
        return {
          't-select__holder--sm': this.size === 2,
          't-select__holder--disabled': this.disabled,
          't-select__holder--opened': this.isShow,
          't-select__holder-has-value': this.tags.length !== 0,
          't-select__holder-can-reset': this.resetable
        }
      },
      resetable () {
        return this.canReset && this.tags.length
      },
      placeholderText () {
        if (this.placeholder && this.placeholder.length > 0 && Boolean(this.resetText) === false && this.tags.length === 0) {
          return this.placeholder
        }
        return null
      },
      popperClass () {
        return {
          't-select__popper--sm': this.size === 2
        }
      }
    },
    methods: {
      createTagByName (name) {
        if (this.mapByName[name] === undefined) {
          this.$set(this.mapByName, name, {
            name: name,
            id: undefined,
            idx: this.idx++,
            itemCount: undefined
          })
        }
      },
      removeTagByName (name) {
        this.$delete(this.mapByName, name)
      },
      listAddHandler (tag) {
        let ids = this.ids2.filter(item => item !== '')
        if (ids.indexOf(tag[this.trackBy]) === -1) {
          if (!this.isMulti) {
            ids = [tag[this.trackBy]]
          } else {
            ids.push(tag[this.trackBy])
          }
        }
        this.listAddCache[tag[this.trackBy]] = tag
        this.updateIds(ids)
        this.$emit('itemSelect', tag)
        this.afterListOperationHandler()
      },
      listRemoveHandler (item) {
        const tag = this.mapById[item[this.trackBy]]
        if (!tag) return
        const ids = this.ids2.slice()
        const idx = ids.indexOf(tag.id)
        if (idx !== -1) {
          this.listRemoveCache[tag.id] = tag
          ids.splice(idx, 1)
          this.updateIds(ids)
          this.$emit('itemRemove', tag.id)
        }
        this.afterListOperationHandler()
      },
      afterListOperationHandler () {
        // 单选情况下，选择完以后，收起下拉
        if (!this.isMulti) {
          this.isShow = false
          this.keyword = ''
        }
      },
      createTagById (id) {
        const tag = this.listAddCache[id]
        if (tag) {
          this.$set(this.mapById, tag[this.trackBy], {
            name: tag[this.labelBy],
            id: tag[this.trackBy],
            idx: this.idx++,
            itemCount: undefined
          })
          delete this.listAddCache[id]
        }
      },
      removeTagById (id) {
        this.$delete(this.mapById, id)
        delete this.listRemoveCache[id]
      },
      enterHandler () {
        if (this.keyword === '' || !this.canCreate) return
        const currentNames = Object.keys(this.mapByName)
        if (currentNames.indexOf(this.keyword) === -1) {
          let names
          if (!this.isMulti) {
            names = [this.keyword]
          } else {
            names = this.names2.concat(this.keyword)
          }
          this.updateNames(names)
          this.$emit('itemSelect', this.keyword)
        }
        // 有搜索功能才需要补回数目
        if (this.keyword === this.searchKeyWord) {
          if (this.mapByName[this.keyword]) {
            this.mapByName[this.keyword]['itemCount'] = this.searchRes.length
          }
        } else {
          if (this.waitToUpdateItemsCount.indexOf(this.keyword) === -1) {
            this.waitToUpdateItemsCount.push(this.keyword)
          }
        }
        this.keyword = ''
      },
      backHandler () {
        if (this.keyword === '' && this.tags.length) {
          this.tagRemoveHandler(this.tags[this.tags.length - 1])
        }
      },
      tagRemoveHandler (tag) {
        if (this.disabled) return
        setTimeout(() => { // 防止触发了关闭下拉 documentClickHandler
          if (tag.id === undefined) {
            const names = this.names2.slice()
            const idx = names.indexOf(tag.name)
            if (idx !== -1) {
              names.splice(idx, 1)
              this.updateNames(names)
              this.$emit('itemRemove', tag.name)
            }
          } else {
            const ids = this.ids2.slice()
            const idx = ids.indexOf(tag.id)
            if (idx !== -1) {
              ids.splice(idx, 1)
              this.listRemoveCache[tag.id] = tag
              this.updateIds(ids)
              this.$emit('itemRemove', tag.id)
            }
          }
        }, 0)
      },
      inputHandler () {
        if (this.isPaste) {
          this.isPaste = false
          this.keyword = ''
          return
        }
        if (!this.canSelect) return
        if (this.items) {
          this.getItems()
        } else if (this.getData) {
          clearTimeout(this.inputDebounce)
          this.inputDebounce = setTimeout(() => {
            this.getItems()
          }, 260)
        }
      },
      pasteHandler (e) {
        const clipboardData = e.clipboardData || window.clipboardData
        const text = clipboardData.getData('text').replace(/^,|,$/g, '')
        console.log(this.pasteSplitBy.test(text), text)
        if (this.pasteSplitBy.test(text)) {
          this.isPaste = true
          const newNames = u.getNew(text.split(this.pasteSplitBy).filter(item => item !== ''), this.names2)
          if (newNames.length) {
            this.updateNames(this.isMulti ? this.names2.concat(newNames) : [newNames[0]])
          }
        }
      },
      getItems () {
        if (this.items) {
          this.searchKeyWord = this.keyword
          this.searchRes = this.items.filter(item => {
            return item[this.labelBy].indexOf(this.keyword) !== -1
          })
        } else if (this.getData) {
          this.loading = true
          const keyword = this.keyword
          this.getData({ keyword }).then(r => {
            this.loading = false
            this.searchKeyWord = keyword
            this.searchRes = r
            this.runUpdateItemsCount()
          }).catch(() => {
            this.loading = false
          })
        }
      },
      documentClickHandler (e) {
        const popper = this.$refs.popper
        if (!this.$el.contains(e.target) && !popper.contains(e.target)) {
          this.isShow = false
          this.keyword = ''
        }
      },
      runUpdateItemsCount () {
        const idx = this.waitToUpdateItemsCount.indexOf(this.searchKeyWord)
        if (idx !== -1) {
          if (this.mapByName[this.searchKeyWord]) {
            this.mapByName[this.searchKeyWord]['itemCount'] = this.searchRes.length
          }
          this.waitToUpdateItemsCount.splice(idx, 1)
        }
      },
      focusHandler () {
        if (this.disabled) return
        this.isShow = true
        this.$nextTick(() => {
          this.$refs.input.$el.querySelector('input').focus()
        })
      },
      updateNames (names) {
        this.$emit('update:names', this.isMulti ? names : (names[0] || ''))
      },
      updateIds (ids) {
        this.$emit('update:ids', this.isMulti ? ids : (ids[0] || ''))
      },
      onReset () {
        this.updateNames([])
        this.updateIds([])
      },

      // 挑选产品后，要默认选中对应模型
      setTag (data) {
        // data 数据结构和 items 一样
        let ids = this.ids2.filter(item => item !== '')
        if (ids.indexOf(data[this.trackBy]) === -1) {
          if (!this.isMulti) {
            ids = [data[this.trackBy]]
          } else {
            ids.push(data[this.trackBy])
          }
        }
        this.listAddCache[data[this.trackBy]] = data
        this.updateIds(ids)
      }
    }
  }
</script>

