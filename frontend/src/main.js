import { createApp } from "vue";
import VueCookies from "vue-cookies";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import axios from "axios";
// Markdown Editor of dicussion
import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import Prism from "prismjs";
import hljs from "highlight.js";
VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
VMdPreview.use(vuepressTheme, {
  Hljs: hljs,
});

const postIndex = window.location.host.indexOf(":");
const hostOutOfPost = window.location.host.substring(0, postIndex);
axios.defaults.baseURL = `${window.location.protocol}//${hostOutOfPost}:5000/`;

const app = createApp(App);
app.use(ElementPlus).use(router).mount("#app");
app.use(VueCookies);
app.use(VueMarkdownEditor);
app.use(VMdPreview);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
