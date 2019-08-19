<template>
  <span class="t-step__item" :class="{ 't-step__item--active': isActive, 't-step__item--finish': isFinished }" v-show="visible" @click="onclick">
    <!-- <span class="arrow1"></span> -->
    <span class="arrow2" v-if="currentIndex >= index && type === 1 && this.$parent.hasLabel"></span>
    <span class="line" v-if="index !== 0 && type === 2"></span>
    <span class="t-step__number number" v-if="type === 1">
      <span v-if="!isFinished && type === 1">{{ index + 1 }}</span>
      <span v-else class="t-icon-complete tasf"></span>
    </span>
    <span class="t-step__number number" v-if="type === 2">
      <span>{{ index + 1 + '.' }}</span>
    </span>
    <span class="txt">
      <slot></slot>
    </span>
    <span class="arrow3" v-if="index !== currentIndex && type === 1"></span>
    <span class="arrow4" v-if="type === 1"></span>
  </span>
</template>

<script>
  export default {
    name: 't-step-item',
    props: {
      URL: {    // 如有，可以在初始化时比对步骤是否激活
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        type: 1,
        index: null,
        currentIndex: null
      }
    },
    mounted () {
      this.$parent.storeItem(this)
      if (this.isMatch(this.$router.currentRoute.matched, this.URL)) {
      // if (this.$router.currentRoute.path === this.URL) {    // 当步骤存在URL属性时发出比对事件，父祖件优先将当前U步骤定为活跃状态
        this.$parent.setActive(this)
      }
    },
    watch: {
      visible (n, o) {
        this.$parent.sortItem()
      },
      '$route' (to, from) {   // 监听路由在判断是否是当前步骤
        if (this.isMatch(to.matched, this.URL)) {
        // if (to.path === this.URL) {
          this.$parent.setActive(this)
        }
      }
    },
    computed: {
      isActive () {
        return this.currentIndex !== null && this.currentIndex === this.index
      },
      isFinished () {
        return this.currentIndex !== null && this.currentIndex > this.index
      },
      lastIdx () {
        return this.$parent.items.length - 1
      }
    },
    methods: {
      onclick () {
        this.$emit('click', this)
      },
      isMatch (matched, url) { // 根据路由matched遍历匹配，修复不能匹配前缀问题
        if (!matched || !url) { return false }
        let isMatch = false
        matched.forEach(u => {
          if (u.path === url) { isMatch = true }
        })
        return isMatch
      }
    }
  }
</script>
