import { RouteConfig } from 'vue-router';
import Index from '@/views/tools/Index.vue';
import Editor from '@/views/tools/Editor.vue';
import Test from '@/views/tools/Test.vue';

export const editorPath = "/tools/editor"
export const editor: RouteConfig = {
  path: editorPath,
  name: 'tools_editor',
  component: Editor,
  meta: {
    title: '工具-编辑',
  },
};

export const test: RouteConfig = {
  path: "/tools/test",
  name: 'tools_test',
  component: Test,
  meta: {
    title: '工具-测试',
  },
};

export const tools: RouteConfig[] = [editor, test]