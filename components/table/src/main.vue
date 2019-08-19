<template>
  <div class="t-table" :class="wrapperClass">
    <check-wrapper :value="checks" :trackBy="trackBy" :is-single-choice="isSingleChoice" :data="tableData2" :total="total" @input="onCheckChange">
      <div class="t-table__operations" v-if="!isHideOperations">
        <div class="t-table__operations-right">
          <slot name="btns"></slot>
        </div>
        <div class="t-table__operations-left" v-if="showSelect">
          <select-all v-if="!isHideAll" />
          <span class="t-table__operations-selected">
            已选<i>{{ checks === null ? total : checks.length }}</i>项
          </span>
        </div>
      </div>
      <div class="t-table__wrapper" v-if="tableData2.length">
        <div class="t-table__left-frag" v-if="isShowLeftTable">
          <table-fragment
              ref="leftTable"
              is-fixed
              :track-by="trackBy"
              :tr-hover-idx="trHoveringIdx"
              :header-data="leftHeaderViewData"
              :col-data="leftColsData"
              :table-data="tableData2"
              :max-height="maxHeight"
              :sync-y-scroll="top => syncYScroll('left', top)"
              :sync-scroll-top="syncScrollTop"
              @trHover="onTrHover"
              @trLeave="onTrLeave"
          />
        </div>
        <div class="t-table__right-frag" v-if="isShowRightTable">
          <table-fragment
              ref="rightTable"
              is-fixed
              :track-by="trackBy"
              :tr-hover-idx="trHoveringIdx"
              :header-data="rightHeaderViewData"
              :col-data="rightColsData"
              :table-data="tableData2"
              :max-height="maxHeight"
              :sync-y-scroll="top => syncYScroll('right', top)"
              :sync-scroll-top="syncScrollTop"
              @trHover="onTrHover"
              @trLeave="onTrLeave"
          />
        </div>
        <table-fragment
            ref="midTable"
            :track-by="trackBy"
            :tr-hover-idx="trHoveringIdx"
            :header-data="midHeaderViewData"
            :col-data="midColsData"
            :table-data="tableData2"
            :max-height="maxHeight"
            :sync-y-scroll="top => syncYScroll('mid', top)"
            :sync-scroll-top="syncScrollTop"
            @scroll="onMidScroll"
            @trHover="onTrHover"
            @trLeave="onTrLeave"
        />
      </div>
      <slot v-else name="emptyHolder">
        <div class="t-table__no-data">没有数据</div>
      </slot>
    </check-wrapper>
    <div class="t-table__footer" v-if="!isHideFooter">
      <div class="t-table__footer-left" v-if="!isHideTotal">
        <slot name="footer-left" :total="total">
          <div>
            <span>合计条数：{{ total }}</span>
          </div>
        </slot>
      </div>
      <div class="t-table__footer-right" v-if="!isHidePage">
        <t-pagin :current="pageIndex" :total="total" :page-size="pageSize" @change="onPageChange" @sizeChange="onSizeChange"></t-pagin>
      </div>
    </div>
    <div v-show="false">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import tCheckbox from '../../checkbox'
  import tBtn from '../../button'
  import tPagin from '../../pagin'
  import checkWrapper from '../../list-select/src/select-wrapper'
  import cell from './cell'
  import tableFragment from './table-fragment'
  import selectAll from '../../list-select/src/select-all'
  import {
    NO_CHILDREN,
    VISIBLE,
    NID,
    isGecko,
    isLeftFixed,
    isRightFixed,
    isFixed,
    getColumnInstance,
    flatCols,
    sortFixCols,
    fixesFixed,
    getLeftCols,
    getRightCols,
    getMidCols,
    getMaxLvByCols,
    getHeaderRenderDataByInses,
    insertSelectCol
  } from './utils'

  let rowId = 0

  export default {
    name: 't-table',
    components: {
      tCheckbox,
      tBtn,
      tPagin,
      checkWrapper,
      cell,
      tableFragment,
      selectAll
    },
    props: {
      trackBy: {
        type: String,
        default: 'id'
      },
      checks: [Array, Boolean],
      isNeedData: Boolean,
      tableData: Array,
      maxHeight: Number,
      pageIndex: Number,
      pageSize: {
        type: Number,
        default: 10
      },
      total: Number,
      hideControls: {
        type: Array,
        default () {
          return []
        }
      },
      // 是否单选
      isSingleChoice: Boolean
    },
    data () {
      return {
        leftHeaderData: [],
        rightHeaderData: [],
        midHeaderData: [],
        leftColsData: [],
        rightColsData: [],
        midColsData: [],
        leftCols: [],
        headerRowCount: 0,
        hoveringTable: null,
        isGecko,
        isOnLeft: false,
        isOnRight: false,
        trHoveringIdx: null,
        syncScrollTop: 0,
        dataCache: {}
      }
    },
    watch: {
      showSelect (n) {
        if (n) {
          this.getHeaders()
        }
      },
      tableData (n) {
        this.isNeedData && this.getData()
        this.$nextTick(this.updateView)
      }
    },
    mounted () {
      this.updateTable()
    },
    computed: {
      tableData2 () {
        return this.tableData ? this.tableData.slice() : []
      },
      leftHeaderViewData () {
        // 处理 visible
        return this.getHeaderViewData('left')
      },
      rightHeaderViewData () {
        return this.getHeaderViewData('right')
      },
      midHeaderViewData () {
        return this.getHeaderViewData('mid')
      },
      isShowLeftTable () {
        return this.leftColsData.filter(col => col[VISIBLE]).length > 0
      },
      isShowRightTable () {
        return this.rightColsData.filter(col => col[VISIBLE]).length > 0
      },
      wrapperClass () {
        return {
          'is-gecko': this.isGecko,
          'is-on-left': this.isOnLeft,
          'is-on-right': this.isOnRight
        }
      },
      showSelect () {
        return this.checks !== false
      },
      isHideOperations () {
        return this.hideControls.indexOf('operations') !== -1
      },
      isHideFooter () {
        return this.hideControls.indexOf('footer') !== -1
      },
      isHidePage () {
        return this.hideControls.indexOf('page') !== -1
      },
      isHideTotal () {
        return this.hideControls.indexOf('total') !== -1
      },
      isHideAll () {
        return this.hideControls.indexOf('all') !== -1
      }
    },
    methods: {
      getData () {
        const data = (this.tableData || []).reduce((obj, item) => {
          obj[item[this.trackBy]] = item
          return obj
        }, {})
        Object.assign(this.dataCache, data)
      },
      onPageChange (page) {
        this.$emit('pageChange', page)
      },
      onSizeChange (size) {
        this.$emit('sizeChange', size)
      },
      addWatcher () {
        const inses = getColumnInstance(this)
        const adder = inses => {
          inses.forEach(ins => {
            Object.keys(ins._props).forEach(k => {
              const watchName = '@@watcher' + k
              if (ins[watchName]) {
                ins[watchName]()
              }
              ins[watchName] = ins.$watch(k, this.updateCols)
            })
            const subInses = getColumnInstance(ins)
            if (subInses.length) {
              adder(subInses)
            }
          })
        }
        adder(inses)
      },
      updateCols () {
        this.getHeaders()
      },
      onCheckChange (ids) {
        let data
        if (this.isNeedData) {
          if (ids === null) {
            data = null
          } else {
            data = ids.map(id => this.dataCache[id])
          }
        }
        this.$emit('checkChange', ids, data)
      },
      getHeaders () {
        const inses = getColumnInstance(this)
        if (inses.length === 0) return
        let colsList = sortFixCols(fixesFixed(sortFixCols(flatCols(inses))))
        if (this.showSelect) {
          colsList = insertSelectCol(colsList)
        }
        const midCols = getMidCols(colsList)
        const leftCols = getLeftCols(colsList)
        const rightCols = getRightCols(colsList)
        const colsTree = [...leftCols, ...midCols, ...rightCols]
        const maxLv = this.headerRowCount = getMaxLvByCols(colsTree, 1)
        this.leftHeaderData = getHeaderRenderDataByInses(leftCols, 1, maxLv)
        this.rightHeaderData = getHeaderRenderDataByInses(rightCols, 1, maxLv)
        this.midHeaderData = getHeaderRenderDataByInses(midCols, 1, maxLv)
        
        this.leftColsData = colsList.filter(col => col[NO_CHILDREN] === true).map(col => {
          return Object.assign({}, col, {
            [VISIBLE]: isLeftFixed(col.fixed)
          })
        })
        this.rightColsData = colsList.filter(col => col[NO_CHILDREN] === true).sort((col1, col2) => {
          // 右边表格需要将呈现的列前置
          if (isRightFixed(col1.fixed) && isRightFixed(col2.fixed)) {
            return col1[NID] - col2[NID]
          } else if (isRightFixed(col1.fixed)) {
            return -1
          } else if (isRightFixed(col2.fixed)) {
            return 1
          }
          return 0
        }).map(col => {
          return Object.assign({}, col, {
            [VISIBLE]: isRightFixed(col.fixed)
          })
        })
        this.midColsData = colsList.filter(col => col[NO_CHILDREN] === true).map(col => {
          return Object.assign({}, col, {
            [VISIBLE]: !isFixed(col.fixed)
          })
        })
      },
      getHeaderViewData (pos) {
        // 处理 visible
        const leftData = this.leftHeaderData.map(item => Object.assign({}, item, { [VISIBLE]: pos === 'left' }))
        const rightData = this.rightHeaderData.map(item => Object.assign({}, item, { [VISIBLE]: pos === 'right' }))
        const midData = this.midHeaderData.map(item => Object.assign({}, item, { [VISIBLE]: pos === 'mid' }))
        let data

        /**
         * 右边的固定表格，需要将右边的数据调整到第一位
         */
        if (pos === 'right') {
          data = [...rightData, ...leftData, ...midData]
        } else {
          data = [...leftData, ...midData, ...rightData]
        }

        // 处理分层
        const res = []
        data.forEach(cell => {
          const row = cell.row - 1
          if (!res[row]) {
            res[row] = {
              id: rowId++,
              row: []
            }
          }
          res[row]['row'].push(cell)
        })
        return res
      },
      onEnter (pos) {
        this.hoveringTable = pos
      },
      onLeave () {
        this.hoveringTable = null
      },
      onMidScroll (isOnLeft, isOnRight) {
        this.isOnLeft = isOnLeft
        this.isOnRight = isOnRight
      },
      onTrHover (idx) {
        this.trHoveringIdx = idx
      },
      onTrLeave () {
        this.trHoveringIdx = null
      },
      syncYScroll (pos, top) {
        const leftTable = this.$refs.leftTable
        const rightTable = this.$refs.rightTable
        const midTable = this.$refs.midTable
        this.syncScrollTop = top
        if (pos === 'left') {
          rightTable && rightTable.scrollTo(top)
          midTable && midTable.scrollTo(top)
        }
        if (pos === 'right') {
          leftTable && leftTable.scrollTo(top)
          midTable && midTable.scrollTo(top)
        }
        if (pos === 'mid') {
          rightTable && rightTable.scrollTo(top)
          leftTable && leftTable.scrollTo(top)
        }
      },
      updateTableWidth () {
        /**
         * 固定表格的宽度同步中间表格
         */
        const midTable = this.$refs.midTable
        const leftTable = this.$refs.leftTable
        const rightTable = this.$refs.rightTable
        if (!midTable) return
        const width = midTable.$refs.tableHeader.offsetWidth

        leftTable && leftTable.updateTableWidth(width + 'px')
        rightTable && rightTable.updateTableWidth(width + 'px')
      },
      updateView () {
        this.$refs.leftTable && this.$refs.leftTable.getTableWidth()
        this.$refs.rightTable && this.$refs.rightTable.getTableWidth()
        this.updateTableWidth()
      },
      updateTable () {
        this.addWatcher()
        this.updateCols()
        this.$nextTick(this.updateTableWidth)
        this.isNeedData && this.getData()
      }
    }
  }
</script>
