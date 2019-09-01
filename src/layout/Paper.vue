<template>
  <div class="container">
    <article id="article" class="article">
      <slot></slot>
    </article>
    <footer v-if="showFooter" class="print-footer">{{path}}</footer>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { isMobile } from "@/util/util";

@Component
export default class Paper extends Vue {
  @Prop() path!: string;
  private isMobile = isMobile();

  get showFooter() {
    return this.path != null && this.path != "";
  }
  mounted() {}
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/base.scss";

.container {
  background-color: $backgroud-color-read;
  overflow: hidden;
  -webkit-print-color-adjust: exact;
}

.article {
  box-shadow: 0 2px 6px rgba(100, 100, 100, 0.3);
}

// PC端界面
@media screen and (min-width: $mobile-width) {
  .article {
    min-height: 95vh;
    margin: 3vh auto;
    padding: 2rem 3rem;
    width: 60%;
  }
}

// 移动端界面
@media screen and (max-width: $mobile-width) {
  .article {
    margin: 0 auto;
    padding: 1.5rem 2rem;
    min-height: 100vh;
  }
}

@media screen {
  .print-footer {
    display: none;
  }
}

@media print {
  @page {
    size: auto;
    margin: 1.2cm auto 0 auto;
  }
  .print-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
