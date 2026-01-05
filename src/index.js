// src/index.js

// 导入你想要导出的组件
import SuperTable from './components/Table.vue';

// 导出组件
export { SuperTable };

// 你也可以导出一个默认的安装函数，方便用户全局注册
export default {
  install: (app) => {
    app.component('SuperTable', SuperTable);
    // 如果有多个组件，可以在这里继续注册
    // app.component('AnotherComponent', AnotherComponent);
  }
};