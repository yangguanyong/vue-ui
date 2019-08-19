<template>
  <div class="t-datepicker-yearpanel">
    <table>
      <tr v-for="(row, idx) in viewData" :key="idx">
        <td v-for="(year, yearIdx) in row" :key="yearIdx">
          <div
            class="t-datepicker-panelbtn"
            :class="{
              't-datepicker-panelbtn--selected': year.isSelected,
              't-datepicker-panelbtn--disabled': year.isDisabled
            }"
            @click="onClick(year)"
          >{{ year.text }}</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import endOfYear from 'date-fns/end_of_year'
  import addDays from 'date-fns/add_days'
  import getYear from 'date-fns/get_year'
  import addYears from 'date-fns/add_years'
  import subYears from 'date-fns/sub_years'
  import format from 'date-fns/format'
  import isSameYear from 'date-fns/is_same_year'
  import setMonth from 'date-fns/set_month'
  import setDate from 'date-fns/set_date'

  export default {
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
      viewYears () {
        const year = getYear(this.datum)
        const delta = year % 10
        const start = subYears(this.datum, delta)

        const res = []
        for (let i = 0; i < 10; i++) {
          res.push(addYears(start, i))
        }

        return res
      },
      viewData () {
        const data = this.viewYears.map(date => {
          return {
            text: format(date, 'YYYY'),
            date: date,
            isSelected: this.isSameYear(date),
            isDisabled: this.isDisabled(date)
          }
        })

        data.push({
          text: '>',
          date: addYears(data[data.length - 1].date, 1),
          isSelected: false,
          isDisabled: false,
          navi: 'nextYear'
        })

        data.unshift({
          text: '<',
          date: subYears(data[0].date, 1),
          isSelected: false,
          isDisabled: false,
          navi: 'prevYear'
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
        const end = endOfYear(date)
        date = setMonth(setDate(date, 1), 1)

        while (this.disabledDate(date)) {
          date = addDays(date, 1)
          if (date > end) {
            return true
          }
        }
        return false
      },
      isSameYear (date) {
        const val = this.value
        if (val instanceof Date) {
          return isSameYear(date, val)
        } else if (val instanceof Array) {
          return val[0] ? isSameYear(val[0], date) : val[1] ? isSameYear(val[1], date) : false
        }
        return false
      },
      onClick (data) {
        if (!data.isDisabled) {
          if (data.navi) {
            this.$emit(data.navi, data.date)
          } else {
            this.$emit('select', data.date)
          }
        }
      }
    }
  }
</script>
