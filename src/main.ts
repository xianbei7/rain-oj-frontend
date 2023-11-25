import { createApp } from "vue";
import App from "./App.vue";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";
import router from "./router";
import { createPinia } from "pinia";
import "@/permissions";
import "@/plugins/axios";
import "bytemd/dist/index.css";

const pinia = createPinia();
createApp(App)
  .use(pinia)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(router)
  .mount("#app");
