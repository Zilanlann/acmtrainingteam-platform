import { createApp } from "vue";
import VueCookies from "vue-cookies";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import axios from "axios";

console.log(ElementPlus.ElMessage);

axios.defaults.baseURL = "http://localhost:5000/";

const app = createApp(App);
app.use(ElementPlus).use(router).mount("#app");
app.use(VueCookies);

app.config.globalProperties.$http = axios;

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
