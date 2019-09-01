<template>
  <div class="container">
    <command-bar :visible="showCommandBar" @onEnterKeyDown="onEnterKeyDown" :dataset="dataset" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import CommandBar from "@/components/CommandBar.vue";
import {
  SelectItem,
  createGotoName,
  createSelectItem,
  goto
} from "@/constants/command";
import { KeyCode } from "@/util/keycode";
import { mapGetters } from "vuex";
import { getIndexPath, getResumePath } from "@/router";
import { editorPath } from "@/router/tools";

/*
  Command 顺序:
    1. 通用: urlDataSet(常用路径/命令) -> PageDataSet(当页所需的命令)

  各组件提交自定义的 DataSet 到 store/command, 而后 本组件(XCommand) 从store取出, 添加到列表中
 */

@Component({
  components: {
    "command-bar": CommandBar
  },
  computed: {
    ...mapGetters({
      pageDataset: "command/getPageDataSet"
    })
  }
})
export default class XCommandBar extends Vue {
  // showCommandBar 控制是否显示
  private showCommandBar: boolean = false;
  // dataset: 传入Command组件, 当触发不同按键时, 用相应的dataSet替换
  private dataset: SelectItem[] = [];

  private readonly funDataSet: SelectItem[] = [];
  // urlDataSet 可导航路径的 Command Dataset
  get urlDataSet(): SelectItem[] {
    return [
      createSelectItem(
        createGotoName("home"),
        "去首页",
        goto(getIndexPath(), this)
      ),
      createSelectItem(
        createGotoName("editor"),
        "打开Markdown本地编辑器",
        goto(editorPath, this)
      ),
      createSelectItem(
        createGotoName("resume"),
        "查看简历",
        goto(getResumePath(""), this)
      )
    ];
  }

  reCreateDataset() {
    this.dataset = [];
    this.dataset = this.dataset.concat(this.funDataSet).concat(this.urlDataSet);
  }
  // pageDataset: 取出各组件存入store的Command, 结果添加到 dateset
  @Watch("pageDataset", { immediate: true })
  handlePageDatasetChange() {
    this.reCreateDataset();
    if (this.pageDataset && this.pageDataset.length > 0) {
      this.dataset = this.dataset.concat(this.pageDataset);
    }
  }

  // start -------------- onkeyDown事件监听 -----------------
  onEnterKeyDown(command: SelectItem) {
    this.showCommandBar = false;
  }
  onKeyDown() {
    let onKeyDown = (e: KeyboardEvent) => {
      switch (true) {
        case e.keyCode == KeyCode.space && e.altKey: {
          this.showCommandBar = !this.showCommandBar;
          break;
        }
        case e.keyCode == KeyCode.esc && this.showCommandBar: {
          this.showCommandBar = false;
          break;
        }
      }
    };
    document.addEventListener("keydown", onKeyDown.bind(this));
  }
  // end -------------- onkeyDown事件监听 -----------------

  mounted() {
    this.onKeyDown();
  }
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/base.scss";
@import "@/assets/css/zindex.scss";

.command-bar {
  z-index: $command-bar;
}
</style>
