import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import store from './store/store'
import routes from "./routes"
import './assets/css/layout.css'
import './assets/font/iconfont.css'
document.addEventListener('touchmove', function (e) { e.preventDefault() }, false); //阻止移动端下拉刷新
Vue.use(VueRouter); // 引用vue-router插件
var router = new VueRouter(routes);
var ip = "192.168.0.136"; // !!!!!!!!!!!!!   该地址为调试地址  随时记得要更换 !!!!!!!!!!!!
var socket = io("http://" + ip + ":9999");// 连接socket 
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
export { socket, router}  //导出