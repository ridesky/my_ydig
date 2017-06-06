import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
      state:{
          allRoomInfo:null,
      },
      mutations:{
          updateRoomInfo(state,value){
              state.allRoomInfo = value;
          },
      },
})