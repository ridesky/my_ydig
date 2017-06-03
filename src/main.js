import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Home from './assets/components/home.vue'
import Room from './assets/components/room.vue'
import routes from "./routes"
import './assets/css/layout.css'
import './assets/font/iconfont.css'

document.addEventListener('touchmove', function (e) { e.preventDefault() }, false); //阻止移动端下拉刷新
Vue.use(VueRouter); // 引用vue插件
const router = new VueRouter(routes);
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});