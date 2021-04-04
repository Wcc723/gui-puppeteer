import workComponent from './workComponent.js';
import listComponent from './listComponent.js';

const routes = [
  {
    path: '/list',
    component: listComponent
  },
  {
    path: '/worker',
    component: workComponent
  },
  {
    path: '/worker/:id',
    component: workComponent
  }
];

// 路由設定
const router = VueRouter.createRouter({
  // 網址路徑模式：使用網址 hash 的形式
  history: VueRouter.createWebHashHistory(),
  // 匯入路由表
  routes
});

export default router;
