import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Home from './assets/components/home.vue'
import Room from './assets/components/room.vue'

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
      path:"/room/:roomID",
      component: Room,
    }
  ]
});
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});


 ( ()=>{
  console.log('hello world man');
})()