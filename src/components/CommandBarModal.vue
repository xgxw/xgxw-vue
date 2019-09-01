<template>
  <div class="container">
    <a-modal class="command-bar" :visible="visible" :footer="null" :closable="false" :mask="false">
      <a-auto-complete
        :dropdownMatchSelectWidth="false"
        optionLabelProp="value"
        style="width:100%;"
        @select="onSelect"
        @search="handleSearch"
        :open="showDropDown"
      >
        <template slot="dataSource">
          <a-select-option v-for="opt in dataSource" :key="opt.name" :value="opt.name">
            {{opt.name}}
            <span>{{opt.desc}}</span>
          </a-select-option>
        </template>
        <a-input :id="commandBar" />
      </a-auto-complete>
    </a-modal>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Modal, AutoComplete, Select, Input } from "ant-design-vue";
import { KeyCode } from "@/util/keycode";
import { SelectItem } from "@/constants/command";

const SelectOpt = Select.Option;

@Component({
  components: {
    "a-modal": Modal,
    "a-auto-complete": AutoComplete,
    "a-select-option": SelectOpt,
    "a-input": Input
  }
})
export default class CommandBarModal extends Vue {
  @Prop() readonly dataset!: SelectItem[];
  private dataSource: SelectItem[] = this.dataset;
  @Watch("dataset")
  handleDataSetChange() {
    this.dataSource = this.dataset;
  }

  private visible: boolean = false;
  private command!: SelectItem;
  private false = false;
  private commandBar = "commandBar";

  // AutoComplete
  private showDropDown: boolean = true;
  handleSearch(value: string) {
    this.dataSource = [];
    this.dataset.forEach(item => {
      if (item.name.indexOf(value) != -1) {
        this.dataSource.push(item);
      }
    });
  }
  onSelect(value: string) {
    this.dataSource.forEach(item => {
      if (item.name == value) {
        this.command = item;
        return;
      }
    });
  }

  // Handle Show/Hide
  showCommandBar() {
    this.visible = true;
    this.$nextTick(() => {
      this.showDropDown = true;
      let dom = document.getElementById(this.commandBar);
      if (dom) {
        dom.focus();
      }
    });
  }
  hideCommandBar() {
    this.showDropDown = false;
    this.visible = false;
  }

  onKeyDown() {
    let _this = this;
    document.onkeydown = function(e) {
      switch (true) {
        case e.keyCode == KeyCode.space && e.altKey && !_this.visible: {
          _this.showCommandBar();
          break;
        }
        case e.keyCode == KeyCode.enter && _this.visible: {
          _this.hideCommandBar();
          // 先通过这种hack的方式解决dom渲染时序的问题(估计antd/Modal-visibal 有些问题)
          setTimeout(() => {
            _this.$nextTick(() => {
              _this.command.cmd();
            });
          }, 500);
          break;
        }
        case e.keyCode == KeyCode.esc && _this.visible: {
          _this.hideCommandBar();
          break;
        }
      }
    };
  }

  mounted() {
    this.onKeyDown();
  }
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/base.scss";
@import "@/assets/css/zindex.scss";

.command-bar {
  z-index: $command-bar;
}
</style>
