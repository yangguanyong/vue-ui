<template>
  <li
    class="t-tree__li"
    :class="`tree-node-level-${level - 1} ${sizeMap[root.size]}`"
    v-show="isShowNode">
    <p
      :class="{ 'is-semi': isSemi }">
      <span
        v-if="root.isNeedExpand"
        :class=" isShowChild ? 't-tree__arrow-down' : 't-tree__arrow-right'"
        :style="{ visibility: data[childKey] && data[childKey].length !== 0 ? '' : 'hidden' }"
        @click="toggleChildShow">
      </span>
      <!-- <label> -->
        <tCheckedBox
          v-if="root.showCheckbox"
          :id="'tree-checkbox-' + dataId"
          v-model="data[valueKey]"
          @change.native="changeHandle"
          :isSemi="isSemi">
          <slot></slot>
        </tCheckedBox>
        <!-- <label :for="'tree-checkbox-' + dataId"></label> -->
        <!-- <slot></slot> -->
      <!-- </label> -->
        <span v-else>
          <slot></slot>
        </span>
    </p>
    <slideDown>
      <div v-show="isShowChild">
        <ul v-if="data[childKey] && data[childKey].length !== 0" :style="{ paddingLeft: root.left }" class="t-tree__ul">
          <permissionRank v-for="o in data[childKey]" :data="o" :key="o[idKey]" ref="treeNodeRef">
            <permissionSlot :arg="{ data: o, node: { parent: data, level: level }}" :tpl="root.$scopedSlots.default"></permissionSlot>
          </permissionRank>
        </ul>
      </div>
    </slideDown>
  </li>
</template>

<script>
import emitter from './emitter'
import permissionSlot from './tree-slot'
import slideDown from './slide-down'
import tCheckedBox from '../../checkbox'

const sizeMap = {
  1: 't-tree__li--md',
  2: 't-tree__li--sm'
}

export default {
  mixins: [emitter],
  name: 'permissionRank',
  componentName: 'permissionRank',
  provide () {
    return {
      treeNode: this
    }
  },
  inject: {
    'root': {
      default: null
    },
    'treeNode': {
      default: null
    }
  },
  data () {
    return {
      level: this.treeNode ? this.treeNode.level + 1 : this.root.level + 1,
      isShowChild: this.root.expandInit,
      isSemi: false,
      isShowNode: true,
      sizeMap
    }
  },
  props: {
    data: Object
  },
  components: {
    permissionSlot,
    slideDown,
    tCheckedBox
  },
  created () {
    const hasValue = this.valueKey
    const child = this.childKey
    this.$on('sonEvent', (value) => {
      if (this.isShowNode) {
        this.data[hasValue] = value
        this.isSemi = false
      }
    })
    this.$on('faEvent', (value) => {
      this.data[hasValue] = this.data[child].findIndex(e => {
        return e[hasValue]
      }) !== -1
      this.isSemi = this.isSemiFn()
    })
    this.$on('search', (value) => {
      if (value === '') {
        this.isShowNode = true
      } else {
        this.isShowNode = false
        this.$nextTick(() => { // todo: 子问题
          if (this.root.searchArr.includes(this.data)) {
            this.isShowNode = true
            this.verifyChild('permissionRank', (node) => {
              node.isShowNode = true
            })
            this.verifyParent('permissionRank', (node) => {
              node.isShowNode = true
            })
          }
        })
      }
    })
    this.$on('setChecked', (param) => {
      const id = this.idKey
      if (param.id === this.data[id]) {
        this.change(param.checked)
      }
    })
    this.$on('expand', (param) => {
      if (param.accordion) {
        this.isShowChild = false
      }
      if (param.ids.includes(this.dataId)) {
        this.verifyParent('permissionRank', (node) => {
          node.isShowChild = true
        })
        setTimeout(() => {
          this.isShowChild = true
        }, 300) // 300是为动画时间
      }
    })
    this.handleId()
  },
  mounted () {
    if (this.root.isRela) {
      this.verifyParent('permissionRank', (node) => {
        node.isSemi = node.isSemiFn()
      })
    }
  },
  methods: {
    isSemiFn () { // 初始化只需判断父节点，change的时候半选判断要覆盖到全部节点
      const hasValue = this.valueKey
      const nodeChecked = this.data[hasValue]
      const hasChildNotChecked = this.$refs.treeNodeRef && this.$refs.treeNodeRef.findIndex(e => { return !e.data[hasValue] }) !== -1
      const hasChildSemi = this.$refs.treeNodeRef && this.$refs.treeNodeRef.findIndex(e => { return e.isSemi }) !== -1
      return nodeChecked && (hasChildNotChecked || hasChildSemi) // 本身有勾 && （子级有没勾的 || 子级有半勾的）
    },
    changeHandle (e) {
      this.change(e.target.checked)
      this.root.change(this.data)
    },
    change (checked) {
      if (this.root.isRela) {
        this.broadcast('permissionRank', 'sonEvent', checked)
        this.dispatch('permissionRank', 'faEvent', checked)
        this.isSemi = false
      }
      if (this.root.isCheckbox) {}
      if (this.root.isRadio) {
        const hasValue = this.valueKey
        this.root.loop(this.root.showTreeData, (e) => {
          e[hasValue] = false
        })
        this.data[hasValue] = checked
      }
    },
    toggleChildShow () {
      this.isShowChild = !this.isShowChild
    },
    handleId () {
      const id = this.idKey
      if (!this.data[id]) {
        this.data[id] = this.root.setOnlyId()
      }
    }
  },
  computed: {
    idKey () { return this.root.idKey },
    valueKey () { return this.root.valueKey },
    childKey () { return this.root.childKey },
    dataId () { return this.data[this.idKey] }
  },
  watch: {
    'root.isAll' (n, o) {
      if (n) {
        this.isSemi = false
      }
    }
  }
}
</script>
