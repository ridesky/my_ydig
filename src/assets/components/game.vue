<template>
    <div id="app">
        <!--<div style="font-size:12px">所有房间信息{{allRoomInfo}}</div>-->
        <!--<div style="font-size:12px">当前房间信息{{getCurrentRoomInfo}}</div>-->
        <div v-show="isDrawer()">题目: {{topic}}</div>
        <div v-show="!isDrawer()">提示: {{prompt}}</div>
        <div class="title text_center" v-colors>
            <span class="">现在由<span v-fontcolors>{{getCurrentRoomInfo.drawer}}</span>开始画图</span>
        </div>
        <div class="content">
            <div class="dialog" v-show="showAnswer"><p>答案:<br/>{{getAnswer}}</p></div>
            <canvas class="canvas" v-show="isDrawer()" width="600" height="350" v-fit>
                <!-- v-show="isDrawer()" -->
            </canvas>
            <div class="blue" v-show="!isDrawer()" v-fit>
                <!-- v-show="!isDrawer()" -->
                <img class="getCanvas" src="" v-fit></img>
            </div>
        </div>

        <input type="text" v-show="!isDrawer()" @keyup.13="sendAnswer" class="answer_input" v-model="input_value">

        <ul class="player_ul clearfix">
            <li v-for="(n,index) in 6" class="player_list" v-show="getCurrentRoomInfo[getCurrentRoomInfo.roomID][index]">
                <div class="user_pro">
                    <span class="profile" v-colors>{{getCurrentRoomInfo[getCurrentRoomInfo.roomID][index]|filtersUserName}}</span>
                    <span class="score">{{getCurrentRoomInfo[getCurrentRoomInfo.roomID][index]|filtersScore}}</span>
                </div>
                <p v-show="!getCurrentRoomInfo[getCurrentRoomInfo.roomID][index]">{{"等待加入"}}</p>
                <p>{{getCurrentRoomInfo[getCurrentRoomInfo.roomID][index]|judgeUser}}</p>
            </li>
        </ul>

    </div>
