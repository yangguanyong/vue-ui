<template>
    <div class="t-datepicker-datepanel">
      <table>
        <tr class="t-datepicker-datepanel__week">
          <td>{{ t('tUi.datepicker.week1') }}</td>
          <td>{{ t('tUi.datepicker.week2') }}</td>
          <td>{{ t('tUi.datepicker.week3') }}</td>
          <td>{{ t('tUi.datepicker.week4') }}</td>
          <td>{{ t('tUi.datepicker.week5') }}</td>
          <td>{{ t('tUi.datepicker.week6') }}</td>
          <td>{{ t('tUi.datepicker.week7') }}</td>
        </tr>
        <tr v-for="(week, idx) in viewData" :key="idx" class="t-datepicker-datepanel__day">
          <td v-for="(day, dayIdx) in week" :key="dayIdx" :title="day.title">
            <div
              class="t-datepicker-panelbtn"
              :class="{
                't-datepicker-panelbtn--not-current': !day.isCurrentMonth,
                't-datepicker-panelbtn--today': day.isToday,
                't-datepicker-panelbtn--in-range': day.isCurrentMonth && day.isInRange,
                't-datepicker-panelbtn--selected': day.isCurrentMonth && day.isSelected,
                't-datepicker-panelbtn--disabled': day.isDisabled
              }"
              @click="onClick(day)"
            >{{ day.text }}</div>
          </td>
        </tr>
      </table>
    </div>
</template>

<script>
  import addDays from 'date-fns/add_days'
  import setISODay from 'date-fns/set_iso_day'
  import isMonday from 'date-fns/is_monday'
  import isSameMonth from 'date-fns/is_same_month'
  import isSameDay from 'date-fns/is_same_day'
  import setDate from 'date-fns/set_date'
  import format from 'date-fns/format'
  import isToday from 'date-fns/is_today'
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
      format: {
        type: String,
        default: 'YYYY-MM-DD'
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
        // 日以下的时间全部设为0
        return this.displayDate
      },
      viewDays () {
        let start = setDate(this.datum, 1)

        if (!isMonday(start)) {
          // 日历第一天为周一，获取周一的那一天
          start = setISODay(start, 1, { weekStartsOn: 1 })
        }

        const res = []
        // 6周
        for (let i = 0; i < 42; i++) {
          res.push(addDays(start, i))
        }

        return res
      },
      viewData () {
        const data = this.viewDays.map(day => {
          const isCurrentMonth = isSameMonth(day, this.datum)
          const isTod = isToday(day)
          return {
            date: day,
            title: format(day, this.format),
            text: isCurrentMonth && isTod ? this.t('tUi.datepicker.today') : day.getDate(),
            isToday: isCurrentMonth && isTod,
            isCurrentMonth,
            isSelected: this.isSameDay(day),
            isDisabled: this.disabledDate && this.disabledDate(day),
            isInRange: this.isInRange(day)
          }
        })

        // 分割成6周
        const res = []
        for (let i = 0; i < 6; i++) {
          res.push(data.slice(i * 7, i * 7 + 7))
        }
        return res
      }
    },
    methods: {
      isSameDay (date) {
        if (this.value instanceof Date) {
          return isSameDay(date, this.value)
        } else if (this.value instanceof Array) {
          return isSameDay(date, this.value[0]) || isSameDay(date, this.value[1])
        }
        return false
      },
      isInRange (date) {
        if (this.value instanceof Array && this.value[0] && this.value[1]) {
          return date >= this.value[0] && date <= this.value[1]
        } else {
          return false
        }
      },
      onClick (data) {
        if (!data.isDisabled) {
          this.$emit('select', data.date)
        }
      }
    }
  }
</script>

<style scoped>

</style>
