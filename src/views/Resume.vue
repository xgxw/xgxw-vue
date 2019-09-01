<template>
  <div class="container">
    <paper-layout path="吴振胜的简历">
      <loading :spinning="fetching" />
      <markdown :mkdoc="content" :isMobile="isMobile" />
    </paper-layout>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
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
export default class Resume extends Vue {
  private isMobile = isMobile();
  private fid = "";
  private pageDataSet: SelectItem[] = [];

  deduceData() {
    console.log(11111, this.fid);
    // TODO
    this.fetchContent(this.fid);
  }
  @Watch("$route", { immediate: true, deep: true })
  handleRouteChange() {
    let path = this.$route.path;
    switch (path) {
      case "/resume":
      case "/resume/":
      case "/resume/default.md": {
        this.fid = "public/resume/default.md";
        break;
      }
      default: {
        this.fid = "public/" + path;
      }
    }
    this.deduceData();
  }

  reCreateDataSet() {
    this.pageDataSet = [];
    this.pageDataSet = this.pageDataSet.concat(this.funDataSet);
  }

  /*
    addCatalogDataSet 将请求结果中的所有 resumePath 添加到命令行中
    注意, 由于后端组织路由与前端不同, resume没有按照后端 private/public 方式组织路径,
    所以需要前端自己去更改相应的路由, 而不能沿用后端路由的方式, 即fid.
  */
  addCatalogDataSet(): SelectItem[] {
    this.reCreateDataSet();
    let paths: string[] = [];
    if (this.catalogPaths) {
      for (let i = 0; i < this.catalogPaths.length; i++) {
        let path: string = this.catalogPaths[i];
        if (!path.startsWith("public/") || path == "public/resume/") {
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
      path: "resume/",
      options: "1"
    };
    this.fetchCatalog(r)
      .catch(e => {
        switch (e) {
          default:
            this.$message.warning("找不到该简历, 请检查路径", 2);
        }
      })
      .finally(() => {
        this.pageDataSet = this.addCatalogDataSet();
        this.changePageDataSet(this.pageDataSet);
      });
  }

  mounted() {
    this.requestCatalog();
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