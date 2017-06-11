# my_ydig

> 基于socket.io+Vue2全家桶 独立写的的你画我猜项目
### 目前正在制作中 预计6月末前完成

## 启动
``` bash
# 安装依赖
npm install

# 在package.json中的-host后 和main.js中的ip变量修改为本机的地址
package.json:
"dev": "cross-env NODE_ENV=development webpack-dev-server  --host 192.168.0.123 --open --hot",
main.js 文件:
var ip = "192.168.0.123";

# 开始启动
npm run dev
```

