import Router from "vue-router";
import Vue from "vue";

const routes = [
  {
    name: "文档",
    path: "/",
    component: () => import("@/views/doc/index"),
  },
  {
    name: "基础甘特图",
    path: "/base",
    component: () => import("@/views/base/index"),
  },
  {
    name: "带进度条甘特图",
    path: "/duration",
    component: () => import("@/views/duration/index"),
  },
  {
    name: "可拖拽甘特图",
    path: "/drag",
    component: () => import("@/views/drag/index"),
  },
  {
    name: "自定义色块样式",
    path: "/taskRender",
    component: () => import("@/views/taskRender/index"),
  },
  {
    name: "自定义tooltip",
    path: "/tooltipRender",
    component: () => import("@/views/tooltipRender/index"),
  },
  {
    name: "自定义右键菜单",
    path: "/menu",
    component: () => import("@/views/menu/index"),
  },
  {
    name: "多选操作",
    path: "/multichoose",
    component: () => import("@/views/multichoose/index"),
  },
];

Vue.use(Router);

const router = new Router({
  routes,
  mode: "hash",
  base: "imc/production",
});
export default router;
