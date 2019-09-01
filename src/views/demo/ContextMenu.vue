<template>
  <div class="container">
    <context-menu
      :target="contextMenuTarget"
      :show="contextMenuVisible"
      @update:show="(show) => contextMenuVisible = show"
    >
      <a @click="print">打印文章</a>
      <a @click="editor">编辑文章</a>
    </context-menu>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import ContextMenu from "@/components/ContextMenu.vue";

@Component({
  components: {
    "catalog-menu": ContextMenu
  }
})
export default class ContextMenuDemo extends Vue {
  // contextMenu 右键菜单选项
  private contextMenuTarget: HTMLElement | null = null;
  private contextMenuVisible: boolean = false;
  initContextMenu() {
    this.contextMenuTarget = document.body;
  }
  hideContextMenu() {
    this.contextMenuVisible = false;
  }
  print() {
    console.log("print");
    this.hideContextMenu();
    this.$nextTick(() => {
      window.print();
    });
  }
  editor() {
    console.log("editor");
    this.hideContextMenu();
  }
  mounted() {
    this.initContextMenu();
  }
}
</script>
<style lang='scss' scoped>
.header:after {
  width: 100vw;
  height: 1px;
  background-color: black;
}
</style>
