import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import store from './store/store'
import routes from "./routes"
import './assets/css/layout.css'
import './assets/font/iconfont.css'
// document.addEventListener('touchmove', function (e) { e.preventDefault() }, false); //阻止移动端下拉刷新
Vue.use(VueRouter); // 引用vue-router插件
var router = new VueRouter(routes);
var ip = "192.168.1.82"; // !!!!!!!!!!!!!   该地址为调试地址  随时记得要更换 !!!!!!!!!!!!
var socket = io("http://" + ip + ":9999");// 连接socket 
Vue.directive('colors', {//定义全局自定义组件
  bind(e, binding) {
    e.style.backgroundColor = "#" + Math.floor(Math.random() * 0xffffff).toString(16); //头像背景随机颜色
  }
});
Vue.filter('firstChar', function (value) {// 定义全局过滤方法
  if (value) {
    return value[0];
  } else {
    return '';
  }
});
// Vue.prototype.updateAllroomInfo =function(socket,$router,$route,$store,getCurrentRoomInfo){
//   socket.on('updateAllroomInfo', allRoomInfo =>{ // 随时监听是否有房间变动
//                 allRoomInfo = JSON.parse(allRoomInfo);
//                 console.log('当前房间剩余数')
//                 console.log(allRoomInfo.length);
//                 if (allRoomInfo.length === 0) {                  
//                     $router.replace({ name: "home",params:{roomStatus:'NoRoom'}});
//                     return
//                 }
//                 $store.commit('updateRoomInfo',allRoomInfo);
//                 console.log('当前allRoomInfo信息:')
//                 console.log(allRoomInfo);
//                 console.log('当前route.roomID信息:')
//                 console.log($route.params.roomID);
//                 getCurrentRoomInfo = allRoomInfo.find(room=>{ // 获取当前房间信息 是否存在
//                         return $route.params.roomID in room;
//                     })
//                 if(!getCurrentRoomInfo){// 此处判断 当房间已经不存在的时候
//                     $router.replace({ name: "home",params:{roomStatus:'ExitRoom'}});
//                     return
//                 }
//                 console.log('触发了beforecreate');
//             });
// }
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
export { socket, router }  //导出