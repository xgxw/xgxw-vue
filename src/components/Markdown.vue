<template>
  <div class="markdown">
    <mavon-editor
      v-model="mkdoc"
      :defaultOpen="mode"
      :subfield="subfield"
      :toolbarsFlag="showToolBar"
      :boxShadow="boxShadow"
      :fontSize="fontSize"
      @change="change"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import mavonEditor from "mavon-editor";
import { Mode, FontSize } from "@/constants/mavon-editor";
import "mavon-editor/dist/css/index.css";

@Component({
  components: {
    "mavon-editor": mavonEditor.mavonEditor
  }
})
export default class Markdown extends Vue {
  @Prop() readonly isMobile!: boolean;
  @Prop() readonly mkdoc!: string;
  private mode: string = Mode.preview;
  private subfield: boolean = false;
  private showToolBar: boolean = false;
  private boxShadow: boolean = false;
  get fontSize() {
    if (this.isMobile) {
      return FontSize.mobile;
    }
    return FontSize.default;
  }
  change(value: String, render: String) {
    // 用于通知上层 markdown 渲染后的 htmlCode
    this.$emit("change", render);
  }
}
</script>

<style lang='scss'  scoped>
@import "@/assets/css/mavon-editor.scss";

.markdown::v-deep .v-note-panel {
  border-width: 0px !important;
}
.markdown::v-deep .v-show-content {
  padding: 0 !important;
  background: none !important;
}
</style>