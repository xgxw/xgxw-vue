<template>
  <div class="container">
    <command-bar :visible="showCommandBar" @onEnterKeyDown="onEnterKeyDown" :dataset="dataset" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CommandBar from "@/components/CommandBar.vue";
import {
  SelectItem,
  genGotoCommandName,
  transPathToSelectItem,
  createSelectItem
} from "@/constants/command";
import { KeyCode } from "@/util/keycode";
import { mapGetters, mapActions } from "vuex";
import { getIndexPath } from "@/router";
import { editorPath } from "@/router/tools";
import { InvalidTokenError } from "@/constants/error";
import { FetchCatalogRequset } from "@/api";

/*
  Command 顺序:
    1. 通用: urlDataSet(常用路径/命令) -> PageDataSet(当页所需的命令)
    2. 导航: urlDataSet(常用路径/命令) -> catalog(目录树)

  各组件提交自定义的 DataSet 到 store/command, 而后 本组件(XCommand) 从store取出, 添加到列表中
 */

@Component({
  components: {
    "command-bar": CommandBar
  },
  computed: {
    ...mapGetters({
      pageDataset: "command/getPageDataSet",
      catalogPaths: "command/command/getPaths"
    })
  },
  methods: {
    ...mapActions({
      fetchCatalog: "command/fetchCatalog"
    })
  }
})
export default class XCommandBar extends Vue {
  // showCommandBar 控制是否显示
  private showCommandBar: boolean = false;
  // dataset: 传入Command组件, 当触发不同按键时, 用相应的dataSet替换
  private dataset: SelectItem[] = [];

  // start -------------- 自定义预置 command -----------------
  private funDataSet: SelectItem[] = [];
  // urlDataSet 可导航路径的 Command Dataset
  private urlDataSet: SelectItem[] = [
    createSelectItem(
      genGotoCommandName("home"),
      "去首页",
      getIndexPath(),
      this
    ),
    createSelectItem(
      genGotoCommandName("editor"),
      "打开Markdown本地编辑器",
      editorPath,
      this
    )
  ];
  // end -------------- 生成 command -----------------

  // pageDataset: 取出各组件存入store的Command, 结果添加到 defaultDataSet
  @Watch("pageDataset")
  handlePageDatasetChange() {
    this.dataset = [];
    this.dataset = this.dataset.concat(this.funDataSet).concat(this.urlDataSet);
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

  addCatalogDataSet(): SelectItem[] {
    let paths: string[] = [];
    if (this.catalogPaths) {
      for (let i = 0; i < this.catalogPaths.length; i++) {
        let path = this.catalogPaths[i];
        paths.push(path);
      }
    }
    return this.urlDataSet.concat(transPathToSelectItem(paths, this));
  }
  private hasRequestCatalog: boolean = false;
  requestCatalog() {
    // 当请求过则不再继续请求
    if (this.hasRequestCatalog) return;

    let r: FetchCatalogRequset = {
      path: "/"
    };
    this.fetchCatalog(r)
      .then(res => {
        this.hasRequestCatalog = true;
      })
      .catch(e => {
        switch (e) {
          case InvalidTokenError:
            this.$message.warning("认证过期", 2);
            return;
          default:
            this.$message.warning("获取文件列表失败", 2);
        }
      })
      .finally(() => {
        this.urlDataSet = this.addCatalogDataSet();
      });
  }

  mounted() {
    this.handlePageDatasetChange();
    this.onKeyDown();
    this.requestCatalog();
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
