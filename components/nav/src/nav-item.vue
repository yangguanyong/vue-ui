<template>
  <li
  class="t-nav-item"
  :class="{
    't-nav-item--default': type === 'default' && isHasLink,
    't-nav-item--dark': type === 'dark' && isHasLink,
    't-nav-item--light': type === 'light' && isHasLink,
    't-nav-item--left': float === 'left',
    't-nav-item--right': float === 'right',
    't-nav-item--medium': size === 'medium',
    't-nav-item--small': size === 'small'
  }"
  @mouseenter="mouseenterHandle"
  @mouseleave="mouseoutHandle">

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
  componentName: 'navLi',
  name: 't-nav-item',
  components: {
  },
  created () {
  },
  data () {
    return {
      type: this.root.type,
      size: this.root.size
    }
  },
  props: {
    index: String,
    to: [String, Object],
    float: {
      type: String,
      default: 'left'
    }
  },
  inject: {
    root: {
      default: null
    }
  },
  mounted () {
    this.$on('select', () => {
      this.index && this.root.activeParentList.push(this.index)
    })
  },
  methods: {
    mouseenterHandle () {
      this.broadcast('navUlSub', 'toggleShow', true)
    },
    mouseoutHandle (el, dir) {
      this.broadcast('navUlSub', 'toggleShow', false)
    },
    clickHandle () {
      if (this.isHasLink) {
        if (this.index) {
          this.root.activeParentList = [this.index]
          this.dispatchToRoot('navUl', 'select', 'index')
        } else {
          this.root.activeParentList = []
          this.dispatchToRoot('navUl', 'select', 'route')
        }
        this.broadcast('navUlSub', 'toggleShow', false)
      }
    }
  },
  computed: {
    isHasLink () {
      return this.to || this.index
    }
  }
}
</script>
