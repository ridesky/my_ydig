// import App from "././App.vue"
import Home from "./assets/components/home.vue"
import Room from "./assets/components/room.vue"
import Game from "./assets/components/game.vue"

// 路由配置
export default {
  routes: [
    {
      path:"/",
      redirect: "/home"
      // component:App,
    },
    {
      path: "/home",
      name:'home',
      component: Home,
    },
    {
      path: "/room/:roomID",
      name:"room",
      component: Room,
    },
    {
      path:"/game/:roomID",
      name:"game",
      component :Game,
    }
  ]
};