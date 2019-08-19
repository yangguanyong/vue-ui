<template>
  <div :style="'width: ' + tableWidth" :class="isFixed && 't-table__fragment--fixed'">
    <div class="t-table__header" ref="tableHeader">
      <table>
        <colgroup>
          <col v-for="(style, sIdx) in colStyle" :key="style + sIdx" :style="style">
        </colgroup>
        <thead>
          <tr v-for="row in headerData" :key="row.id">
            <header-cell v-for="(col, cIdx) in row.row" :key="cIdx" :colspan="col.cols" :rowspan="col.rows" :colData="col" />
          </tr>
        </thead>
      </table>
    </div>
    <div class="t-table__body" ref="tableBody">
      <div>
        <table>
          <colgroup>
            <col v-for="(style, sIdx) in colStyle" :key="style + sIdx" :style="style">
          </colgroup>
          <tbody ref="tBody">
            <tr v-for="(row, rIdx) in tableData" :key="rIdx" @mouseenter="onTrHover(rIdx)" @mouseleave="onTrLeave" :class="rIdx === trHoverIdx && 'is-hover'">
              <template v-for="col in colData">
                <td v-if="col.type === TYPE_SELECT" :key="col[NID]" style="text-align: center">
                  <select-item :value="row[trackBy]" />
                </td>
                <cell v-else :key="col[NID]" :data="row" :col-data="col" :row-idx="rIdx" />
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import cell from './cell'
  import headerCell from './header-cell'
  import { VISIBLE, NID, TYPE_SELECT } from './utils'
  import selectItem from '../../list-select/src/select-item'
  import EasyBar from 'easy-bar'

  const raf = (function () {
    if (typeof window !== "undefined") {
      return window.requestAnimationFrame ? window.requestAnimationFrame.bind(window)/* ie11 */ : setTimeout
    }
    return function () {}
  })()

  export default {
    components: {
      cell,
      selectItem,
      headerCell
    },
    props: {
      trackBy: String,
      headerData: Array,
      colData: Array,
      tableData: Array,
      maxHeight: Number,
      isFixed: Boolean,
      syncYScroll: Function,
      trHoverIdx: Number,
      syncScrollTop: Number
    },
    computed: {
      colStyle () {
        let customWidthTotal = 0
        let customWidthCount = 0
        this.colData.forEach(col => {
          if (typeof col.width === 'number') {
            customWidthTotal += col.width
            customWidthCount += 1
          }
        })

        // const resetWidth = 'calc((100% - ' + customWidthTotal + 'px) / ' + (this.colData.length - customWidthCount) + ')'
        // const resetWidth = '200px'

        const colWidths = this.colData.map(col => {
          if (typeof col.width === 'number') {
            return 'width: ' + col.width + 'px'
          }
          return ''
        })

        return colWidths
      }
    },
    data () {
      return {
        VISIBLE,
        NID,
        TYPE_SELECT,
        bindedScroll: false,
        tableWidth: null
      }
    },
    mounted () {
      if (this.isFixed) {
        // 如果是两边固定的表格，则需要计算宽度
        this.getTableWidth()
      }
      this.bindScroll()
      if (!this.isFixed) {
        this.emitScrollHorizonPos()
      }
    },
    beforeDestroy () {
      this.unbindScroll()
    },
    watch: {
      colData () {
        if (this.isFixed) {
          this.$nextTick(this.getTableWidth)
        } else {
          this.$nextTick(this.emitScrollHorizonPos)
        }
      },
      maxHeight () {
        this.$nextTick(() => {
          EasyBar.update(this.$refs.tableBody, {})
          this.setScrollerMaxHeight()
        })
      }
    },
    methods: {
      bindScroll () {
        if (this.bindedScroll) return
        this.bindedScroll = true
        EasyBar.bind(this.$refs.tableBody)
        this.setScrollerMaxHeight()
        this.$refs.tableBody._easyBar.scrollCevBox.addEventListener('scroll', this.updateScrollPos)
      },
      unbindScroll () {
        if (!this.bindedScroll) return
        this.bindedScroll = false
        this.$refs.tableBody._easyBar.scrollCevBox.removeEventListener('scroll', this.updateScrollPos)
        EasyBar.unBind(this.$refs.tableBody)
      },
      updateScrollPos (e) {
        const syncScrollTop = this.syncScrollTop
        const scrollTop = e.target.scrollTop
        const isFixed = this.isFixed
        raf(() => {
          if (!isFixed) {
            this.$refs.tableHeader.scrollLeft = e.target.scrollLeft
            this.emitScrollHorizonPos()
          }
          if (this.syncYScroll && syncScrollTop !== scrollTop) {
            this.syncYScroll(scrollTop)
          }
        })
      },
      setScrollerMaxHeight () {
        // 设置滚动部分的最大高度
        if (this.$refs.tableBody && this.$refs.tableBody._easyBar) {
          const scroller = this.$refs.tableBody._easyBar.scrollCevBox

          if (scroller) {
            let barWidth = scroller.style.width.match(/calc\(100% \+ (\w+)px\)/)
            barWidth = !this.isFixed && barWidth ? Number(barWidth[1]) : 0

            scroller.style.maxHeight = this.maxHeight ? this.maxHeight + barWidth + 'px' : ''
            scroller.style.marginBottom = barWidth ? '-' + barWidth + 'px' : ''
          }
        }
      },
      getTableWidth () {
        /**
         * 1. 找到显示的列下标
         * 2. 找到第一行对应下标的单元格
         * 3. 获取这些单元格的宽度，计算总宽度
         */
        let total
          // 1
        let visibleIndex = []
        this.colData.forEach((col, idx) => {
          if (col[VISIBLE]) {
            visibleIndex.push(idx)
          }
        })

        // 2
        if (visibleIndex.length) {
          let tds = this.$refs.tableHeader.querySelectorAll('thead [t-table-col=true]')
          if (tds.length) {
            // 3
            total = Array.from(tds).reduce((total, td, idx) => {
              total += visibleIndex.indexOf(idx) > -1 ? td.offsetWidth : 0
              return total
            }, 0)
          } else {
            total = 0
          }
        } else {
          total = 0
        }

        this.tableWidth = total + 'px'
      },
      scrollTo (top) {
        this.$refs.tableBody._easyBar.scrollCevBox.scrollTop = top
      },
      onTrHover (idx) {
        this.$emit('trHover', idx)
      },
      onTrLeave () {
        this.$emit('trLeave')
      },
      emitScrollHorizonPos () {
        const scrollEl = this.$refs.tableBody._easyBar.scrollCevBox
        const isOnLeft = scrollEl.scrollLeft === 0
        const isOnRight = scrollEl.scrollLeft + scrollEl.clientWidth === scrollEl.scrollWidth
        this.$emit('scroll', isOnLeft, isOnRight)
      },
      updateTableWidth (width) {
        this.$refs.tableHeader.style.width = width
        this.$refs.tableBody.style.width = width
      }
    }
  }
</script>
