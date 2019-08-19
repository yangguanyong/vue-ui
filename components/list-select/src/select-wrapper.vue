<template>
  <div>
    <slot></slot>
  </div>
</template>


<script>
  export default {
    name: 't-select-wrapper',
    provide () {
      return {
        checkManager: this
      }
    },
    props: {
      value: [Array, Boolean],
      /**
       * 列表数据
       * 用于判断当前页是否选中
       */
      data: Array,
      trackBy: {
        type: String,
        default: 'id'
      },
      total: Number,
      // 是否单选
      isSingleChoice: Boolean,
      // 是否返回数据
      isNeedData: Boolean
    },
    computed: {
      currentIds () {
        return this.data ? this.data.map(item => item[this.trackBy]) : []
      }
    },
    watch: {
      data () {
        if (this.isNeedData) {
          this.updateCacheData()
        }
      }
    },
    data () {
      return {
        cacheData: {}
      }
    },
    mounted () {
      this.updateCacheData()
    },
    methods: {
      isItemChecked (id) {
        if (this.isSingleChoice) {
          // 单选
          return this.value && this.value[0] === id
        }
        // 多选
        return this.value === null || this.value.indexOf(id) !== -1
      },
      isCurrentChecked () {
        return this.value === null || this.currentIds.length > 0 && this.currentIds.every(id => this.value.indexOf(id) !== -1)
      },
      isAllChecked () {
        return this.value === null
      },
      isCurrentDisabled () {
        return this.value === null || !this.data.length
      },
      isItemDisabled () {
        return this.value === null
      },
      isAllDisabled () {
        return !this.total
      },
      onItemChange (id, isCheck) {
        const ids = this.value.slice()
        if (this.isSingleChoice) {
          this.changeHandler([id])
        } else {
          // 处理选中
          if (isCheck && ids.indexOf(id) === -1) {
            ids.push(id)
            this.changeHandler(ids)
          }
          // 处理反选
          if (!isCheck) {
            const idx = ids.indexOf(id)
            if (idx > -1) {
              ids.splice(idx, 1)
              this.changeHandler(ids)
            }
          }
        }
      },
      onCurrentChange (isCheck) {
        const ids = this.value.slice()
        if (isCheck) {
          const newIds = this.currentIds.filter(id => ids.indexOf(id) === -1)
          this.changeHandler(ids.concat(newIds))
        } else {
          this.changeHandler(ids.filter(id => this.currentIds.indexOf(id) === -1))
        }
      },
      onAllChange (isCheck) {
        if (isCheck) {
          this.changeHandler(null)
        } else {
          this.changeHandler([])
        }
      },
      changeHandler (ids) {
        this.$emit('input', ids)
        this.$emit('change', ids, this.isNeedData && ids ? ids.map(id => this.cacheData[id]).filter(item => !!item) : null)
      },
      updateCacheData () {
        if (!this.isNeedData || !this.data) return
        this.cacheData = Object.assign({}, this.cacheData, this.data.reduce((res, item) => {
          res[item[this.trackBy]] = item
          return res
        }, {}))
      }
    }
  }
</script>