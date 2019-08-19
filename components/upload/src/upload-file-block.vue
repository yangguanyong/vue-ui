<template>
  <div class="t-upload-file__block">
    <div v-for="(o, index) in list" :key="index">
      <div class="t-upload-file__item t-upload-file__item--green" :title="'上传成功'">
        <span class="t-upload-file__icon t-icon-paper3"></span>
        {{o.name}}
        <span class="t-upload-file__dele t-icon-qingchu" @click="deleHandle(index, o)"></span>
      </div>
    </div>
    <tModal :visible.sync="deleVisible" @confirm="confirmHandle">
      <div>确定删除{{ deleName }}吗？</div>
    </tModal>
  </div>
</template>

<script>
import tModal from '../../modal'
export default {
  components: {
    tModal
  },
  props: {
    list: Array
  },
  data () {
    return {
      deleName: '',
      deleVisible: false,
      deleIndex: null
    }
  },
  methods: {
    deleHandle (index, o) {
      this.deleName = o.name
      this.deleIndex = index
      this.deleVisible = true
    },
    confirmHandle () {
      this.list.splice(this.deleIndex, 1)
      this.deleVisible = false
    }
  }
}
</script>