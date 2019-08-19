<template>
  <div class="t-datepicker-monthpanel">
    <table>
      <tr v-for="(item, idx) in viewData" :key="idx">
        <td v-for="(month, monthIdx) in item" :key="monthIdx">
          <div
            class="t-datepicker-panelbtn"
            :class="{
              't-datepicker-panelbtn--selected': month.isSelected,
              't-datepicker-panelbtn--disabled': month.isDisabled
            }"
            @click="onClick(month)"
          >{{ month.text }}</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import setMonth from 'date-fns/set_month'
  import format from 'date-fns/format'
  import isSameMonth from 'date-fns/is_same_month'
  import endOfMonth from 'date-fns/end_of_month'
  import addDays from 'date-fns/add_days'
  import setDate from 'date-fns/set_date'
  import locale from 'talebase-ui/mixins/locale'

  export default {
    mixins: [locale],
    props: {
      displayDate: {
        type: Date,
        default () {
          return null
        }
      },
      value: {
        type: [Date, Array],
        default () {
          return null
        }
      },
      disabledDate: Function
    },
    computed: {
      datum () {
        return this.displayDate
      },
      viewMonths () {
        const res = []
        for (let i = 0; i < 12; i++) {
          res.push(setMonth(this.datum, i))
        }
        return res
      },
      viewData () {
        const data = this.viewMonths.map(date => {
          return {
            date: date,
            text: this.t(`tUi.datepicker.month${format(date, 'M')}`),
            isSelected: this.isSameMonth(date, this.value),
            isDisabled: this.isDisabled(date)
          }
        })

        const res = []
        for (let i = 0; i < 4; i++) {
          res.push(data.slice(i * 3, i * 3 + 3))
        }

        return res
      }
    },
    mounted () {
    },
    methods: {
      isDisabled (date) {
        if (!this.disabledDate) return false
  
        let start = setDate(date, 1)
        const end = endOfMonth(date)
        while (this.disabledDate(start)) {
          start = addDays(start, 1)
          if (start > end) {
            return true
          }
        }
        return false
      },
      isSameMonth (date) {
        const val = this.value
        if (val instanceof Date) {
          return isSameMonth(val, date)
        } else if (val instanceof Array) {
          return val[0] ? isSameMonth(val[0], date) : val[1] ? isSameMonth(val[1]) : false
        }
        return false
      },
      onClick (data) {
        if (!data.isDisabled) {
          this.$emit('select', data.date)
        }
      }
    }
  }
</script>
