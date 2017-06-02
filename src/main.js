import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Home from './assets/components/home.vue'
import Room from './assets/components/room.vue'
import routes from "./routes"
import './assets/css/layout.css'

// 引用vue插件
Vue.use(VueRouter);
const router = new VueRouter(routes);

new Vue({
  el: '#app',
  router, 
  render: h => h(App)
});