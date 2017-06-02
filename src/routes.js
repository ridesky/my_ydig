import App from "././App.vue"
import Home from "./assets/components/home.vue"
import Room from "./assets/components/room.vue"

// 路由配置
export default {
  routes: [
    {
      path:"/",
      component:App,
    },
    {
      path: "/home",
      component: Home,
    },
    {
      path: "/room/:roomID",
      component: Room,
    },
  ]
};