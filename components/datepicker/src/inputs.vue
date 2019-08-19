<template>
  <div class="t-datepicker-inputs">
    <table>
      <tr>
        <td>
          <form-input
            :class="isEditing && !isLockDate && 't-datepicker-inputs__date-editing'"
            :value="dateText"
            :placeholder="dateFormat"
            :disabled="isLockDate"
            :size="2"
            ban-form-event
            @change="onDateChange"
            @keydown.13="onDateEnter"
            @focus="$emit('dateFocus')"
          />
        </td>
        <td v-if="showTime">
          <form-input
            :value="timeText"
            :disabled="isLockTime"
            :placeholder="timeFormat"
            :size="2"
            ban-form-event
            @change="onTimeChange"
            @keydown.13="onTimeEnter"
            @focus="$emit('timeFocus')"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import formInput from '../../input'
  import format from 'date-fns/format'
  import parse from 'date-fns/parse'
  import isValid from 'date-fns/is_valid'
  import startOfDay from 'date-fns/start_of_day'
  import getHours from 'date-fns/get_hours'
  import getMinutes from 'date-fns/get_minutes'
  import getSeconds from 'date-fns/get_seconds'

  export default {
    components: {
      formInput
    },
    props: {
      value: {
        type: Date,
        default () {
          return null
        }
      },
      dateFormat: String,
      timeFormat: String,

      // 是否显示时间
      showTime: Boolean,

      // 是否禁止编辑日期
      isLockDate: Boolean,

      isLockTime: Boolean,

      // 是否在操作这个时间
      isEditing: Boolean,

      disabledDate: Function,

      disabledTime: Object
    },
    computed: {
      dateText () {
        return this.value ? format(this.value, this.dateFormat) : null
      },
      timeText () {
        return this.value ? format(this.value, this.timeFormat) : null
      }
    },
    methods: {
      onDateChange (e) {
        const val = e.target.value
        this.dateChangeHandler(val, e.target)
      },
      onDateEnter (e) {
        this.dateChangeHandler(e.target.value, e.target)
        e.preventDefault()
      },
      dateChangeHandler (val, input) {
        val = val.trim()
        if (val === '') {
          this.$emit('dateChange', null)
        } else if (isValid(new Date(val))) {
          const date = parse(val)
          if (!this.disabledDate || !this.disabledDate(date)) {
            this.$emit('dateChange', date)
          } else {
            input.value = this.dateText
          }
        } else {
          input.value = this.dateText
        }
      },
      onTimeChange (e) {
        const val = e.target.value
        this.timeChangeHandler(val, e.target)
      },
      onTimeEnter (e) {
        this.timeChangeHandler(e.target.value, e.target)
        e.preventDefault()
      },
      timeChangeHandler (val, input) {
        val = val.trim()
        if (val === '') {
          val = startOfDay(this.value)
          if (this.timeIsValid(val)) {
            this.$emit('dateChange', val)
          } else {
            input.value = this.timeText
          }
        } else if (isValid(new Date(this.dateText + ' ' + val))) {
          const date = parse(this.dateText + ' ' + val)
          if (this.timeIsValid(date)) {
            this.$emit('dateChange', date)
          } else {
            input.value = this.timeText
          }
        } else {
          input.value = this.timeText
        }
      },
      timeIsValid (date) {
        if (this.disabledDate) {
          return !this.disabledDate(date)
        } else if (this.disabledTime) {
          const h = getHours(date)
          const m = getMinutes(date)
          const s = getSeconds(date)
          return (!this.disabledTime.disabledHours || this.disabledTime.disabledHours().indexOf(h) === -1) &&
            (!this.disabledTime.disabledMinutes || this.disabledTime.disabledMinutes().indexOf(m) === -1) &&
            (!this.disabledTime.disabledSeconds || this.disabledTime.disabledSeconds().indexOf(s) === -1)
        } else {
          return true
        }
      }
    }
  }
</script>
