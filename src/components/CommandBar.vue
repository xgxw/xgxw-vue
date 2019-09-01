<template>
  <div class="container" v-show="visible">
    <div class="command-bar">
      <span>{{commandType}} :</span>
      <input
        id="command-bar-input"
        v-model="inputText"
        class="command-bar-input"
        type="text"
        autofocus
        autocomplete="false"
        tabindex="-1"
      />
    </div>
    <ul class="command-items">
      <li
        class="command-item"
        :class="{'stripe':index%2 != 1,'command-item-focus':focusIndex==index}"
        v-for="(suggest,index) in suggests"
        :key="suggest.name"
        tabindex="-1"
        v-on:click.stop="runCmd(suggest)"
      >
        <span class="command-item-name">{{suggest.name}}</span>
        <span class="command-item-desc">{{suggest.desc}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { KeyCode, isEditKey } from "@/util/keycode";
import { SelectItem } from "@/constants/command";

// 模仿 [chrome-vim](https://github.com/1995eaton/chromium-vim)

@Component({})
export default class CommandBar extends Vue {
  @Prop() readonly commandType!: String;
  @Prop() readonly dataset!: SelectItem[];
  @Prop() readonly visible!: boolean;
  private command: SelectItem | null = null; // command 当前选中的命令
  private suggests: SelectItem[] = this.dataset; // suggests 建议的数据集
  private focusIndex: number = -1; // focusIndex 当前获取焦点的 command-item 项. 处理tab按键事件时使用
  private inputText: string = ""; // inputText 用户输入的字符串

  @Watch("visible")
  handleVisibleChange() {
    if (this.visible) {
      this.init();
    }
  }

  init() {
    this.inputText = "";
    this.suggests = this.dataset;
    this.focusIndex = -1;
    this.command = null;
    this.focusDom("command-bar-input");
  }

  nextFocusIndex(): number {
    this.focusIndex++;
    if (this.focusIndex == this.suggests.length) {
      this.focusIndex = 0;
    }
    return this.focusIndex;
  }
  prevFocusIndex(): number {
    this.focusIndex--;
    if (this.focusIndex == -1) {
      this.focusIndex = this.suggests.length - 1;
    }
    return this.focusIndex;
  }

  handleTab() {
    let suggest = this.suggests[this.focusIndex];
    this.inputText = suggest.name;
    this.command = suggest;
  }

  // updateSuggests: 输入的关键字包含于 command.name
  // 约定: 因path中不会出现 空格, 所以将空格替换为 `.*`, 方便输入
  updateSuggests() {
    this.focusIndex = -1;
    this.suggests = [];
    let par = this.inputText.replace(/  */g, ".*");
    let re = new RegExp(par);
    this.dataset.forEach(item => {
      if (re.test(item.name)) {
        this.suggests.push(item);
      }
    });
  }

  focusDom(id: string) {
    this.$nextTick(() => {
      let dom = document.getElementById(id);
      if (dom) {
        dom.focus();
      }
    });
  }

  runCmd(cmd: SelectItem) {
    this.$emit("onEnterKeyDown", cmd);
    cmd.cmd();
  }

  onKeyDown() {
    let onkeydown = (e: KeyboardEvent) => {
      switch (true) {
        case e.keyCode == KeyCode.tab && this.visible: {
          if (e.shiftKey) {
            this.prevFocusIndex();
          } else {
            this.nextFocusIndex();
          }
          this.handleTab();
          e.stopPropagation();
          e.preventDefault();
          break;
        }
        case e.keyCode === KeyCode.enter && this.visible: {
          if (this.command && this.command.cmd) {
            this.runCmd(this.command);
          }
          break;
        }
        case (isEditKey(e) || e.keyCode == KeyCode.backspace) && this.visible: {
          this.focusDom("command-bar-input");
          break;
        }
      }
    };
    document.addEventListener("keydown", onkeydown.bind(this));
  }
  onKeyUp() {
    let onKeyUp = (e: KeyboardEvent) => {
      switch (true) {
        case (isEditKey(e) || e.keyCode == KeyCode.backspace) && this.visible: {
          this.updateSuggests();
          break;
        }
      }
    };
    document.addEventListener("keyup", onKeyUp.bind(this));
  }

  mounted() {
    this.onKeyDown();
    this.onKeyUp();
  }
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/base.scss";
@import "@/assets/css/zindex.scss";

$background-color: #1c1c1c;
$background-color-stripe: #1f1f1f;
$background-color-hover: #f1f1f1;
$color: #f1f1f1;
$color-hover: #1c1c1c;

.container {
  position: fixed;
  z-index: $command-bar;
  width: 100vw;
  top: 0;
  left: 0;
}

.command-bar {
  line-height: 1.5rem;
  background-color: $background-color;
  color: $color;
  position: absolute;
  right: 0;
  top: 0;
  width: 100vw;
  padding-left: 0.2rem;
  display: flex;
  justify-content: space-between;

  .command-bar-input {
    flex-grow: 1;
    margin-left: 0.5rem;
    background-color: $background-color;
    color: $color;
    box-sizing: border-box;
    outline-style: none;
    border: 0;
  }
}

.command-items {
  max-height: 40vh;
  padding: 0;
  margin: 1.5rem 0 0;
  overflow-y: auto;

  .command-item {
    background-color: $background-color;
    color: $color;
    display: flex;
    justify-content: space-between;

    .command-item-desc {
      min-width: 60%;
    }
  }

  .command-item:hover,
  .command-item-focus {
    background-color: $background-color-hover !important;
    color: $color-hover !important;
  }

  .stripe {
    background-color: $background-color-stripe;
  }
}
.command-items::-webkit-scrollbar {
  display: none;
}
</style>
