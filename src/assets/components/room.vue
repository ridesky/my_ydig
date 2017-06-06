<template>
    <div id="app" class="wait_room bg_wood">
        <div class="title text_center">
            <span class="">你画我猜</span>
        </div>
        This is Rooms {{ $route.params }}
        <div style="font-size:12px;">当前房间信息: {{ getCurrentRoomInfo }}</div>
        <ul>
            <li class="profile"></li>
        </ul>  
    </div>
</template >
    <script>
        "use strict";
    import {socket, router} from './../../main';
    import userStorage from './../../localStorage';
    export default {
            data(){
                    return {
                    }
                },
            methods:{
            
            },
        beforeCreate(){
            socket.on('updateAllroomInfo', allRoomInfo =>{ // 随时监听是否有房间变动
                allRoomInfo = JSON.parse(allRoomInfo);
                if (allRoomInfo.length === 0) {
                    this.$router.replace({ name: "home",params:{roomStatus:'NoRoom'}});
                    return
                }
                this.$store.commit('updateRoomInfo',allRoomInfo);
            });
        },
        mounted(){
            if(!this.allRoomInfo){
                this.$router.replace({ path: "/home" });
                return;
            }
            var roomIndex = this.allRoomInfo.findIndex((room,index)=>{ // 获取当前房间的索引
                return this.$route.params.roomID in room;
            })
            var room  = this.allRoomInfo[roomIndex]; //获取当前房间
            if(room){
                 if (room.roomStatus === "isReady") {
                    if (userStorage.fetch().username) {
                        var newUser = {};
                        newUser.player = userStorage.fetch().username;
                        newUser.roomIndex = roomIndex;                            
                        socket.emit('updateNewUser', JSON.stringify(newUser));
                    } else {
                        alert("没有在首页注册用户");
                        return;
                    }
            } else if (room.roomStatus === "isPlaying") {
                alert("游戏正在进行中,不能进入");
                this.$router.replace({ path: "/home" });
                return;
            }
        };
           
        },
        computed:{
            allRoomInfo(){ // 获取所有房间信息
                return this.$store.state.allRoomInfo;
            },
            getCurrentRoomInfo(){ // 获取当前房间信息  
                if(this.allRoomInfo){
                    var currentRoom = this.allRoomInfo.find(room=>{
                        return this.$route.params.roomID in room;
                    })
                    return currentRoom;
                }
            }
        },
        beforeRouteEnter: (to, from, next) => {
            if(!userStorage.fetch().username){
                 alert("没有在首页注册用户");
                 return;
            }else{
                next();
            }
        },
        beforeRouteLeave: (to, from, next) => {
            console.log(to)
            if(to.name ==='home'){
                socket.emit('exitRoom', from.params); // 后续记得更改 执行其他功能
            }
        next();
        },
    }

</script>
<style>
 .text_center{
     text-align:center;
 }
</style>