<template>
  <div>
    <div class="t-select__tags" :class="autoHeight && 't-select__tags--auto-height'" v-if="tags.length" :title="tagsTitle" @click="onClick">
      <tag
        v-for="(tag, idx) in tags"
        :key="idx"
        :size="size"
        deletable
        @delete="onDelete(tag)"
      >{{ tag[labelBy] }}</tag>
    </div>
    <div class="t-select__text" :class="autoHeight && 't-select__text--auto-height'" :title="text">{{ text }}</div>
  </div>
</template>

<script>
  import tag from '../../tag'
  export default {
    components: {
      tag
    },
    props: {
      content: [Array, String],
      labelBy: String,
      autoHeight: Boolean,
      size: Number
    },
    computed: {
      text () {
        if (typeof this.content === 'string') {
          return this.content
        }
        return null
      },
      tags () {
        if (Array.isArray(this.content)) {
          return this.content
        }
        return []
      },
      tagsTitle () {
        return this.tags.map(tag => tag[this.labelBy]).join('、')
      }
    },
    methods: {
      onDelete (tag) {
        this.$emit('delete', tag)
      },
      onClick (e) {
        if (e.target.className === 't-tag__switch') {
          e.stopPropagation()
        }
      }
    }
  }
</script>