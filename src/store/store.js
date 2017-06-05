import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
      state:{
          msg:"I m ok",
          allRoomInfo:null,
      },
      mutations:{
          update(state,value){
              state.msg=value;
          },
          updateRoomInfo(state,value){
              state.allRoomInfo = value;
          }
      },
})