<template>
    <div id="app">
        <div class="title">
            <div><i class="iconfont icon-magnifier"></i>查询房间</div>
            <div>你画我猜</div>
            <label @click="toCreateRoom">创建房间</label>
        </div>
        <div class="user">
            <span class="profile" v-colors>{{userInfo.username|firstChar}}</span>
            <input v-model="inputValue" class="user_input" @keyup.enter="modifyUser" placeholder="请输入一个用户名"></span>
            <label class="modify" @click="modifyUser">修改</label>
        </div>
        <ul >
            <li v-for="(roomInfo,index) in allRoomInfo">
            <span class="profile" v-colors>{{roomInfo.owner|firstChar}}</span>
            房主:{{roomInfo.owner}} 
            房主地址:{{roomInfo.ownerIP}} 房间人数:{{roomInfo.players.length}}</li>
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
            }
        },
        beforeCreate(){
            socket.on('updateAllroomInfo',allRoomInfo=>{ // 随时监听是否有房间变动
                allRoomInfo = JSON.parse(allRoomInfo);
                this.$store.commit('updateRoomInfo',allRoomInfo);
            })
        },
        methods: {
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
                    maxNumbers:5, // 设置最多成员
                    players: [],//{ player: this.userInfo.username, playerIP:'', }, // 初始化房主 添加到玩家成员里
                };
                socket.emit('createRoom', roomInfo); // 向服务器传达 createroom事件
                socket.on('message',function(room){
                    room = JSON.parse(room);
                    router.push({name:'room',params:{roomID:room.roomID,owner:room.owner}})
                })
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
            }
        },
        directives: {
            colors: {
                bind(e, binding) {
                    e.style.backgroundColor = "#" + Math.floor(Math.random() * 0xffffff).toString(16); //头像背景随机颜色
                }
            },
        },
        filters: {
            firstChar(value) {
                if (value) {
                    return value[0];
                } else {
                    return '';
                }
            }
        }
    }

</script>
<style>
    .user {
        /*font-size: 20px;*/
    }

    .profile {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        background-color: #00a3af;
        border-radius: 50%;
        height: 50px;
        width: 50px;
        line-height: 50px;
        color: white;
        font-size: 30px;
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
</style>