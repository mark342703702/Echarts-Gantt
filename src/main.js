import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ELEMENT from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
Vue.use(ELEMENT);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
