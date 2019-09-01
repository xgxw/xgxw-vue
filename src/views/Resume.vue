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
import { SelectItem } from "@/constants/command";

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
      catalogPaths: "command/command/getPaths"
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

  deduceData() {
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
        this.fid = "public" + path;
      }
    }
    this.deduceData();
  }

  mounted() {
    this.changePageDataSet(this.commandBarData);
  }

  private commandBarData: SelectItem[] = [
    {
      name: "print",
      desc: "打印本页",
      cmd: this.print.bind(this)
    }
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