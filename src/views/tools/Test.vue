<template>
  <div class="container">
    <markdown :mkdoc="content" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Markdown from "@/components/Markdown.vue";
import Axios from "axios";

@Component({
  components: {
    markdown: Markdown
  }
})
export default class Test extends Vue {
  private content = "";
  mounted() {
    // let url = "https://xgxw-hk.oss-cn-hongkong.aliyuncs.com/%E8%BF%B0%E8%81%8C.md";
    // Axios.get(url)
    //   .then(res => {
    //     console.log("then", res.data);
    //   })
    //   .catch(e => {
    //     console.log("catch", e);
    //   });
  }
}
</script>
<style lang='scss' scoped>
</style>
