<template>
  <div class="t-table__body" :style="bodyHeight" ref="tableBody">
    <div>
      <table>
        <colgroup>
          <col v-for="(w, wIdx) in widths" :style="'width: ' + w" :key="wIdx">
        </colgroup>
        <tbody>
        <tr v-for="(row, rIdx) in tableData" :key="rIdx">
          <cell v-for="col in colData" :key="col[NID]" :data="row" :col-data="col" />
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      height: Number
    }
  }
</script>