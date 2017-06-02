import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Home from './assets/components/home.vue'
import Room from './assets/components/room.vue'

import './assets/css/layout.css'
// 引用vue插件
Vue.use(VueRouter);


// 路由配置
var router = new VueRouter({
  routes: [
    {
      path: "/home",
      component: Home,
    },
    {
      path: "*",
      redirect: '/home',
    },
    {
      path: "/room/:roomID",
      component: Room,
    },
    {
      path: "*",
      redirect: '/home',
    },
  ]
});
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});