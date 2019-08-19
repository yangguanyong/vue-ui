<template>
  <div class="t-pagin">
    <div class="t-pagin__btns">
      <span class="t-pagin__btn t-icon-arrow-left" @click="!prevPageBtnDisabled && toPage(displayCurrentPage - 1)" :class="{'t-pagin__btn--disabled': prevPageBtnDisabled}" ></span>
      <span class="t-pagin__btn" v-if="isShowFirstPageBtn" :class="{'t-pagin__btn--active': displayCurrentPage === 1}" @click="toPage(1)" key="firstPage">1</span>
      <span class="t-pagin__btn t-pagin__btn--hover" v-if="isShowPreDots" @click="toPage(-1)" key="prevDots" @mouseenter="showText = 1" @mouseleave="showText = 3">
        <span v-if="showText === 1" style="font-family:consolas"><<</span>
        <span v-else>{{ preDotsText }}</span>
      </span>
      <span class="t-pagin__btn" v-for="page in middleArea" :key="page" @click="toPage(page)" :class="{'t-pagin__btn--active': displayCurrentPage === page}">{{ page }}</span>
      <span class="t-pagin__btn t-pagin__btn--hover" v-if="isShowAfterDots" @click="toPage(-2)" key="afterDots" @mouseenter="showText = 2" @mouseleave="showText = 3">
        <span v-if="showText === 2" style="font-family:consolas">>></span>
        <span v-else>{{ afterDotsText }}</span>
      </span>
      <span class="t-pagin__btn" v-if="isShowLastPageBtn" :class="{'t-pagin__btn--active': displayCurrentPage === totalPage}" @click="toPage(totalPage)" key="lastPage">{{ totalPage }}</span>
      <span class="t-pagin__btn t-icon-arrow-right" @click="!nextPageBtnDisabled && toPage(displayCurrentPage + 1)" :class="{'t-pagin__btn--disabled': nextPageBtnDisabled}"></span>
    </div>
    <div class="t-pagin__size" v-show="isNeedSize">
      <tselect
        :isAppendToBody="true"
        :disableSearch="true"
        :items="[
          { label: 10 },
          { label: 20 },
          { label: 50 },
          { label: 100 },
        ]" trackBy="label" @change='sizeChangeHandler' v-model="currentSize" :size="2" :canReset="false"></tselect>
        <span>{{ unit }}</span>
      <div class="t-pagin__size">
        <span>跳至</span>
        <input-number :float="false" v-model="jumpPage" @keyup.enter="toPage(jumpPage)" ref="size"></input-number>
        <span>页</span>
      </div>
    </div>
  </div>
</template>

<script>
  import tselect from '../../select'
  import inputNumber from '../../input-number'

  export default {
    name: 't-pagin',
    components: {
      tselect,
      inputNumber
    },
    props: {
      total: {
        type: Number,
        default: 1000
      },
      current: {
        type: Number
      },
      pageSize: {
        type: Number,
        default: 10
      },
      unit: {
        type: String,
        default: '条/页'
      },
      isNeedSize: {
        type: Boolean,
        default: true
      }
    },
    data () {
      const data = {
        jumpPage: null,
        currentPage: 1,
        middleSize: 3,
        currentSize: this.pageSize,
        showText: {   // 翻三页的悬浮效果
          type: Number,
          default: 3
        }
      }
      return data
    },
    watch: {
      pageSize (n) {    // 增加一个监听：允许外部直接改变pageSize而不是一定通过点击事件来改变
        this.currentSize = n
      }
    },
    computed: {
      displayCurrentPage () {
        return this.current !== undefined ? this.current : this.currentPage
      },
      totalPage () {
        return Math.ceil(this.total / this.currentSize)
      },
      prevPageBtnDisabled () {
        return this.displayCurrentPage <= 1
      },
      nextPageBtnDisabled () {
        return this.displayCurrentPage >= this.totalPage
      },
      jumpPageBtnDisabled () {
        const jumpPage = this.jumpPage
        return (jumpPage <= 0) || (jumpPage > this.totalPage)
      },
      middleInfo () {
        const size = this.middleSize
        const half = (size - 1) / 2
        const current = this.displayCurrentPage
        const total = this.totalPage
        const res = {}
        if (total <= size) {
          res.firstNum = 1
          res.lastNum = total
        } else {
          const left = current - half < 1 ? Math.abs(current - half - 1) : 0
          const right = current + half > this.totalPage ? current + half - this.totalPage : 0
          const leftAmount = half - left + right
          const rightAmount = half - right + left
          res.firstNum = current - leftAmount
          res.lastNum = current + rightAmount
        }
        return res
      },
      middleArea () {
        const res = []
        const { firstNum, lastNum } = this.middleInfo
        for (let i = 0; i <= lastNum - firstNum; i++) {
          res.push(firstNum + i)
        }
        return res
      },
      isShowFirstPageBtn () {
        const wingLength = (this.middleSize - 1) / 2
        const current = this.displayCurrentPage
        const total = this.totalPage
        return total > this.middleSize && current > wingLength + 1
      },
      isShowPreDots () {
        const { firstNum } = this.middleInfo
        return firstNum > 2
      },
      preDotsText () {
        const num = 2
        const { firstNum } = this.middleInfo
        return num + 1 === firstNum ? num : '...'
      },
      isShowAfterDots () {
        const { lastNum } = this.middleInfo
        return this.totalPage - lastNum > 1
      },
      afterDotsText () {
        const { lastNum } = this.middleInfo
        return this.totalPage - lastNum === 2 ? this.totalPage - 1 : '...'
      },
      isShowLastPageBtn () {
        const { lastNum } = this.middleInfo
        return lastNum !== this.totalPage
      },
      result () {
        return this.limits[0]
      }
    },
    methods: {
      toPage (page) {
        if (page === this.displayCurrentPage) return
        if (page === -1) {
          if (this.displayCurrentPage === 4) {
            page = 2
          } else {
            const wingLength = (this.middleSize - 1) / 2
            page = this.displayCurrentPage - wingLength - 2   // 往前翻 (wingLength + 2) = 3 页
          }
        } else if (page === -2) {
          if (this.displayCurrentPage === this.totalPage - 3) {
            page = this.totalPage - 1
          } else {
            const wingLength = (this.middleSize - 1) / 2
            page = this.displayCurrentPage + wingLength + 2   // 往后翻 (wingLength + 2) = 3 页
          }
        }
        page = page < 1 ? 1 : page > this.totalPage ? this.totalPage : page
        this.currentPage = page
        this.$emit('change', page, this.currentSize, this.total)
      },
      sizeChangeHandler (a) {
        this.currentSize = parseInt(a.label)
        this.$emit('sizeChange', this.currentSize)
      }
    }
  }
</script>
