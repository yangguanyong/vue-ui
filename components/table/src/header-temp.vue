<template>
  <div class="t-table__header" ref="tableHeader">
    <table>
      <colgroup>
        <col v-for="(w, wIdx) in widths" :key="w + wIdx" :style="'width: ' + w">
      </colgroup>
      <thead>
      <tr v-for="row in headerData" :key="row.id">
        <th v-for="(col, cIdx) in row.row" :key="cIdx" :colspan="col.cols" :rowspan="col.rows" :style="{visibility: !col[VISIBLE] && 'hidden'}">{{ col.label }}</th>
      </tr>
      </thead>
    </table>
  </div>
</template>

<script>
  import { VISIBLE } from "./utils"

  export default {
    props: {
      headerData: Array,
      colData: Array
    },
    data () {
      return {
        VISIBLE
      }
    },
    computed: {
      widths () {
        let customWidthTotal = 0
        let customWidthCount = 0
        this.colData.forEach(col => {
          if (typeof col.width === 'number') {
            customWidthTotal += col.width
            customWidthCount += 1
          }
        })

        const resetWidth = 'calc((100% - ' + customWidthTotal + 'px) / ' + (this.colData.length - customWidthCount) + ')'

        return this.colData.map(col => {
          if (typeof col.width === 'number') {
            return col.width + 'px'
          }
          return resetWidth
        })
      }
    }
  }
</script>