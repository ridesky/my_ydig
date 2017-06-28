# my_ydig

> 基于 socket.io + Vue2 全家桶独立写的的你画我猜项目 [示例demo](http://ridesky.me/)
### 初步已完成,未来进行代码优化.

## 启动

``` bash

# 安装依赖
npm install

# 在package.json中的-host后 和main.js中的ip变量修改为本机的地址 (在命令提示符中输入ipconfig后 查看ipv4对应的地址)

# package.json:

"dev": "cross-env NODE_ENV=development webpack-dev-server  --host 192.168.0.123 --open --hot",

# main.js 文件:

var ip = "192.168.0.123";

# 开始启动

npm run dev

```

* 技术栈-前端
    
    * vue 2.0
    * vue-router
    * vuex
    * es6模块化

* 技术栈-后端    [项目地址](https://github.com/ridesky/my_ydig_server) 
    
    * socket.io
    * express
    * server 端采用 commonJS 规范的模块化
    
###  启动后主页:

- 在首页添加用户名
- 列表可以实时更新当前在线的房间和游戏状态
- 查询房间功能暂时未添加

    项目是基于vue做的单页面应用,client端通过监听server端自定义的"updateAllroomInfo"事件接受所有房间信息,存储到vuex的store里,进行实各组件时更新房间信息数据,右上角创建房间,在server端进行房间初始化:

<img src="https://github.com/ridesky/ridesky.github.io/blob/master/%E6%88%BF%E9%97%B4%E5%88%97%E8%A1%A8.jpg?raw=true" width = "360" height = "640" alt="图片名称" align=center />

```js
    var roomInfo = { // 创建房间前 初始化信息 记得让服务器返回一个房间ID
                    owner: this.userInfo.username,// 初始化房主
                    roomID:null, // 初始化 服务器端进行修改
                    ownerIP:null,// 初始化 服务器端进行修改
                    roomStatus:'isReady', // 设置 ready gaming 等状态
                    maxNumbers:6, // 设置最多成员客户端负责初始化  服务端负责修改
                    playerIP:'',  // 初始化房主 添加到玩家成员里
                };

```

### 创建后进入房间页面:

- "盆"和 "笔记本"是我用电脑和另外的手机分别加入的房间
- 房间最多可加入6人
    
    房间功能也是每当有玩家进入后则更新房间信息获取所有玩家对象,然后v-if遍历一遍,添加到列表中.

<img src="https://github.com/ridesky/ridesky.github.io/blob/master/%E5%87%86%E5%A4%87.jpg?raw=true" width = "360" height = "640" alt="图片名称" align=center />

### 游戏开始界面:

- 绘图者的界面顶部是出题题目,进行绘图
- 猜图者顶部显示的是文字提示

    pc端和移动端通过使用原生js事件来绘制canvas画布,通过base64编码的格式传送给各个socket客户端接收然后在img标签上渲染.

<img src="https://github.com/ridesky/ridesky.github.io/blob/master/%E7%94%BB%E5%9B%BE.jpg?raw=true" width = "360" height = "640" alt="图片名称" align=center />

- 在input输入框中输入答案.
- 猜图者答对题后,绘图者加一分,第一个猜对图的加两分,接下来猜对的加一分

<img src="https://github.com/ridesky/ridesky.github.io/blob/master/%E8%AF%84%E5%88%86.jpg?raw=true" width = "360" height = "640" alt="图片名称" align=center />

- 每回合结束后 界面弹出正确答案:

<img src="https://github.com/ridesky/ridesky.github.io/blob/master/%E7%AD%94%E6%A1%88%E5%BC%B9%E5%87%BA.jpg?raw=true" width = "360" height = "640" alt="图片名称" align=center />

通过在服务端设置setInterval计时器来对每回合计时,对房间玩家是否退出房间,是否到第二轮进行判断(当有玩家中途退出时,根据当前索引值和玩家数来更改绘图者的索引).对玩家答题状态,绘图者身份,答题人数进行重置.

### Balabala

- 写游戏功能的过程中遇到过一些问题,如server端监听到socket客户端触发的事件后设置的setInterval计时器无法通过另外一端的socket客户端清除,导致目前没有办法解决当所有答题者答题正确后立即进行下一回合的功能实现,

- 项目写完刚不久,可能存在一些未知的bug, 目前来说,游戏的基本玩法功能已经都满足了.代码结构还不够完善,还需要提高知识水平,希望有兴趣看源码的多多指点,发现文档有描述不清楚的功能实现不完美的希望在底下留言,虚心接受各路大牛的指教和批评~

