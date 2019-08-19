<template>
  <li
  class="t-nav-sub-item"
  :class="{
    't-nav-sub-item--default': styleType === 'default',
    't-nav-sub-item--dark': styleType === 'dark',
    't-nav-sub-item--light': styleType === 'light',
    't-nav-sub-item--menu': styleType === 'menu'
  }"
  @mouseenter="mouseenterHandle"
  @mouseleave="mouseleaverHandle">

    <template v-if="$slots.title">
      <component :is="to ? 'router-link' : 'span'" tag="span" :to="to" :class="{ 'router-link-active': index && root.activeParentList.includes(index) }">
        <div @click="clickHandle">
          <slot name="title"></slot>
        </div>
      </component>
      <slot></slot>
    </template>

    <template v-else>
      <component :is="to ? 'router-link' : 'span'" tag="span" :to="to" :class="{ 'router-link-active': index && root.activeParentList.includes(index) }">
        <div @click="clickHandle">
          <slot></slot>
        </div>
      </component>
    </template>

  </li>
</template>

<script>
import emitter from './emitter.js'
export default {
  mixins: [emitter],
  name: 't-nav-sub-item',
  componentName: 'navLiSub',
  components: {
  },
  inject: {
    root: {
      default: null
    }
  },
  data () {
    return {
      styleType: this.$parent.styleType || this.root.type
    }
  },
  props: {
    index: String,
    to: [String, Object]
  },
  mounted () {
    this.$on('select', () => {
      this.index && this.root.activeParentList.push(this.index)
    })
  },
  methods: {
    mouseenterHandle (el) {
      this.broadcast('navUlSub', 'toggleShow', true)
    },
    mouseleaverHandle (el) {
      this.broadcast('navUlSub', 'toggleShow', false)
    },
    clickHandle () {
      if (this.index) {
        this.root.activeParentList = [this.index]
        this.dispatchToRoot('navUl', 'select', 'index')
      } else {
        this.root.activeParentList = []
        this.dispatchToRoot('navUl', 'select', 'route')
      }
      this.dispatch('navUlSub', 'toggleShow', false)
    }
  }
}
</script>
