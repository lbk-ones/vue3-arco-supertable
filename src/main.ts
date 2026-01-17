import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
// @ts-ignore
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import Loading from './loading';

declare global {
  interface Window {
    $loading: Loading;
  }
}

window.$loading = new Loading();
const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.mount('#app')
