<template>
  <div class="t-datepicker-navibar">
    <div class="t-datepicker-navibar__left" v-if="showLeft">
      <span class="t-datepicker-navibar__btn" @click="onPrevYear" :title="type === 'year' ? t('tUi.datepicker.prevYear2') : t('tUi.datepicker.prevYear')">
        <span class="t-icon-arrow-left-double"></span>
      </span>
      &ensp;
      <span class="t-datepicker-navibar__btn" v-if="showMonthNavi" @click="onPrevMonth" :title="t('tUi.datepicker.prevMonth')">
        <span class="t-icon-arrow-left"></span>
      </span>
    </div>
    <div class="t-datepicker-navibar__right" v-if="showRight">
      <span class="t-datepicker-navibar__btn" v-if="showMonthNavi" @click="onNextMonth" :title="t('tUi.datepicker.nextMonth')">
        <span class="t-icon-arrow-right"></span>
      </span>
      &ensp;
      <span class="t-datepicker-navibar__btn" @click="onNextYear" :title="type === 'year' ? t('tUi.datepicker.nextYear2') : t('tUi.datepicker.nextYear')">
        <span class="t-icon-arrow-right-double"></span>
      </span>
    </div>
    <div class="t-datepicker-navibar__center">
      <span class="t-datepicker-navibar__btn" v-if="showYear" @click="onYear">{{ year }}</span>
      <span class="t-datepicker-navibar__btn" v-if="showMonth" @click="onMonth">{{ month }}</span>
    </div>
  </div>
</template>

<script>
  import format from 'date-fns/format'
  import getYear from 'date-fns/get_year'
  import subYears from 'date-fns/sub_years'
  import addYears from 'date-fns/add_years'
  import addMonths from 'date-fns/add_months'
  import subMonths from 'date-fns/sub_months'
  import locale from 'talebase-ui/mixins/locale'

  export default {
    mixins: [locale],
    props: {
      displayDate: {
        type: Date,
        default () {
          return new Date()
        }
      },

      // year, month, day
      type: {
        type: String,
        default: 'day'
      },

      showLeft: {
        type: Boolean,
        default: true
      },
      showRight: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      showMonthNavi () {
        return this.type === 'day'
      },
      showMonth () {
        return this.type === 'day'
      },
      showYear () {
        return this.type === 'year' || this.type === 'month' || this.type === 'day'
      },
      month () {
        return this.t(`tUi.datepicker.month${format(this.displayDate, 'M')}`)
      },
      year () {
        if (this.type === 'year') {
          const year = getYear(this.displayDate)
          const delta = year % 10
          const start = subYears(this.displayDate, delta)
          const end = addYears(start, 9)
          return format(start, 'YYYY') + ' - ' + format(end, 'YYYY')
        }
        return this.t('tUi.datepicker.year', [format(this.displayDate, 'YYYY')])
      }
    },
    methods: {
      onPrevMonth () {
        this.$emit('prevMonth', subMonths(this.displayDate, 1))
      },
      onNextMonth () {
        this.$emit('nextMonth', addMonths(this.displayDate, 1))
      },
      onPrevYear () {
        this.$emit('prevYear', subYears(this.displayDate, this.type === 'year' ? 10 : 1))
      },
      onNextYear () {
        this.$emit('nextYear', addYears(this.displayDate, this.type === 'year' ? 10 : 1))
      },
      onYear () {
        if (this.type !== 'year') {
          this.$emit('toYear')
        }
      },
      onMonth () {
        this.$emit('toMonth')
      }
    }
  }
</script>
