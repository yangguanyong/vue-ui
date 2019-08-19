<template>
  <div class="t-datepicker t-datepicker-range t-datepicker__popper">
    <div class="t-datepicker-range__inputs">
      <inputs
        class="t-datepicker-range__input"
        :value="val[0]"
        :dateFormat="dateFormat"
        :timeFormat="timeFormat"
        :isLockDate="isLockDateInput"
        :isEditing="editIndex === 0"
        :isLockTime="isLockTime"
        :disabledDate="disabledDate"
        :showTime="showTime"
        :disabledTime="disabledTimeLeft"
        @dateChange="d => onSingleChange(0, d)"
        @dateFocus="changeDateIndex(0)"
        @timeFocus="panelType = 'time'"
      />
      <div class="t-datepicker-range__input-sp"> - </div>
      <inputs
        class="t-datepicker-range__input"
        :value="val[1]"
        :dateFormat="dateFormat"
        :timeFormat="timeFormat"
        :isLockDate="isLockDateInput"
        :isEditing="editIndex === 1"
        :isLockTime="isLockTime"
        :disabledDate="disabledDate"
        :showTime="showTime"
        :disabledTime="disabledTimeRight"
        @dateChange="d => onSingleChange(1, d)"
        @dateFocus="changeDateIndex(1)"
        @timeFocus="panelType = 'time'"
      />
    </div>
    <div class="t-datepicker-range__body">
      <div class="t-datepicker-range__date-view" v-show="panelType === 'day'">
        <div class="t-datepicker-range__date-panel">
          <panel-wrapper
            panel-type="day"
            :display-date="displayDateL"
            :navi-options="{'show-right': false}"
            :panel-options="{'value': val, 'disabledDate': disabledDate}"
            @toMonth="onToMonth"
            @toYear="onToYear"
            @prevYear="onPrevYear"
            @prevMonth="onPrevMonth"
            @select="onDateSelect"
          />
        </div>
        <div class="t-datepicker-range__date-panel">
          <panel-wrapper
            panel-type="day"
            :display-date="displayDateR"
            :navi-options="{'show-left': false}"
            :panel-options="{'value': val, 'disabledDate': disabledDate}"
            @toMonth="onToMonth"
            @toYear="onToYear"
            @nextYear="onNextYear"
            @nextMonth="onNextMonth"
            @select="onDateSelect"
          />
        </div>
      </div>
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
        <div class="t-datepicker-range__time-panel">
          <panelWrapper
            panel-type="time"
            :displayDate="displayDate"
            :panel-options="{'value': val[0], 'disabledTime': disabledTimeLeft}"
            @select="d => onSingleChange(0, d)"
          />
        </div>
        <div class="t-datepicker-range__time-panel">
          <panelWrapper
            panel-type="time"
            :displayDate="displayDate"
            :panel-options="{'value': val[1], 'disabledTime': disabledTimeRight}"
            @select="d => onSingleChange(1, d)"
          />
        </div>
      </div>
    </div>
    <div class="t-datepicker__footer">
      <btn tag="span" size="2" type="2" @click="onReset" v-if="canReset">{{ t('tUi.datepicker.clear') }}</btn>
      <btn tag="span" size="2" :disabled="!isValid" @click="onConfirm">{{ t('tUi.datepicker.confirm') }}</btn>
    </div>
  </div>
</template>

