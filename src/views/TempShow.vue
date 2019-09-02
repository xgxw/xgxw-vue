<template>
  <div class="container">
    <paper-layout path="www.xiagaoxiawan.com">
      <loading :spinning="fetching" />
      <markdown :mkdoc="content" :isMobile="isMobile" />
    </paper-layout>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { default as PaperLayout } from "@/layout/Paper.vue";
import Markdown from "@/components/Markdown.vue";
import Loading from "@/components/Loading.vue";
import { mapGetters, mapActions } from "vuex";
import { isMobile } from "@/util/util";
import {
  SelectItem,
  transPathToSelectItem,
  createSelectItem,
  createFunName
} from "@/constants/command";
import { FetchCatalogRequset } from "@/api";
import {
  UnkownRequestError,
  UnkownRequestErrorTitle
} from "../constants/error";
import { getTempShowPath } from '../router';

Component.registerHooks(["beforeRouteLeave", "beforeRouteUpdate"]);

@Component({
  components: {
    "paper-layout": PaperLayout,
    markdown: Markdown,
    loading: Loading
  },
  computed: {
    ...mapGetters({
      fetching: "article/isFetching",
      content: "article/getContent",
      catalogPaths: "command/getPaths"
    })
  },
  methods: {
    ...mapActions({
      fetchContent: "article/fetchContent",
      changePageDataSet: "command/changePageDataSet",
      fetchCatalog: "command/fetchCatalog"
    })
  }
})
export default class TempShow extends Vue {
  private isMobile = isMobile();
  private fid = "";
  private pageDataSet: SelectItem[] = [];

  reCreateDataSet() {
    this.pageDataSet = [];
    this.pageDataSet = this.pageDataSet.concat(this.funDataSet);
  }

  addCatalogDataSet(): SelectItem[] {
    this.reCreateDataSet();
    let paths: string[] = [];
    if (this.catalogPaths) {
      for (let i = 0; i < this.catalogPaths.length; i++) {
        let path: string = this.catalogPaths[i];
        if (!path.startsWith("public/") || path == "public/tempshow/") {
          continue;
        }
        path = path.replace("public", "");
        paths.push(path);
      }
      this.pageDataSet = this.pageDataSet.concat(
        transPathToSelectItem(paths, this)
      );
    }
    return this.pageDataSet;
  }
  requestCatalog() {
    let r: FetchCatalogRequset = {
      path: "tempshow/",
      options: "1"
    };
    this.fetchCatalog(r)
      .catch(e => {
        switch (e) {
          default:
            this.$message.warning("找不到该目录, 请检查路径", 2);
        }
      })
      .finally(() => {
        this.pageDataSet = this.addCatalogDataSet();
        this.changePageDataSet(this.pageDataSet);
      });
  }

  mounted() {
    this.requestCatalog();
    this.deduceFid(this.$route.path);
    this.deduceData();
  }
  beforeRouteLeave(to: any, from: any, next: any) {
    this.changePageDataSet([]);
    next();
  }
  deduceFid(path: string) {
    switch (path) {
      case getTempShowPath(""):
      case getTempShowPath("/"):
      case getTempShowPath("/default.md"): {
        this.fid = "public/tempshow/default.md";
        break;
      }
      default: {
        this.fid = "public/" + path;
      }
    }
  }
  deduceData() {
    this.fetchContent(this.fid).catch(e => {
      switch (e) {
        case UnkownRequestError:
          this.$message.warning(UnkownRequestErrorTitle, 2);
          return;
        default:
          this.$message.warning("未找到该文件", 2);
      }
    });
  }
  beforeRouteUpdate(to: any, from: any, next: any) {
    this.deduceFid(to.path);
    this.deduceData();
    next();
  }

  private readonly funDataSet: SelectItem[] = [
    createSelectItem(createFunName("print"), "打印本页", this.print.bind(this))
  ];
  print() {
    this.$nextTick(() => {
      window.print();
    });
  }
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/base.scss";

.container::v-deep .markdown-body {
  color: $color-read !important;
}
.container::v-deep .v-note-wrapper {
  background-color: $backgroud-color-read !important;
}
</style>