<template>
    <div id="app" class="bg_wood">
        <div class="title" v-colors>
            <div><i class="iconfont icon-magnifier"></i>查询房间</div>
            <div>你画我猜</div>
            <label @click="toCreateRoom">创建房间</label>
        </div>
        <div class="user">
            <span class="profile" v-colors>{{userInfo.username|firstChar}}</span>
            <input v-model="inputValue" class="user_input" @keyup.enter="modifyUser" placeholder="请输入一个用户名"></span>
            <label class="modify" @click="modifyUser">修改</label>
        </div>
        <div v-show="allRoomInfo.length===0">并没有房间</div>
        <div v-show="allRoomInfo.length>0">当前房间列表</div>
        <ul>
            <li v-for="(roomInfo,index) in allRoomInfo" class="room_list" @click="toEnterRoom(roomInfo)">
                <span class="profile" v-colors>{{roomInfo.owner|firstChar}}</span>
                <div class="list_content">
                    <label class="roomIn">进入房间 房主:{{roomInfo.owner}} </label>
                    <p>房间人数:{{roomInfo[roomInfo.roomID].length}}/{{roomInfo.maxNumbers}}
                        <span class="status">{{getStatus(roomInfo.roomStatus)}}</span>
                    </p>
                </div>            
            </li>
        </ul>
    </div>
</template>
<script>
    "use strict";
    import { socket,router} from './../../main'
    import userStorage from './../../localStorage'
    export default {
        data() {
            return {
                userInfo: userStorage.fetch(), //加载localstorage
                inputValue: "",//用于修改用户名

            }
        },
        computed:{
            allRoomInfo(){
                return this.$store.state.allRoomInfo; // 从store中获取 allRoomInfo数据
            },
        },
        beforeCreate(){
            console.log(socket);
            socket.on('updateAllroomInfo',allRoomInfo=>{ // 随时监听是否有房间变动
                allRoomInfo = JSON.parse(allRoomInfo);
                this.$store.commit('updateRoomInfo',allRoomInfo);
            })
        },
        beforeRouteEnter: (to, from, next) => {
            console.log(to.params.roomStatus);
            if(to.params.roomStatus ==="NoRoom"){// 判断是否从room页返回
                alert('目前没有创建的房间,或者当房间仅存一人时,你进行了刷新页面断开连接.');
            };
            if(to.params.roomStatus === "ExitRoom"){
                alert('您已退出房间!');
            };
            next();
        },
        methods: {
            getStatus(roomStatus){
                switch (roomStatus) {
                    case 'isReady':
                        return '等待中..'
                        break;
                    case'isGaming':
                        return '游戏中'
                        break;
                    default: 
                        return '未知状态..'
                        break;
                }
            },
            modifyUser() {
                if (this.inputValue.length > 8) {
                    alert('用户名不能长于8个字');
                    this.inputValue = "";
                    return;
                } else {
                    if (this.inputValue.trim()) {
                        this.userInfo.username = this.inputValue.trim();
                    }
                }
                userStorage.save(this.userInfo);
            },
            toCreateRoom() {
                if (!this.userInfo.username) {
                    alert("创建房间之前,请在表单中创建一个用户名!");
                    return;
                }
                var roomInfo = { // 创建房间前 初始化信息 记得让服务器返回一个房间ID
                    owner: this.userInfo.username,// 初始化房主
                    roomID:null, // 初始化 等待服务器设置
                    ownerIP:null,// 初始化 等待服务器设置
                    roomStatus:'isReady', // 设置 ready gaming end undefined,
                    maxNumbers:5, // 设置最多成员客户端负责初始化  服务端负责真正设置
                    players: [],//{ player: this.userInfo.username, playerIP:'', }, // 初始化房主 添加到玩家成员里
                };
                socket.emit('createRoom', roomInfo); // 向服务器传达 createroom事件
                socket.on('message',function(room){
                    room = JSON.parse(room);
                    router.push({name:'room',params:{roomID:room.roomID}})
                })
            },
            toEnterRoom(roomInfo){
                if(roomInfo[roomInfo.roomID].length === roomInfo.maxNumbers){
                    alert('房间人数已满,不能进入!!');
                    return;
                }else if(roomInfo.roomStatus ==="isReady"){
                     router.push({name:'room',params:{roomID:roomInfo.roomID}})
                }else if(roomInfo.roomStatus ==="isGaming"){
                    router.push({name:'game',params:{roomID:roomInfo.roomID}})
                }
            },
        },        
    }

</script>
<style>
body{
   
        /*font-size: 20px;*/
    }
    .title{
        padding:8px 10px;
    }
    .user_input {
        display: inline-block;
        width: 120px;
    }

    .modify {
        font-size: 13px;
        color: white;
        border-radius: 2px;
        padding: 3px 5px;
        background-color: #00a3af;
    }
    .room_list{
        display: -webkit-flex;
        display:flex;
        align-content: center;
        padding:15px 10px;
        font-size: 15px;
        cursor:pointer;
    }
    .list_content{
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    .status{
        float:right;
    }
</style>