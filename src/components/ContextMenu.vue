<template>
  <div id="menu" class="menu" :style="style" v-show="show" @mousedown.stop @contextmenu.prevent>
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

// 参考实现: https://github.com/xunleif2e/vue-context-menu
// 实现思想: 添加 contextmenu 事件, 当右键点击时显示自定义菜单, 并绑定 左键点击其他地方时隐藏 右键菜单 的事件.
// 当点击其他地方时, 取消右键显示

/*
  使用指南:
  1. 如果想右键菜单选择后隐藏右键菜单, 那么在父组件更改show状态
  2. 默认slot为 a 标签, 并为 a 标签添加了样式
  3. 父组件添加此方法, 以更新 contextMenu 显示状态: @update:show="(show) => contextMenuVisible = show"
*/ 

@Component({
  components: {}
})
export default class TestPage extends Vue {
  @Prop() readonly target!: HTMLElement;
  @Prop() readonly show!: boolean;
  private binded: boolean = false;
  private triggerShowFn!: (e: Event) => void;
  private triggerHideFn!: (e: Event) => void;
  // 用于绑定右键菜单的位置
  private style: { top: string; left: string } = {
    top: "0px",
    left: "0px"
  };
  mounted() {
    this.bindEvents();
  }

  @Watch("show")
  onShowChange() {
    if (this.show) {
      this.bindHideEvents();
    } else {
      this.unbindHideEvents();
    }
  }
  @Watch("target")
  onTargetChange() {
    this.bindEvents();
  }

  // 右键点击时 显示右键菜单
  bindEvents() {
    this.$nextTick(() => {
      if (!this.target || this.binded) return;
      // bind()方法创建一个新的函数，在bind()被调用时，这个新函数的this被bind的第一个参数指定，其余的参数将作为新函数的参数供调用时使用。
      this.triggerShowFn = this.contextMenuHandler.bind(this);
      this.target.addEventListener("contextmenu", this.triggerShowFn);
      this.binded = true;
    });
  }
  unbindEvents() {
    if (!this.target) return;
    this.target.removeEventListener("contextmenu", this.triggerShowFn);
  }
  contextMenuHandler(e: Event) {
    let left = "clientX" in e ? e.clientX : 0;
    let top = "clientY" in e ? e.clientY : 0;
    this.setLayout(left, top);
    this.$emit("update:show", true);
    e.preventDefault();
  }
  setLayout(left: number, top: number) {
    this.style = {
      top: top + "px",
      left: left + "px"
    };
  }

  // 点击其他地方时 隐藏菜单
  bindHideEvents() {
    this.triggerHideFn = this.clickDocumentHandler.bind(this);
    document.addEventListener("mousedown", this.triggerHideFn);
    // mousewheel 监听鼠标滚轮事件
    document.addEventListener("mousewheel", this.triggerHideFn);
  }
  unbindHideEvents() {
    document.removeEventListener("mousedown", this.triggerHideFn);
    document.removeEventListener("mousewheel", this.triggerHideFn);
  }
  clickDocumentHandler(e: Event) {
    this.$emit("update:show", false);
  }
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/base.scss";
@import "@/assets/css/zindex.scss";

.menu {
  position: fixed;
  background: $white;
  border: 1px solid $backgroud-color;
  border-radius: 3px;
  box-shadow: 0 0.5rem 1rem 0 $backgroud-color;
  z-index: $context-menu;
  display: block;

  a {
    display: block;
    text-align: center;
    line-height: 1.5rem;
    padding: 0.2rem 1.3rem;
    color: $black;
    // 去掉a标签的下划线
    text-decoration: none;
  }

  a:hover {
    background: $backgroud-color;
  }
}
</style>
