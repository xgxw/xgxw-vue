<template>
  <div class="container"></div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class OnKeyDownDemo extends Vue {
  mounted() {
    this.onKeyDown();
  }
  onKeyDown() {
    document.onkeydown = function(e) {
      if (e.keyCode == 32 && e.altKey) {
        console.log(e);
        this.$message.info("press alt+space");
      }
    };
  }
}
</script>
<style lang='scss' scoped>
.header:after {
  width: 100vw;
  height: 1px;
  background-color: black;
}
</style>
