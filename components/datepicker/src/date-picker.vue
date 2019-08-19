<template>
  <div class="t-datepicker t-datepicker-date t-datepicker__popper">
    <div class="t-datepicker-range__inputs">
      <inputs
        :value="val"
        :dateFormat="dateFormat"
        :timeFormat="timeFormat"
        :isLockDate="isLockDateInput"
        :isLockTime="isLockTime"
        :disabledDate="disabledDate"
        :showTime="showTime"
        :disabledTime="disabledTimeLeft"
        @dateChange="onSingleChange"
        @dateFocus="panelType = 'day'"
        @timeFocus="panelType = 'time'"
      />
    </div>
    <div>
      <panel-wrapper
        v-show="panelType === 'day'"
        panel-type="day"
        :display-date="displayDateInDay"
        :panel-options="{'value': val, 'disabledDate': disabledDate}"
        @toMonth="onToMonth"
        @toYear="onToYear"
        @prevYear="onPrevYear"
        @prevMonth="onPrevMonth"
        @nextYear="onNextYear"
        @nextMonth="onNextMonth"
        @select="onDateSelect"
      />
      <div v-if="panelType === 'month' || panelType === 'year'">
        <panelWrapper
          :panel-type="panelType"
          :displayDate="displayDate"
          :panel-options="{'value': val, 'disabledDate': disabledDate}"
          @toYear="onToYear"
          @prevYear="date => displayDate = date"
          @nextYear="date => displayDate = date"
          @select="onRangeSelect"
        />
      </div>
      <div v-if="panelType === 'time'" class="t-datepicker-range__time-view">
        <panelWrapper
          panel-type="time"
          :displayDate="displayDate"
          :panel-options="{'value': val, 'disabledTime': disabledTimeLeft, 'disabledDate': disabledDate}"
          @select="onSingleChange"
        />
      </div>
    </div>
    <div class="t-datepicker__footer">
      <span class="t-datepicker__now" style="margin-right: 5px;" v-if="showNow" @click="onNow">{{ t('tUi.datepicker.now') }}</span>
      <btn tag="span" type="2" size="2" @click="onReset" v-if="canReset">{{ t('tUi.datepicker.clear') }}</btn>
      <btn tag="span" size="2" :disabled="!isValid" :class="!isValid && 't-btn--disabled'" @click="onConfirm">{{ t('tUi.datepicker.confirm') }}</btn>
    </div>
  </div>
</template>

<script>
  import btn from '../../button'
  import panelWrapper from './panel-wrapper'
  import inputs from './inputs'
  import parse from 'date-fns/parse'
  import startOfDay from 'date-fns/start_of_day'
  import format from 'date-fns/format'
  import getHours from 'date-fns/get_hours'
  import getMinutes from 'date-fns/get_minutes'
  import getSeconds from 'date-fns/get_seconds'
  import locale from 'talebase-ui/mixins/locale'

  export default {
    mixins: [locale],
    props: {
      value: {
        type: String,
        default () {
          return null
        }
      },
      disabledDate: Function,
      disabledTime: Function,
      showTime: Boolean,
      canReset: {
        type: Boolean,
        default: true
      }
    },
    components: {
      panelWrapper,
      inputs,
      btn
    },
    data () {
      const val = this.trans(this.value)
      return {
        val,
        displayDate: this.transD(val),
        panelType: 'day',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss'
      }
    },
    watch: {
      panelType () {
        // 防止panel切换时对不齐问题
        if (this.$parent.$options.name === 't-datepicker' && this.$parent.update) {
          this.$parent.update()
        }
      }
    },
    computed: {
      displayDateInDay () {
        const val = this.val
        if (val !== null) {
          const delta = val - startOfDay(val)
          return new Date(startOfDay(this.displayDate) - 0 + delta)
        }
        return this.displayDate
      },
      isLockDateInput () {
        // return this.val[0] === null || this.val[1] === null
        return false
      },
      isLockTime () {
        return this.val === null
      },
      disabledTimeLeft () {
        if (this.disabledTime) {
          return this.disabledTime(this.val)
        }
        return null
      },
      isValid () {
        return this.canReset || Boolean(this.val)
      },
      format () {
        return this.showTime ? this.dateFormat + ' ' + this.timeFormat : this.dateFormat
      },
      showNow () {
        return this.showTime
      }
    },
    methods: {
      getValue () {
        if (this.isValid) {
          return this.val ? format(this.val, this.format) : null
        }
        return this.value
      },
      init () {
        this.val = this.trans(this.value)
        this.displayDate = this.transD(this.val)
        this.panelType = 'day'
      },
      trans (val) {
        return val ? parse(val) : null
      },
      transD (val) {
        return val || startOfDay(new Date())
      },
      onToMonth () {
        this.panelType = 'month'
      },
      onToYear () {
        this.panelType = 'year'
      },
      onPrevYear (date) {
        this.displayDate = date
      },
      onNextYear (date) {
        this.displayDate = date
      },
      onPrevMonth (date) {
        this.displayDate = date
      },
      onNextMonth (date) {
        this.displayDate = date
      },
      onRangeSelect (date) {
        this.displayDate = date
        if (this.panelType === 'month') {
          this.panelType = 'day'
        } else if (this.panelType === 'year') {
          this.panelType = 'month'
        }
      },
      onDateSelect (date) {
        if (date !== null) {
          this.displayDate = this.transD(date)
        }

        this.val = date
      },
      onReset () {
        this.val = null
      },
      onSingleChange (date) {
        this.val = date
        if (date !== null) {
          this.displayDate = this.transD(date)
        }
      },
      onConfirm () {
        if (this.isValid) {
          this.$emit('select', this.val ? format(this.val, this.format) : null)
        }
      },
      onNow () {
        const date = new Date()
        if (this.disabledDate && this.disabledDate(date)) {
          return
        }
        if (this.disabledTimeLeft) {
          const h = getHours(date)
          const m = getMinutes(date)
          const s = getSeconds(date)
          if (
            this.disabledTimeLeft.disabledHours && this.disabledTimeLeft.disabledHours().indexOf(h) !== -1 ||
            this.disabledTimeLeft.disabledMinutes && this.disabledTimeLeft.disabledMinutes().indexOf(m) !== -1 ||
            this.disabledTimeLeft.disabledSeconds && this.disabledTimeLeft.disabledSeconds().indexOf(s) !== -1
          ) {
            return
          }
        }
        this.val = date
        this.displayDate = this.transD(date)
      }
    },
    mounted () {
    }
  }
</script>
