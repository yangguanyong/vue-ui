<template>
  <ul class="container">
    <li
        v-if="Boolean(resetText) === true"
        class="t-select__popper-item"
        :class="isSelectResetText && 't-select__popper-item--active'"
        :title="resetText"
        @click="onReset"
    >
      {{ resetText }}
    </li>
    <li
        v-for="(item, idx) in items"
        :key="idx"
        class="t-select__popper-item"
        :class="ids.indexOf(String(item[trackBy])) !== -1 && 't-select__popper-item--active'"
        @click="clickHandler(item)"
        :title="item[labelBy]">
      {{ item[labelBy] }}
    </li>
    <li v-if="items.length === 0 && Boolean(blankText) === true" style="padding: 15px 0;text-align: center;font-size: 12px;color: #888;">
      {{ blankText }}
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      items: Array,
      trackBy: String,
      labelBy: String,
      names: Array,
      ids: Array,
      blankText: String,
      resetText: String,
      isSelectResetText: Boolean
    },
    methods: {
      clickHandler (tag) {
        if (this.ids.indexOf(String(tag[this.trackBy])) !== -1) {
          this.$emit('remove', tag)
        } else {
          this.$emit('add', tag)
        }
      },
      onReset () {
        this.$emit('reset')
      }
    }
  }
</script>


