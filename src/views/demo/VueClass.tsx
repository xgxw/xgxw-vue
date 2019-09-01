import Vue, { CreateElement } from 'vue'
import { Component } from "vue-property-decorator";

@Component
export default class TreeDemo extends Vue {
  render(h:CreateElement) {
    return (<p>This is rendered via TSX</p>)
    // 使用 createElement 方式返回, 参考 https://cn.vuejs.org/v2/guide/render-function.html
    // return h(
    //   "p",   // 节点名称
    //   {
    //     attrs:{},  // 传递的属性
    //     on:{}      // 所有 v-on 可监听的事件, 支持子组件的 $emit. 尝试了 nativeOn, 发现emit不能触发..
    //     scopedSlots:{} //插槽
    //   },
    //   this.getTreeNode(this.data)  // children
    // )
  }
}
