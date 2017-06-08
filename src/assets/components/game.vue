<template>
    <div id="app">
         <div style="font-size:12px">所有房间信息{{allRoomInfo}}</div>
         <div style="font-size:12px">当前房间信息{{getCurrentRoomInfo}}</div>
         <canvas class="canvas" v-if="isDrawer()" width="600" height="300">
         </canvas>
         <div class="blue" v-else>
		    <image class="getCanvas" src=""></image>
	    </div>
         
    </div>
</template>
<script>
    "use strict";
    import { socket,router} from './../../main';
    import userStorage from './../../localStorage';
    export default{
        data(){
            return {
                mySelf:userStorage.fetch().username,
                getCurrentRoomInfo:{
                                    "000":[{player:'',
                                    }],
                                    roomID:"000",
                                    owner:'null',
                                    drawer:'null',
                                    drawerIP:'null',
                                    roomStatus:'null',
                                } ,  
            }
        },
        methods:{
            isDrawer(){
                if(this.mySelf){
                   if(this.mySelf === this.getCurrentRoomInfo.drawer){
                       return true;
                   }else{
                       return false;
                   }
                }
            },
        },
        computed:{
            allRoomInfo(){ // 获取所有房间信息
                return this.$store.state.allRoomInfo;
            },
        },
        beforeCreate(){
            if(!userStorage.fetch().username){
                alert('没有在首页注册用户');
                             this.$router.replace({ path: "/home" });
                             return;
            };
            socket.on('updateAllroomInfo', allRoomInfo =>{ // 随时监听是否有房间变动
                allRoomInfo = JSON.parse(allRoomInfo);
                if (allRoomInfo.length === 0) {
                    this.$router.replace({ name: "home",params:{roomStatus:'NoRoom'}});
                    return
                }
                this.$store.commit('updateRoomInfo',allRoomInfo);
                console.log('当前allRoomInfo信息:')
                console.log(allRoomInfo);
                console.log('当前route.roomID信息:')
                console.log(this.$route.params.roomID);
                this.getCurrentRoomInfo = allRoomInfo.find(room=>{ // 获取当前房间信息 是否存在
                        return this.$route.params.roomID in room;
                    })
                if(!this.getCurrentRoomInfo){// 此处判断 当房间已经不存在的时候
                    console.log('房间信息更新后,当前房间已经不存在了');
                    this.$router.replace({ name: "home",params:{roomStatus:'ExitRoom'}});
                    return
                }
                console.log('触发了beforecreate');
            });
            // socket.on('rpsBeginGame',()=>{
            //             console.log('接收到rpsBeginGame事件');
            //             this.$router.replace({ name: "game",params:{roomID:this.$route.params.roomID}});
            //         });
        },
        mounted(){
            socket.emit('updateAllroomInfo');
            console.log('room页的mounted执行了');
        },
        watch:{
            getCurrentRoomInfo:{                
                handler:function(room,oldRoom){
                    console.log('getCurrentRoomInfo值发生了变化');
                    console.log('新值为:')
                    console.log(room);
                    console.log('旧值为:')
                    console.log(oldRoom);
                    var roomIndex = this.allRoomInfo.findIndex((room,index)=>{ // 获取当前房间的索引
                    return this.$route.params.roomID in room;
                })
                    if(room.roomStatus ==="isReady"){
                        // this.$router.replace({ name: "room",params:{roomID:this.$route.params.roomID}});
                        this.$router.replace({ name: "home",params:{roomStatus:'GameOver'}});
                        return;
                    }
                    if(!userStorage.fetch().username){
                        alert('没有在首页注册用户');
                             this.$router.replace({ path: "/home" });
                             return;
                    }
                    var userIndex = room[room.roomID].findIndex(key=>{//判断当前房间是否有该用户
                        return userStorage.fetch().username === key.player;
                    })
                    if(userIndex<0){
                        // if(room[room.roomID].length === room.maxNumbers){
                        //     alert('玩家人数已满,不能进入');
                        //     this.$router.replace({ path: "/home" });
                        //     return;
                        // }else{
                        //     var newUser = {};
                        //      newUser.player = userStorage.fetch().username;
                        //      newUser.roomIndex = roomIndex;                            
                        //      socket.emit('updateNewUser', JSON.stringify(newUser));
                        // }
                        alert('游戏正在进行中,不能进入!!!!!')
                        this.$router.replace({ path: "/home" });
                    }
                },
                deep:true,
            }
        },
        beforeRouteLeave: (to, from, next) => {
            console.log('当前to值为:')
            console.log(to)
            if(to.name ==='home'){
                console.log('准备触发exitRoom事件')
                socket.emit('exitRoom', from.params); // 后续记得更改 执行其他功能
            }
        next();
        },
    }
</script>
<style>
    .canvas{
        background-color:white;
    }
    .blue{
        width:100%;
        height:300px;
        max-width:600px;
        background:blue;
    }
</style>