<template>
  <div :class="{ 't-step-type1': type === 1, 't-step-type2': type === 2 }">
    <div class="t-step" :style="{ 'float': float ? 'left' : 'none' }">
      <div class="t-step__main">
        <span class="t-step__label" v-if="label.length > 0">{{ label }}
          <span class="arrow3" v-if="type === 1"></span>
          <span class="arrow4" v-if="type === 1"></span>
        </span>
        <slot></slot>
      </div>
      <div class="t-step__operation" v-if="!float">
        <slot name="operation"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 't-step',
    props: {
      type: {
        type: Number,
        default: 1
      },
      float: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      },
      active: {
        type: Number,
        default: 0
      }
    },
    watch: {
      activeStep (n) {    // activeStep修改后通知slot与外部
        this.items.forEach((item, idx) => {
          item.currentIndex = n
        })
        this.$emit('update:active', this.activeStep)
      },
      active () {   // active被修改后activeStep可以被响应
        this.isSet = false
      }
    },
    data () {
      return {
        items: [],
        idxArr: [],
        originItems: [],
        isSet: false,
        activeIdx: null
      }
    },
    mounted () {
      this.originItems.forEach(i => {
        i.type = this.type
      })
    },
    computed: {
      activeStep () {
        // 在组件初始化状态下会对比一次slot的URL，将命中的步骤设为激活状态，后续可通过外部修改active更改
        const n = this.isSet ? this.activeIdx : this.active
        return n
      },
      hasLabel () {
        return this.label.length
      }
    },
    methods: {
      sortItem () {   // 排序
        const itemsTemp = []
        this.originItems.forEach(item => {
          if (item.visible === true) {
            itemsTemp.push(item)
          }
        })
        this.items = itemsTemp
        this.items.forEach((item, idx) => {
          item.index = idx
          item.currentIndex = this.activeStep
        })
      },
      storeItem (item) {    // 组件初始化，将所有slot（无论是否展示）收纳进数组
        this.originItems.push(item)
        this.sortItem()
      },
      setActive (item) {    // 初始化时比对一次slot的URL
        if (item.visible) {
          this.isSet = true
          this.activeIdx = item.index
        }
      }
    }
  }
</script>