<script>
  import naviBar from './navi-bar'
  import panelWrapper from './panel-wrapper'
  import inputs from './inputs'
  import parse from 'date-fns/parse'
  import addMonths from 'date-fns/add_months'
  import subMonths from 'date-fns/sub_months'
  import startOfDay from 'date-fns/start_of_day'
  import format from 'date-fns/format'
  import btn from '../../button'
  import locale from 'talebase-ui/mixins/locale'

  export default {
    mixins: [locale],
    props: {
      value: {
        type: Array,
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
      },
      /**
       * 是否可以单选时间
       * 默认需要选择两个时间才生效
       */
      loose: Boolean
    },
    components: {
      naviBar,
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
        editIndex: 0,
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss'
      }
    },
    computed: {
      displayDateInDay () {
        const index = this.editIndex
        const val = this.val[index]
        if (val !== null) {
          const delta = val - startOfDay(val)
          return new Date(startOfDay(this.displayDate) - 0 + delta)
        }
        return this.displayDate
      },
      displayDateL () {
        return this.displayDateInDay
      },
      displayDateR () {
        return addMonths(this.displayDateInDay, 1)
      },
      isLockDateInput () {
        // return this.val[0] === null || this.val[1] === null
        return false
      },
      isLockTime () {
        const [v0, v1] = this.val
        return this.loose ? v0 === null && v1 === null : v0 === null || v1 === null
      },
      disabledTimeLeft () {
        if (this.disabledTime) {
          return this.disabledTime(this.val, 'start')
        }
        return null
      },
      disabledTimeRight () {
        if (this.disabledTime) {
          return this.disabledTime(this.val, 'end')
        }
        return null
      },
      isValid () {
        const v0 = this.val[0]
        const v1 = this.val[1]

        const isValid = isLoose => {
          return isLoose ? canReset => {
            return canReset ? () => {
              // loose + can reset
              return true
            } : (v0, v1) => {
              // loose + can't reset
              return v0 !== null || v1 !== null
            }
          } : canReset => {
            return canReset ? (v0, v1) => {
              // no loose + can reset
              return v0 === null && v1 === null || v0 !== null && v1 !== null
            } : (v0, v1) => {
              // no loose + can't reset
              return v0 !== null && v1 !== null
            }
          }
        }

        return isValid(this.loose)(this.canReset)(v0, v1)
      },
      format () {
        return this.showTime ? this.dateFormat + ' ' + this.timeFormat : this.dateFormat
      }
    },
    methods: {
      getValue () {
        if (this.isValid) {
          return this.val.map(item => {
            return item ? format(item, this.format) : null
          })
        }
        return this.value
      },
      init () {
        this.val = this.trans(this.value)
        this.displayDate = this.transD(this.val)
        this.panelType = 'day'
        this.editIndex = 0
      },
      trans (val) {
        val = val === null ? [] : val
        return [
          val[0] ? parse(val[0]) : null,
          val[1] ? parse(val[1]) : null
        ]
      },
      transD (val) {
        return val[0] ? val[0] : val[1] ? val[1] : startOfDay(new Date())
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
        this.displayDate = subMonths(date, 1)
      },
      onPrevMonth (date) {
        this.displayDate = date
      },
      onNextMonth (date) {
        this.displayDate = subMonths(date, 1)
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
        let val = this.val.slice()
        if (val[0] === null && val[1] === null) {
          if (this.loose) {
            val[this.editIndex] = date
          } else {
            val[0] = date
          }
        } else if (val[0] === null) {
          val[0] = date
        } else if (val[1] === null) {
          val[1] = date
        } else {
          // 有起始和结束值
          if (this.editIndex === 0 && date > val[1]) {
            val = [date, null]
          } else if (this.editIndex === 1 && date < val[0]) {
            val = [null, date]
          } else {
            val[this.editIndex] = date
          }
        }

        if (val[0] !== null && val[1] !== null) {
          val = val.sort((v1, v2) => v1 - v2)
          this.displayDate = this.transD(val)
        }

        this.val = val
      },
      changeDateIndex (index) {
        this.panelType = 'day'
        this.editIndex = index

        const val = this.val[index]
        if (val !== null) {
          const delta = val - startOfDay(val)
          this.displayDate = new Date(startOfDay(this.displayDate) - 0 + delta)
        }
      },
      onReset () {
        this.val = [null, null]
      },
      onSingleChange (idx, date) {
        let val = this.val.slice()
        if (date === null) {
          val.splice(idx, 1, date)
        } else {
          if (idx === 0 && date > val[1]) {
            val = [date, null]
          } else if (idx === 1 && date < val[0]) {
            val = [null, date]
          } else {
            val.splice(idx, 1, date)
          }
        }

        this.val = val
        if (val[0] !== null && val[1] !== null) {
          this.displayDate = this.transD(val)
        }
      },
      onConfirm () {
        if (this.isValid) {
          this.$emit('select', this.val.map(item => {
            return item ? format(item, this.format) : null
          }))
        }
      }
    },
    mounted () {
    }
  }
</script>
