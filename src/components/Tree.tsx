import Vue, { CreateElement } from 'vue'
import { Component, Prop, Emit } from "vue-property-decorator";

import { Tree as AntdTree } from "ant-design-vue";
const DirectoryTree = AntdTree.DirectoryTree;
const TreeNode = AntdTree.TreeNode;

@Component({
  components: {
    "a-directory-tree": DirectoryTree,
    "a-tree-node": TreeNode
  }
})
export default class Tree extends Vue {
  @Prop() readonly data!: string;
  @Prop({ default: false }) readonly multiple!: boolean;
  @Prop({ default: true }) readonly expandAll!: boolean;
  // autoGenTreeKey 自动生成TreeNode的key, key为path. false时值为key对应的v
  @Prop({ default: true }) readonly autoGenTreeKey!: boolean;

  @Emit()
  onSelect(keys: any) {
    console.log("Trigger Select", keys);
  }
  @Emit()
  onExpand(keys: any) {
    console.log("Trigger Expand", keys);
  }

  getTreeNode(data: {}, root: string): JSX.Element[] {
    let e: JSX.Element[] = [];
    for (let key in data) {
      if (data[key] instanceof Object) {
        let path = root + "/" + key
        let temp: JSX.Element = (
          <a-tree-node selectable={false} key={path} title={key} >
            {this.getTreeNode(data[key], path)}
          </a-tree-node >
        )
        e.push(temp);
      } else {
        let v = data[key]
        if (this.autoGenTreeKey) v = root + "/" + key
        e.push(<a-tree-node title={key} key={v} isLeaf />)
      }
    }
    return e
  }
  render(h: CreateElement) {
    let data = {}
    try {
      data = JSON.parse(this.data)
    } catch{
      console.error("tree catalog json parse failed!")
    }
    return (
      <a-directory-tree
        multiple={this.multiple}
        defaultExpandAll={this.expandAll}
        onselect={this.onSelect}
        onexpand={this.onExpand}
      >
        {this.getTreeNode(data, "")}
      </a-directory-tree>
    )
  }
}
