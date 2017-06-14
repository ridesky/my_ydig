<template>
    <div id="app" class="wait_room bg_wood">
        <div class="title text_center" v-colors>
            <span class="">你画我猜</span>
        </div>
        <!--This is Rooms {{ $route.params }}-->
        <!--<div style="font-size:12px;">当前房间信息: {{ getCurrentRoomInfo }}</div>-->
        <!--<div style="font-size:12px;">所有房间息: {{  allRoomInfo }}</div>-->
        <div class="userContent">
            <div>你是<p class="profile">{{mySelf|firstChar}}</p>{{mySelf}}</div>
            <ul class="player_ul clearfix">
                <li v-for="(n,index) in 6" class="player_list">
                    <span class="profile" v-colors >{{getCurrentRoomInfo[getCurrentRoomInfo.roomID][index]|filtersUserName}}</span>
                    <p v-show="!getCurrentRoomInfo[getCurrentRoomInfo.roomID][index]">{{"等待加入"}}</p>
                    <p>{{getCurrentRoomInfo[getCurrentRoomInfo.roomID][index]|judgeUser}}</p>
                </li>
            </ul>
            <div v-show="getCurrentRoomInfo.owner === mySelf" @click="toBeginGame"  class="begin"> <label>开始游戏!</label> </div>
        </div>
    </div>
</template >
<script>
        "use strict";
        import {socket, router} from './../../main';
        import userStorage from './../../localStorage';
        export default {
            data(){
                    return {
                        mySelf:userStorage.fetch().username, 
                        getCurrentRoomInfo:{
                            "000":[{
                                    player:'',
                                }],
                            roomID:"000",
                            owner:'null',
                        } ,                      
                    }
                },
            methods:{
                toBeginGame(){
                    console.log('开启了toBeginGame方法');
                    socket.emit('beginGame',this.$route.params.roomID);                    
                },         
            },            
        beforeCreate(){
            // var vm = this;
            // vm.updateAllroomInfo(socket,vm.$router,vm.$route,vm.$store,vm.getCurrentRoomInfo);//getCurrentRoomInfo是引用值 传参后改值会失效
            socket.on('updateAllroomInfo', allRoomInfo =>{ // 随时监听是否有房间变动
                allRoomInfo = JSON.parse(allRoomInfo);
                if (allRoomInfo.length === 0) {
                    this.$router.replace({ name: "home",params:{roomStatus:'NoRoom'}});
                    return
                }
                this.$store.commit('updateRoomInfo',allRoomInfo);
                console.log('updateAllroomInfo 消息接收');
                console.log('当前allRoomInfo信息:')
                console.log(allRoomInfo);
                // console.log('当前route.roomID信息:')
                // console.log(this.$route.params.roomID);
                this.getCurrentRoomInfo = allRoomInfo.find(room=>{ // 获取当前房间信息 是否存在
                        return this.$route.params.roomID in room;
                    })
                if(!this.getCurrentRoomInfo){// 此处判断 当房间已经不存在的时候
                    this.$router.replace({ name: "home",params:{roomStatus:'ExitRoom'}});
                    return
                }
                // console.log('触发了beforecreate');
            });
            socket.removeListener('rpsBeginGame');//执行前 先移除之前的监听事件
            socket.on('rpsBeginGame',()=>{
                        var roomIndex = this.allRoomInfo.findIndex((room,index)=>{ // 获取当前房间的索引
                            return this.$route.params.roomID in room;
                        })
                        socket.emit('gamePlaying',roomIndex);
                    });
          socket.on('toEnterGame',()=>{
              this.$router.replace({ name: "game",params:{roomID:this.$route.params.roomID}});
          })  
        }, 
        mounted(){
            socket.emit('updateAllroomInfo');
            // console.log('room页的mounted执行了');
        },
        watch:{
            getCurrentRoomInfo:{                
                handler:function(room,oldRoom){
                    // console.log('getCurrentRoomInfo值发生了变化');
                    // console.log('新值为:')
                    // console.log(room);
                    // console.log('旧值为:')
                    // console.log(oldRoom);
                    var roomIndex = this.allRoomInfo.findIndex((room,index)=>{ // 获取当前房间的索引
                    return this.$route.params.roomID in room;
                })
                    if(room.roomStatus === 'isReady'){
                        if(userStorage.fetch().username){
                            console.log('执行了 var newUser');
                            var newUser = {};
                            newUser.player = userStorage.fetch().username;
                            newUser.roomIndex = roomIndex;                            
                            socket.emit('updateNewUser', JSON.stringify(newUser));
                        }else{
                            this.$router.replace({ path: "/home" });
                            return;
                        }
                    }else if(room.roomStatus === 'isGaming'){
                        alert("游戏正在进行中,不能进入");
                        this.$router.replace({ path: "/home" });
                        return;
                    }
                    else{
                        alert('房间状态未知');
                        this.$router.replace({ path: "/home" });
                        return;
                    }
                },
                deep:true,
            }
        },
        computed:{
            allRoomInfo(){ // 获取所有房间信息
                return this.$store.state.allRoomInfo;
            },
        },
        beforeRouteEnter: (to, from, next) => {
            if(!userStorage.fetch().username){
                alert('没有在首页注册用户!!');
                next('/home')
                return;
            }else{
                next();
            }
        },
        beforeRouteLeave: (to, from, next) => {
            // console.log('当前to值为:')
            // console.log(to)
            if(to.name ==='home'){
                console.log('准备触发exitRoom事件')
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
 .player_ul{
     display:-webkit-flex;
     display: flex;
     text-align: center;
 }
.player_list{
    float: left;
    width: 33.33%;
    padding-top: 20px;
}
.begin{
    position: relative;
    text-align: center;
    margin-bottom: 10px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: rgb(216, 17, 91);
    color: #fff;
    margin: 20px auto;
    cursor: pointer;
}
.begin:hover{
    box-shadow: #ba2636 0px 0px 10px;
}
.begin label{
    width: 50px;
    height: 50px;
    /*display: inline-block;*/
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -25px;
    margin-top: -25px;
    cursor: pointer;
}
</style>