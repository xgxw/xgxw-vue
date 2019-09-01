<template>
  <mavon-editor
    :value="content"
    :defaultOpen="mode"
    :subfield="subfield"
    :toolbars="toolbars"
    :toolbarsFlag="showToolbar"
    :fontSize="fontSize"
    @save="save"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import mavonEditor from "mavon-editor";
import { Mode, ToolbarsStyle, FontSize } from "@/constants/mavon-editor";
import "mavon-editor/dist/css/index.css";

@Component({
  components: {
    "mavon-editor": mavonEditor.mavonEditor
  }
})
export default class Editor extends Vue {
  @Prop() readonly isMobile!: boolean;
  @Prop() readonly save!: any;
  @Prop() readonly content!: string;
  private mode: string = Mode.default;
  get subfield() {
    return !this.isMobile;
  }
  get showToolbar() {
    return true;
    // return this.isMobile;
  }
  get toolbars() {
    if (this.isMobile) {
      return ToolbarsStyle.mobile;
    }
    return ToolbarsStyle.default;
  }
  get fontSize() {
    if (this.isMobile) {
      return FontSize.mobile;
    }
    return FontSize.default;
  }
}
</script>