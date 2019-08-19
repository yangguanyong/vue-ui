  <!-- 这是render函数对应的模板  -->
  <!-- <div class="t-tabs__wrapper" :class="'t-tabs__wrapper-'+type">
    <div class="t-tabs__header">
      <template v-for="(pane, idx) in panes">
        <span class="t-tabs__header__title" :class="{'t-tabs-active': pane.name === currentName}" v-if="!pane.to" :key="idx" @click="handleTabClick(pane)">
          {{pane.label}}
        </span>
        <router-link class="t-tabs__header__title" :class="{'t-tabs-active': pane.name === currentName}" v-else :to="pane.to" :key="idx">{{pane.label}}</router-link>
      </template>
      
    </div>
    <div class="t-tabs__content">
      <slot></slot>
    </div>
  </div> -->

<script>
export default {
  render (h) {
    let { handleTabClick,  currentName} = this
    const panes = []
    let styles = {}
    if (this.panes.length === 1) {
      styles.borderRadius = '2px'
    }
    this.panes.forEach((pane, index) => {
      let node = null
      if (pane.to) {
        node = h('router-link', {
          'class': {
            't-tabs__header__title': true,
            't-tabs__header__title__1': this.type === 1,
            't-tabs__header__title__2': this.type === 2,
            't-tabs__header__title__3': this.type === 3,
            't-tabs__header__title__4': this.type === 4
            // 't-tabs-active': pane.to ? pane.to.indexOf(this.$route.path) !== -1 : pane.name === currentName 
          },
          key: index,
          directives: [
            {
              name: 't-badge',
              value: pane.badge
            }
          ],
          attrs: {
            to: pane.to,
            exact: this.exact
          },
          style: styles,
          on: {
            click: function () { handleTabClick(pane) }
          }
        }, [pane.label])
      } else {
        const i = h('i', {
          style: {
            fontStyle: 'normal'
          },
          directives: [
            {
              name: 't-badge',
              value: pane.badge
            }
          ],
        }, [pane.label])
        node = h('span', {
          'class': {
            't-tabs__header__title': true,
            't-tabs__header__title__1': this.type === 1,
            't-tabs__header__title__2': this.type === 2,
            't-tabs__header__title__3': this.type === 3,
            't-tabs__header__title__4': this.type === 4,
            't-tabs-active': pane.name === currentName
          },
          key: index,
          style: styles,
          on: {
            click: function () { handleTabClick(pane) }
          }
        }, [i])
      }
      panes.push(node)
    })

    const right = h('div', {
      'class': {
        't-tabs__header__right': true
      }
    }, [this.$slots.right])

    const header = h('div', {
      'class': {
        't-tabs__header': true,
        't-tabs__header__1': this.type === 1,
        't-tabs__header__2': this.type === 2,
        't-tabs__header__3': this.type === 3,
        't-tabs__header__4': this.type === 4,
        'router-link-wrap': !this.exact
      }
    }, [panes, right])
    const content = h('div', {
      'class': {
        't-tabs__content': true
      }
    }, [this.$slots.default])
    return h('div', {
      'class': {
        't-tabs__wrapper': true,
        't-tabs__wrapper-1': this.type === 1,
        't-tabs__wrapper-2': this.type === 2,
        't-tabs__wrapper-3': this.type === 3,
        't-tabs__wrapper-4': this.type === 4
      }
    }, [header, content])
  },
  name: 'tTabs',
  props: {
    type: {
      type: Number,
      default: 1
    },
    value: {},
    exact: {
      type: Boolean,
      default: false
    },
    vShow: {
      type: Boolean,
      default: false
    }
  },
  provide () {
    return {
      rootTabs: this
    }
  },
  data () {
    return {
      currentName: this.value,
      panes: []
    }
  },
  watch: {
    '$route': (v) => {
      // console.log(v, '$route')
    },
    panes (v) {
      // console.log(v, 'panes')
    },
    value (v) {
      this.currentName = v
    },
    currentName (v) {
      this.getTabs().forEach((node, index) => {
        const pane = node.componentOptions.propsData
        if (pane.name) {
          this.$children[index].show = pane.name === v
        } else {
          this.$children[index].show = index === v
        }
      })
    }
  },
  mounted () {
    // this.updateTabs()
  },
  methods: {
    getTabs() {
      if (this.$slots.default) {
        return this.$slots.default.filter((item) => {
          return item.componentOptions && item.componentOptions.tag === 't-tab-item'
        })
      } else {
        return []
      }
    },
    updateTabs () {
      this.panes = []
      this.getTabs().forEach((node, index) => {
        const pane = node.componentOptions.propsData
        const slots = node.componentInstance.$slots
        this.panes.push({
          name: pane.name || index,
          label: slots.label || pane.label,
          to: pane.to,
          badge: pane.badge
        })
        if (pane.to) {
          // if (pane.to.indexOf(this.$route.path) !== -1) {
          //   this.$children[index].show = true
          // }
        } else{
          if (!pane.name) {
            this.$children[index].show = index === this.currentName
          }
        }
      })
    },
    handleTabClick(tab) {
      this.currentName = tab.name
      this.$emit('input', tab.name, tab)
    }
  }
}
</script>
