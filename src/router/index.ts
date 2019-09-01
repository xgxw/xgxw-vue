import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Resume from '@/views/Resume.vue';
import { tools } from './tools/index';
import { demos } from './demos/index';

Vue.use(Router);

export function getIndexPath() {
  return "/";
}
const index: RouteConfig = {
  path: '/',
  name: 'home',
  component: Home,
  meta: {
    title: '瞎搞瞎玩',
  },
};

export const loginRoutePath = "/login";
export function getLoginPath() {
  return loginRoutePath;
}
const login: RouteConfig = {
  path: loginRoutePath,
  name: 'login',
  component: Login,
  meta: {
    title: '登录',
  },
};

const resumePath: string = '/resume';
export function getResumePath(fid: string) {
  return resumePath + fid;
}
const resume: RouteConfig = {
  path: resumePath + "*",
  name: 'resume',
  component: Resume,
  meta: {
    title: "Resume",
  },
};

let devs: RouteConfig[] = []
if (process.env.NODE_ENV == "development") {
  devs = devs.concat(demos)
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    index,
    login,
    resume,
    ...tools
  ],
});

router.beforeEach((to, from, next) => {
  // 设置title
  document.title = to.meta.title;
  next();
});

export default router;
