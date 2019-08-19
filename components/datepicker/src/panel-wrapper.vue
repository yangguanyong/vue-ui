<template>
  <div>
    <navi-bar v-bind="naviOpts" v-on="$listeners" />
    <date-panel v-if="panelType === 'day'" v-bind="panelOpts" v-on="$listeners" />
    <month-panel v-if="panelType === 'month'" v-bind="panelOpts" v-on="$listeners" />
    <year-panel v-if="panelType === 'year'" v-bind="panelOpts" v-on="$listeners" />
    <time-panel v-if="panelType === 'time'" v-bind="panelOpts" v-on="$listeners" />
  </div>
</template>

<script>
  import datePanel from './date-panel'
  import monthPanel from './month-panel'
  import yearPanel from './year-panel'
  import naviBar from './navi-bar'
  import timePanel from './time-panel'

  export default {
    components: {
      datePanel,
      monthPanel,
      yearPanel,
      naviBar,
      timePanel
    },
    props: {
      panelType: {
        type: String,
        default: 'year'
      },
      displayDate: {
        type: Date,
        default () {
          return null
        }
      },
      naviOptions: {
        type: Object,
        default () {
          return {}
        }
      },
      panelOptions: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      naviOpts () {
        return Object.assign({}, this.naviOptions, {
          'displayDate': this.displayDate,
          'type': this.panelType
        })
      },
      panelOpts () {
        return Object.assign({}, this.panelOptions, {
          'displayDate': this.displayDate
        })
      }
    }
  }
</script>
