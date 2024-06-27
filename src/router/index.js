import Router from "vue-router";
import Vue from "vue";

const routes = [
  {
    name: "基础甘特图",
    path: "/base",
    component: () => import("@/views/base/index"),
  },
  {
    name: "带进度甘特图",
    path: "/duration",
    component: () => import("@/views/duration/index"),
  },
  {
    name: "可拖拽甘特图",
    path: "/drag",
    component: () => import("@/views/drag/index"),
  },
];

Vue.use(Router);

const router = new Router({
  routes,
  mode: "hash",
  base: "imc/production",
});
export default router;