</template>
<script>
    "use strict";
    import { socket, router } from './../../main';
    import userStorage from './../../localStorage';
    export default {
        data() {
            return {
                mySelf: userStorage.fetch().username,
                getCurrentRoomInfo: {
                    "000": [{
                        player: '',
                    }],
                    roomID: "000",
                    owner: 'null',
                    drawer: 'null',
                    drawerIP: 'null',
                    roomStatus: 'null',
                },
                canvasSrc: '',
                input_value: '',
                topic: '',
                prompt: '',
                roomIndex: '',
                showAnswer: false,
                getAnswer: '',
            }
        },
        methods: {
            isDrawer() {
                if (this.mySelf) {
                    if (this.mySelf === this.getCurrentRoomInfo.drawer) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            sendAnswer() {
                if (this.input_value.trim()) {
                    if (this.input_value.length <= 20) {
                        socket.emit('sendAnswer', { answer: this.input_value, roomIndex: this.roomIndex });
                        this.input_value = "";
                    } else {
                        alert('发送信息不得超过20个字符!');
                    };
                };

            },
        },
        computed: {
            allRoomInfo() { // 获取所有房间信息
                return this.$store.state.allRoomInfo;
            },
        },
        beforeCreate() {
            if (!userStorage.fetch().username) {
                alert('没有在首页注册用户');
                this.$router.replace({ path: "/home" });
                return;
            };
            socket.on('updateAllroomInfo', allRoomInfo => { // 随时监听是否有房间变动
                allRoomInfo = JSON.parse(allRoomInfo);
                if (allRoomInfo.length === 0) {
                    this.$router.replace({ name: "home", params: { roomStatus: 'NoRoom' } });
                    return
                }
                this.$store.commit('updateRoomInfo', allRoomInfo);
                // console.log('当前allRoomInfo信息:')
                // console.log(allRoomInfo);
                // console.log('当前route.roomID信息:')
                console.log(this.$route.params.roomID);
                this.getCurrentRoomInfo = allRoomInfo.find(room => { // 获取当前房间信息 是否存在
                    return this.$route.params.roomID in room;
                })
                if (!this.getCurrentRoomInfo) {// 此处判断 当房间已经不存在的时候
                    console.log('房间信息更新后,当前房间已经不存在了');
                    this.$router.replace({ name: "home", params: { roomStatus: 'ExitRoom' } });
                    return
                }
                // console.log('触发了beforecreate');
            });
            socket.on('sendTopic', topicMsg => {
                console.log('收到了sendTopic消息')
                console.log(topicMsg);
                this.topic = topicMsg.topic;
                this.prompt = topicMsg.prompt;
            })
        },
        directives: {
            fit: {
                bind(e, binding) {
                    e.width = document.body.clientWidth;
                    e.height = 350;
                }
            }
        },
        mounted() {
            socket.emit('updateAllroomInfo');
            console.log('room页的mounted执行了');
            var drawCanvas = document.querySelector(".canvas");
            var getCanvas = document.querySelector(".getCanvas");
            var getContent = document.querySelector(".content");
            var canvas_context = drawCanvas.getContext('2d');
            drawCanvas.addEventListener('touchmove', function (e) { e.preventDefault() }, false); //阻止移动端在canvas中下拉
            drawCanvas.onmousedown = (ev) => {// pc端
                var event = window.event || ev;
                canvas_context.moveTo(event.clientX - getContent.offsetLeft, event.clientY - getContent.offsetTop + document.body.scrollTop);
                document.onmousemove = (ev) => {
                    //move事件
                    var event = window.event || ev;
                    // console.log("event.clientX 为"+ event.clientX);
                    // console.log('drawCanvas.offsetLeft 为'+ drawCanvas.offsetLeft);
                    // console.log('content left :' + getContent.offsetLeft)
                    canvas_context.lineTo(event.clientX - getContent.offsetLeft, event.clientY - getContent.offsetTop + document.body.scrollTop);
                    canvas_context.stroke();
                    console.log('准备触发onDraw事件')
                    socket.emit('onDraw', { url: drawCanvas.toDataURL('image/jpg', 1), roomIndex: this.roomIndex });//触发onDraw 事件
                }
                document.onmouseup = () => {
                    document.onmousemove = null;
                };
            };

            drawCanvas.ontouchstart = (ev) => {// 移动端
                var event = ev.touches[0];
                canvas_context.moveTo(event.clientX - getContent.offsetLeft, event.clientY - getContent.offsetTop + document.body.scrollTop);
                document.ontouchmove = (ev) => {
                    var event = ev.touches[0];
                    canvas_context.lineTo(event.clientX - getContent.offsetLeft, event.clientY - getContent.offsetTop + document.body.scrollTop);
                    canvas_context.stroke();
                    socket.emit('onDraw', { url: drawCanvas.toDataURL('image/jpg', 1), roomIndex: this.roomIndex });//触发onDraw 事件

                };
                document.ontouchend = () => {
                    document.ontouchmove = null;
                };
            };
            socket.on('onDraw', url => {
                console.log('接受到了onDraw事件');
                getCanvas.src = url;
            });
            socket.on('rpsSendAnswer', msg => {
                // console.log('接收到了消息');
                console.log(msg);
            })
            socket.on('getAnswer',topic=>{
                this.getAnswer = topic;
                this.showAnswer = true;
                var getAnswer = setTimeout(()=>{
                    this.showAnswer = false;
                    clearTimeout(getAnswer);
                }, 3000);
            })
        },
        watch: {
            getCurrentRoomInfo: {
                handler: function (room, oldRoom) {
                    // console.log('getCurrentRoomInfo值发生了变化');
                    // console.log('新值为:')
                    // console.log(room);
                    // console.log('旧值为:')
                    // console.log(oldRoom);
                    if (room.drawer != this.mySelf) {
                        var drawCanvas = document.querySelector(".canvas");
                        drawCanvas.height = 350;
                    } else {
                        var getCanvas = document.querySelector(".getCanvas");
                        getCanvas.src = "";
                    }
                    this.roomIndex = this.allRoomInfo.findIndex((room, index) => { // 获取当前房间的索引
                        return this.$route.params.roomID in room;
                    })
                    if (room.roomStatus === "isReady") {
                        // this.$router.replace({ name: "room",params:{roomID:this.$route.params.roomID}});
                        this.$router.replace({ name: "home", params: { roomStatus: 'GameOver' } });
                        return;
                    }
                    if (!userStorage.fetch().username) {
                        alert('没有在首页注册用户');
                        this.$router.replace({ path: "/home" });
                        return;
                    }
                    var userIndex = room[room.roomID].findIndex(key => {//判断当前房间是否有该用户
                        return userStorage.fetch().username === key.player;
                    })
                    if (userIndex < 0) {
                        alert('游戏正在进行中,不能进入!!!!!')
                        this.$router.replace({ path: "/home" });
                    }
                },
                deep: true,
            }
        },
        beforeRouteLeave: (to, from, next) => {
            console.log('当前to值为:')
            console.log(to)
            if (to.name === 'home') {
                console.log('准备触发exitRoom事件')
                socket.removeListener('rpsSendAnswer');//退出房间后 移除接受消息的监听事件
                socket.removeListener('rpsBeginGame');//退出房间后 移除接收rpsBgeingame事件
                socket.emit('exitRoom', from.params); // 后续记得更改 执行其他功能
            }
            next();
        },
    }

</script>
<style>
    .canvas {
        background-color: white;
        width: 100%;
    }

    .blue {
        width: 100%;
        height: 350px;
        max-width: 600px;
        background: #fff;
    }

    .answer_input {
        border-radius: 3px;
        width: 100%;
        height: 30px;
        padding: 10px;
    }

    .player_list {
        float: left;
        width: 16.5%;
        padding-top: 20px;
        font-size: 12px;
    }

    .user_pro {
        position: relative;
    }

    .score {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -7px;
        margin-left: 15px;
        vertical-align: middle;
        text-align: center;
        border-radius: 50%;
        width: 17px;
        height: 17px;
        display: inline-block;
        background-color: rgb(241, 94, 102);
        color: #fff;
    }
    .content{
        position: relative;
    }
    .dialog {
        text-align: center;
        width: 200px;
        height: 200px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -100px;
        margin-left: -100px;
        background-color: #f5b1aa;
        border-radius: 50%;
        color: #fff;
    }
    .dialog p{
        /*line-height: 200px;*/
        width: 100px;
        height: 100px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
    }
</style>