<template>
  <span class="t-tag" :class="wrapClass" :style="{maxWidth: width}">
    <slot></slot>
    <span v-if="deletable" class="t-tag__switch" @click="deleteTag">×</span>
  </span>
</template>

<script>
  export default {
    inject: {
      'formItem': {
        default: null
      }
    },
    name: 't-tag',
    props: {
      item: {
        type: null,
        default: null
      },
      value: {
        type: null,
        default: true
      },
      size: {
        type: Number,
        default: 1
      },
      type: {
        type: Number,
        default: 1
      },
      deletable: {
        type: Boolean,
        default: false
      },
      banFormEvent: {    // 触发form-item校验
        type: Boolean,
        default: false
      },
      autoWidth: {
        type: Boolean,
        default: true
      },
      maxWidth: {
        type: String,
        default: '60px'
      }
    },
    data () {
      return {
      }
    },
    computed: {
      width () {
        return this.autoWidth ? 'auto' : this.maxWidth
      },
      wrapClass () {
        return {
          [`t-tag--sm`]: this.size === 2,    // 小尺寸
          [`t-tag--size-${this.size}--deletable`]: this.deletable,
          [`t-tag--size-${this.size}`]: true,
          [`t-tag--type-${this.type}`]: true,
          [`t-tag--nonauto`]: !this.autoWidth
        }
      }
    },
    methods: {
      deleteTag () {
        // 删除标签事件需要通知外部删除的是哪个标签，此处返回该标签的值，父祖件接收再执行剔除操作
        this.$emit('delete', this.item)
        if (this.formItem && !this.banFormEvent) {
          this.formItem.$emit('tag.change')
        }
      }
    }
  }
</script>
