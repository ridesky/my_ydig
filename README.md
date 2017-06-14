# my_ydig

> 基于 socket.io + Vue2 全家桶独立写的的你画我猜项目
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

### 启动后主页如下:

<img src="https://github.com/ridesky/ridesky.github.io/blob/master/%E6%88%BF%E9%97%B4%E5%88%97%E8%A1%A8.jpg?raw=true" width = "360" height = "640" alt="图片名称" align=center />

- 在首页添加用户名
- 列表可以实时更新当前在线的房间和游戏状态
- 查询房间功能暂时未添加

### 创建房间后如图:

<img src="https://github.com/ridesky/ridesky.github.io/blob/master/%E5%87%86%E5%A4%87.jpg?raw=true" width = "360" height = "640" alt="图片名称" align=center />

- "盆"和 "笔记本"是我用电脑和另外的手机分别加入的房间
- 房间最多可加入6人

### 游戏开始界面:
<img src="https://github.com/ridesky/ridesky.github.io/blob/master/%E7%94%BB%E5%9B%BE.jpg?raw=true" width = "360" height = "640" alt="图片名称" align=center />

- 绘图者的界面顶部是出题题目,进行绘图
- 猜图者顶部显示的是文字提示

<img src="https://github.com/ridesky/ridesky.github.io/blob/master/%E8%AF%84%E5%88%86.jpg?raw=true" width = "360" height = "640" alt="图片名称" align=center />

- 在input输入框中输入答案.
- 猜图者答对题后,drawer加一分,第一个猜对图的加两分,接下来猜对的加一分
- 每回合结束后 界面弹出正确答案:

<img src="https://github.com/ridesky/ridesky.github.io/blob/master/%E7%AD%94%E6%A1%88%E5%BC%B9%E5%87%BA.jpg?raw=true" width = "360" height = "640" alt="图片名称" align=center />

### Balabala

项目写完刚不久,可能存在一些未知的bug,还没有经过足够的测试,目前来说,游戏的基本玩法功能已经都满足了.代码结构还不够完善,还需要提高知识水平,希望有兴趣看源码的多多指点,虚心接受各路大牛的指教和批评~

- [server 端传送门](https://github.com/ridesky/my_ydig_server) 

> ps: 目前正在离职中,期盼加入一个有原创精神有活力的公司,这是我的[在线简历](http://www.ridesky.me)
