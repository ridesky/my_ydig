import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import store from './store/store'
import routes from "./routes"
import './assets/css/layout.css'
import './assets/font/iconfont.css'
Vue.use(VueRouter); // 引用vue-router插件
var router = new VueRouter(routes);
var ip = "192.168.1.82"; // !!!!!!!!!!!!!   该地址为调试地址  随时记得要更换 !!!!!!!!!!!!
// var socket = io("http://" + ip + ":3000");// 连接socket 
var socket = io ("http://ridesky.leanapp.cn/");
Vue.directive('colors', {//定义全局自定义组件
  bind(e, binding) {
    e.style.backgroundColor = "#" + Math.floor(Math.random() * 0xffffff).toString(16); //头像背景随机颜色
  }
});
Vue.directive('fontcolors',{
  bind(e,binding){
    e.style.color = "#" + Math.floor(Math.random() * 0xffffff).toString(16); //文字颜色随机
  }
});
Vue.filter('firstChar', function (value) {// 定义全局过滤方法
  if (value) {
    return value[0];
  } else {
    return '';
  }
});
Vue.filter('filtersUserName', function (value) {
  if (value) {
    if (value.player) {
      return value.player[0];
    } else {
      return null;
    }
  } else {
    return null;
  }
});
Vue.filter('filtersScore', function (value) {
  if (value) {
    if (value.player) {
      return value.score;
    } else {
      return null;
    }
  } else {
    return null;
  }
});
Vue.filter('judgeUser', function (value) {
  if (value) {
    return value.player;
  } else {
    return value;
  }
});

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
export { socket, router }  //导出