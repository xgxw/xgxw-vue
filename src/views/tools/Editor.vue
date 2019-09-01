<template>
  <div class="container">
    <loading :spinning="fetching" />
    <editor-component :isMobile="isMobile" :content="content" :save="save" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { default as EditorComponent } from "@/components/Editor.vue";
import Loading from "@/components/Loading.vue";
import { mapGetters, mapActions } from "vuex";
import { isMobile } from "@/util/util";

@Component({
  components: {
    "editor-component": EditorComponent,
    loading: Loading
  },
  computed: {
    ...mapGetters({
      content: "article/getContent",
      fetching: "article/isFetching"
    })
  },
  methods: {
    ...mapActions({
      fetchContent: "article/fetchContentLocal",
      changeContent: "article/changeContent",
      uploadContent: "article/uploadContentLocal"
    })
  }
})
export default class Editor extends Vue {
  private isMobile = isMobile();
  mounted() {
    this.fetchContent("tools_editor");
  }
  save(data: string) {
    const hide: TimerHandler = this.$message.loading(
      "save to localStorage..",
      0
    );
    this.uploadContent(data)
      .then(res => {
        this.$message.info("save finished", 2);
      })
      .catch(e => {
        this.$message.warning("更新文章失败.", 2);
      })
      .finally(() => {
        setTimeout(hide, 0);
      });
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/editor.scss";
</style>
