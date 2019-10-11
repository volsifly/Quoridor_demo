# 关于Quoridor
>步步为营，又名围追堵截，英文名为Quoridor。是著名游戏设计师Mirko Marchesi设计的著名游戏，1995年Mirko Marchesi推出了QUORIDRO步步为营的前身Pinko Pallino，由Epta游戏公司发布，此款游戏一经发布便开始在益智游戏界取得强烈反响。到了1997年全球五大游戏公司：法国Gigamic SA，美国Family Games, Inc.，美国Great American Trading Company，Mitra游戏公司和Smart Chick先后买得此款游戏的版权，向全世界发布此款游戏。于是Quoridor迅速风靡全球，几乎所有欧美的桌游吧、咖啡厅都能见到这款游戏的身影，很多欧洲的教育机构也都选Quoridor为教具，带入了课堂，以色列著名的教育机构MINDLAB也在其中。此款游戏也被评为游戏杂志《game》评为“20世纪最受欢迎的益智游戏”(The most popular educational game in 20th century) 。

## 游戏规则

1. 游戏人数2-4人
2. 游戏在一个9X9方格的棋盘内进行（DEMO版本为5X5，可以调整配置更改）
3. 游戏一共有20个“墙”（DEMO版本为10个），评分给每个玩家，多余的不使用。
4. 每个玩家控制一个颜色的圆点，分别在棋盘的四个边缘中央格子内。游戏目标是玩家圆点移动到棋盘另一边缘的任意一个格子上，第一个到达的玩家胜利。
5. 每个回合玩家可以移动圆点到相邻的格子或者放置一个“墙”。墙放置在格子和格子的边沿上，一个墙占两个格子的宽度，可横放或者竖放，但是不能与其他墙重叠。墙的作用是阻挡圆点移动，圆点不能移动到被墙分隔开的相邻格子上。墙放置不能导致某一个圆点不能到达终点（即把圆点困住）。

# 项目实现

## 1.大厅
访问项目地址后，会自动生成一个带房间号的地址。把地址发给其他用户访问可以加入大厅。用户信息使用COOKIE储存，所以同一个浏览器会认为是同一个用户。
大厅允许2-4个用户加入，用户加入后可以切换准备状态，所有用户准备后，游戏开始。

## 2.游戏
游戏玩家可以进行对战。

# 项目技术框架

## 客户端

游戏流程使用javascript+vue.js控制

游戏操作和展示使用egret（白鹭）引擎实现

## 服务端

服务端使用node.js+express框架

## 目录结构
```
/                           express根目录
/routes                     服务端路由
/routes/index.js            服务端逻辑代码
/public/                    客户端目录,egret项目根目录
/public/js                  客户端js脚本
/public/js/ajax.js          封装AJAX函数
/public/js/game.js          游戏流程控制代码
/public/js/lobby.js         大厅控制代码
/public/src/                egret游戏代码
/public/src/Main.ts         游戏显示与控制代码
```

## 配置
修改/public/js/game.js中
```
var blockNum = 5;//格子数量
var wallsNum = 10;
```
分别是格子数量和墙的总数量

## 部署

根目录下运行：

```
node bin/www
```
启动服务端，浏览器中访问 http://localhost:86 运行游戏。
