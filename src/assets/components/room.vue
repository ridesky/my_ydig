<template>
    <div>
        This is Rooms {{$route.params}}
        <div @click="changeValue('我触发了')">点击触发</div>
        <div>{{getUpdate}}</div> 
        <div>{{getAllRoomInfo}}</div>
    </div>
</template>
<script>
    "use strict";
    import { socket, router} from './../../main';
    export default {
        data(){
            return {
              
            }
        },
        methods:{
            changeValue:function(value){
                this.$store.commit('update',value);
            }
        },
        computed:{
            getUpdate(){
                return this.$store.state.msg;
            },
            getAllRoomInfo(){
                return this.$store.state.allRoomInfo;
            }
        },
        beforeRouteLeave: (to, from, next) => {
            window.addEventListener('popstate', function () { // 在room 执行后退时 断开连接
                socket.emit('exitRoom'); // 后续记得更改 执行其他功能
                
            });
            next();
        },
    }

</script>