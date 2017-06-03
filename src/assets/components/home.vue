<template>
    <div id="app">
        <div class="title">
            <div><i class="iconfont icon-magnifier"></i>查询房间</div>
            <div>你画我猜</div>
            <router-link to="/createroom/">创建房间</router-link>
        </div>

    </div>
</template>
<script>
    export default {
        data(){
            return  {
                username:"临时username",
            }
        }
    }
</script>
<style>
    #app{
        width:100%;
        background-color: #00a3af;
        color:white;
        font-size: 20px;
    }
    .title{
        display:  -webkit-flex;
        display: flex;
        justify-content: space-between;
    }
    .title a{
        color:white;
    }
</style>