<template>
  <div class="t-datepicker-timepanel">
    <table>
      <tr>
        <td>
          <div class="t-datepicker-timepanel__label">{{ t('tUi.datepicker.hour') }}</div>
          <div v-bar class="t-datepicker-timepanel__scroll" ref="hourScroll">
            <div>
              <div
                v-for="(h, idx) in hours"
                :key="idx"
                class="t-datepicker-timepanel__bar"
                :class="{
                  't-datepicker-timepanel__bar--disabled': h.isDisabled,
                  't-datepicker-timepanel__bar--active': h.isSelected
                }"
                @click="onSelect($event.target, h)">{{ h.text }}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="t-datepicker-timepanel__label">{{ t('tUi.datepicker.minute') }}</div>
          <div v-bar class="t-datepicker-timepanel__scroll" ref="minuteScroll">
            <div>
              <div
                v-for="(m, idx) in minutes"
                :key="idx"
                class="t-datepicker-timepanel__bar"
                :class="{
                  't-datepicker-timepanel__bar--disabled': m.isDisabled,
                  't-datepicker-timepanel__bar--active': m.isSelected
                }"
                @click="onSelect($event.target, m)">{{ m.text }}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="t-datepicker-timepanel__label">{{ t('tUi.datepicker.secode') }}</div>
          <div v-bar class="t-datepicker-timepanel__scroll" ref="secondScroll">
            <div>
              <div
                v-for="(s, idx) in seconds"
                :key="idx"
                class="t-datepicker-timepanel__bar"
                :class="{
                  't-datepicker-timepanel__bar--disabled': s.isDisabled,
                  't-datepicker-timepanel__bar--active': s.isSelected
                }"
                @click="onSelect($event.target, s)">{{ s.text }}</div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import setHours from 'date-fns/set_hours'
  import setMinutes from 'date-fns/set_minutes'
  import setSeconds from 'date-fns/set_seconds'
  import isSameHour from 'date-fns/is_same_hour'
  import isSameMinute from 'date-fns/is_same_minute'
  import isSameSecond from 'date-fns/is_same_second'
  import scrollIntoView from 'scroll-into-view'
  import locale from 'talebase-ui/mixins/locale'

  const genNums = function (num) {
    const res = []
    for (let i = 0; i < num; i++) {
      res.push(i)
    }
    return res
  }
  const hours = genNums(24)
  const minutes = genNums(60)
  const seconds = genNums(60)

  export default {
    mixins: [locale],
    props: {
      value: {
        type: Date,
        default () {
          return new Date()
        }
      },
      disabledTime: Object,
      disabledDate: Function
    },
    watch: {
      value () {
        this.$nextTick(this.scrollToPos)
      }
    },
    computed: {
      disabledHours () {
        return this.disabledTime && this.disabledTime.disabledHours
      },
      disabledMinutes () {
        return this.disabledTime && this.disabledTime.disabledMinutes
      },
      disabledSeconds () {
        return this.disabledTime && this.disabledTime.disabledSeconds
      },
      hours () {
        const val = this.value
        const disabledFn = this.disabledHours
        const disabledList = disabledFn instanceof Function ? disabledFn() : disabledFn instanceof Array ? disabledFn : []
        const disabledDateFn = this.disabledDate
        return hours.map(h => {
          const date = setHours(val, h)
          return {
            text: h,
            date,
            isDisabled: disabledDateFn && disabledDateFn(date) || disabledList.indexOf(h) !== -1,
            isSelected: isSameHour(val, date)
          }
        })
      },
      minutes () {
        const val = this.value
        const disabledFn = this.disabledMinutes
        const disabledList = disabledFn instanceof Function ? disabledFn() : disabledFn instanceof Array ? disabledFn : []
        const disabledDateFn = this.disabledDate
        return minutes.map(m => {
          const date = setMinutes(val, m)
          return {
            text: m,
            date,
            isDisabled: disabledDateFn && disabledDateFn(date) || disabledList.indexOf(m) !== -1,
            isSelected: isSameMinute(val, date)
          }
        })
      },
      seconds () {
        const val = this.value
        const disabledFn = this.disabledSeconds
        const disabledList = disabledFn instanceof Function ? disabledFn() : disabledFn instanceof Array ? disabledFn : []
        const disabledDateFn = this.disabledDate
        return seconds.map(s => {
          const date = setSeconds(val, s)
          return {
            text: s,
            date,
            isDisabled: disabledDateFn && disabledDateFn(date) || disabledList.indexOf(s) !== -1,
            isSelected: isSameSecond(val, date)
          }
        })
      }
    },
    mounted () {
      this.scrollToPos()
    },
    methods: {
      onSelect (el, data) {
        if (data.isDisabled) return
        this.$emit('select', data.date)
      },
      scrollToPos () {
        [this.$refs.hourScroll, this.$refs.minuteScroll, this.$refs.secondScroll].forEach(el => {
          const tar = el.querySelector('.t-datepicker-timepanel__bar--active')
          scrollIntoView(tar, {
            time: 100,
            validTarget: function (target, parentsScrolled) {
              // 只滚动一层元素，不用滚动到最外层 app-frame__body
              return parentsScrolled < 1
            },
            align: {
              top: 0
            }
          })
        })
      }
    }
  }
</script>
