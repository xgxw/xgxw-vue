<template>
  <div class="container">
    <paper-layout path="www.xiagaoxiawan.com">
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
  createSelectItem,
  createFunName
} from "@/constants/command";

@Component({
  components: {
    "paper-layout": PaperLayout,
    markdown: Markdown,
    loading: Loading
  },
  computed: {
    ...mapGetters({
      fetching: "article/isFetching",
      content: "article/getContent"
    })
  },
  methods: {
    ...mapActions({
      fetchContent: "article/fetchContent",
      changePageDataSet: "command/changePageDataSet"
    })
  }
})
export default class Home extends Vue {
  private isMobile = isMobile();
  private readonly fid = "public/home.md";

  mounted() {
    this.fetchContent(this.fid);
    this.changePageDataSet(this.pageDataSet);
  }

  private pageDataSet: SelectItem[] = [
    createSelectItem(createFunName("print"), "打印本页", this.print.bind(this)),
    createSelectItem(
      createFunName("editor"),
      "编辑本页",
      this.editor.bind(this)
    )
  ];
  print() {
    this.$nextTick(() => {
      window.print();
    });
  }
  editor() {
    this.$router.push("fid");
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
