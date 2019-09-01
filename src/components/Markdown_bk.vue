<template>
  <div v-html='content'></div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';

// 基于markdown插件, 仅渲染. 现改用 mavon-editor 的预览实现.
// 重新启用请先安装 npm insall markdown --save

@Component
export default class Markdown_bk extends Vue {
  @Prop() readonly mkdoc!: string;
  private parse: any = null;
  private mounted() {
    this.parse = require('markdown').markdown;
  }
  get content() {
    if (this.parse && this.mkdoc) {
      return this.parse.toHTML(this.mkdoc);
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
