<template>
  <div class="container">
    <a-menu v-show="expand" @click="handleClick" mode="inline" class="menu">
      <a-sub-menu key="article" @titleClick="titleClick">
        <span slot="title">
          <a-icon type="mail" />
          <span>文章</span>
        </span>
        <a-menu-item key="todo">todo</a-menu-item>
        <a-menu-item key="resume">resume</a-menu-item>
        <a-menu-item-group key="public" title="公共">
          <a-menu-item key="public-test">test.md</a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
      <a-sub-menu key="tools" @titleClick="titleClick">
        <span slot="title">
          <a-icon type="tool" />
          <span>工具</span>
        </span>
        <a-menu-item key="5">Option 5</a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="setting">
        <span slot="title">
          <a-icon type="setting" />
          <span>设置</span>
        </span>
        <a-menu-item key="9">Option 9</a-menu-item>
      </a-sub-menu>
    </a-menu>
    <a-icon
      :type="expand ? 'left' : 'right'"
      class="trigger"
      v-bind:class="{ 'trigger-expand': expand }"
      @click="toggleExpand()"
    />
    <div class="article" v-bind:class="{ 'catalog-expand': expand }">
      当打开catalog时 article 块 左边距变化
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { client } from "@/api/index";
import { Menu, Icon } from "ant-design-vue";

@Component({
  components: {
    "a-menu": Menu,
    "a-menu-item": Menu.Item,
    "a-sub-menu": Menu.SubMenu,
    "a-menu-item-group": Menu.ItemGroup,
    "a-icon": Icon
  }
})
export default class Catalog extends Vue {
  private expand: boolean = true;
  handleClick(data: any) {
    console.log("handleClick: ", data);
  }
  titleClick(data: any) {
    console.log("titleClick: ", data);
  }
  toggleExpand() {
    this.expand = !this.expand;
  }
  mounted() {}
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/base.scss";
@import "@/assets/css/zindex.scss";
$menu-width: 15vw;

.container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: $catalog-menu;
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: $menu-width;
  height: 100vh;
  z-index: $catalog-menu;
}

.menu::v-deep .ant-menu-inline {
  min-height: 100% !important;
}

.trigger {
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: inherit;
  font-size: 18px;
  padding: 5px 1px;
  border-radius: 0px 4px 4px 0px;
  border-width: 1px 1px 1px;
  border-style: solid solid solid none;
  border-color: rgb(224, 228, 231) rgb(224, 228, 231) rgb(224, 228, 231);
}
.trigger-expand {
  left: $menu-width !important;
}

// 如下为body内容, 测试使用
.article {
  width: 80vw;
  height: 100vh;
  background-color: aqua;
  margin: auto 10vw;
}
.catalog-expand {
  margin-left: $menu-width;
}
</style>

