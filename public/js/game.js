var playerNum = 4;
var player = 0;
var blockNum = 5;//格子数量
var wallsNum = 10;

var gameBoardData = {
    player: [],
    hLine: [],
    vLine: [],
    playerStep: 0
};
for (var i = 0; i < blockNum; i++) {
    gameBoardData.hLine[i] = [];
    gameBoardData.vLine[i] = [];
}

// 棋盘初始化
var isCanvasReady = false;
var canvasReady = function () {
    // 棋盘参数
    var canvasParam = {
        blockWdith: 70,
        blockNum: blockNum,
        lineWidth: 20,
        lineColor: 0x234567,
        lineTouchColor: 0x789012,
        playerLineColor: [
            0xff0000,
            0x00ff00,
            0x0000ff,
            0xffff00
        ],
        playerNum: playerNum
    };
    isCanvasReady = true;
    console.log("canvasReady", canvasParam);
    var players = window.gameBoard.createGameScene(canvasParam);
    for (var i in players) {
        var playerData = {
            gx: players[i].gx,
            gy: players[i].gy,
            walls: Math.floor(wallsNum / playerNum)
        }
        gameBoardData.player[i] = playerData;
    }
    if (lobby.roomData.gameBoardData) {
        player = -1;
        updateGameData();
    }
    else {
        gameStep();
    }
};

// 回合开始
var gameStep = function () {
    setTimeout(function () {
        for (var i in lobby.roomData.players) {
            if (lobby.roomData.players[i].playerIndex == 0 && gameBoardData.player[0].gy == blockNum - 1) {
                alert(i + "胜利！");
                return;
            }
            if (lobby.roomData.players[i].playerIndex == 1 && gameBoardData.player[1].gy == 0) {
                alert(i + "胜利！");
                return;
            }
            if (lobby.roomData.players[i].playerIndex == 2 && gameBoardData.player[2].gx == blockNum - 1) {
                alert(i + "胜利！");
                return;
            }
            if (lobby.roomData.players[i].playerIndex == 3 && gameBoardData.player[3].gx == 0) {
                alert(i + "胜利！");
                return;
            }
        }
        for (var i in lobby.roomData.players) {
            if (lobby.roomData.players[i].playerIndex == player) {
                alert(i + "回合,剩余墙数量：" + gameBoardData.player[player].walls);
            }
        }
        if (lobby.roomData.players[username].playerIndex == player) {
            window.gameBoard.startTouch(player, gameBoardData.player[player].walls);
        }
    }, 500);
};

// 提交游戏操作
var uploadStep = function () {
    gameBoardData.playerStep = (player + 1) % playerNum;
    Ajax.post("gameData", {
        room: room,
        username: username,
        gameBoardData: JSON.stringify(gameBoardData)
    }, function (data) {
        console.log(data);
        setGameData(JSON.parse(data));
    });
};

// 同步游戏信息
var syncGameData = function () {
    // console.log(lobby.roomData.gameBoardData);
    for (var i in gameBoardData.player) {
        if (gameBoardData.player[i].gx != lobby.roomData.gameBoardData.player[i].gx || gameBoardData.player[i].gy != lobby.roomData.gameBoardData.player[i].gy) {
            window.gameBoard.setPLayerPosition(i, lobby.roomData.gameBoardData.player[i].gx, lobby.roomData.gameBoardData.player[i].gy);
        }
    }
    for (var i in gameBoardData.hLine) {
        for (var j in gameBoardData.hLine) {
            if (lobby.roomData.gameBoardData.hLine[i][j] && !gameBoardData.hLine[i][j]) {
                window.gameBoard.setPositionWall(lobby.roomData.gameBoardData.hLine[i][j].player, "hLine", j, i);
            }
        }
    }
    for (var i in gameBoardData.vLine) {
        for (var j in gameBoardData.vLine) {
            if (lobby.roomData.gameBoardData.vLine[i][j] && !gameBoardData.vLine[i][j]) {
                window.gameBoard.setPositionWall(lobby.roomData.gameBoardData.vLine[i][j].player, "vLine", j, i);
            }
        }
    }
    //设置墙
    // window.gameBoard.setWall(player, data);

    gameBoardData = lobby.roomData.gameBoardData;
    if (player != lobby.roomData.gameBoardData.playerStep) {
        player = lobby.roomData.gameBoardData.playerStep;
        gameStep();
    }
}

// 触摸结果
var touchResult = function (data) {
    console.log(data);
    // 画墙
    var retry = true;
    if (data.length == 2 && data[0].name == "Line" && data[1].name == "Line") {
        if (data[0].gtype == "hLine") {
            var gx = Math.max(data[0].gx, data[1].gx);
            var gy = data[0].gy;
            if (gameBoardData.vLine[gy] && gameBoardData.vLine[gy - 1] && gameBoardData.vLine[gy][gx] && gameBoardData.vLine[gy - 1][gx]) {
                alert("墙不能重叠");
                window.gameBoard.startTouch(player, gameBoardData.player[player].walls);
                return;
            }
        }
        if (data[0].gtype == "vLine") {
            var gy = Math.max(data[0].gy, data[1].gy);
            var gx = data[0].gx;
            if (gameBoardData.hLine[gy] &&
                gameBoardData.hLine[gy][gx] &&
                gameBoardData.hLine[gy][gx - 1]) {
                alert("墙不能重叠");
                window.gameBoard.startTouch(player, gameBoardData.player[player].walls);
                return;
            }
        }

        var gbdata = JSON.parse(JSON.stringify(gameBoardData));
        for (var i in data) {
            gbdata[data[i].gtype][data[i].gy][data[i].gx] = { player: player };
        }
        if (!waySearch(gbdata)) {
            alert("玩家不能到达终点！");
            window.gameBoard.startTouch(player, gameBoardData.player[player].walls);
            return;
        }

        //设置墙
        for (var i in data) {
            gameBoardData[data[i].gtype][data[i].gy][data[i].gx] = { player: player };
        }
        window.gameBoard.setWall(player, data);
        gameBoardData.player[player].walls--;
        // player = (player + 1) % playerNum;
        uploadStep();
        retry = false;
    }

    //玩家移动
    if (data.length == 1 && data[0].name == "player") {
        var p = gameBoardData.player[player];
        // 移动角色
        var moveableList = [];
        if (!gameBoardData.vLine[p.gy] || !gameBoardData.vLine[p.gy][p.gx] && p.gx - 1 >= 0)//左
            moveableList.push([p.gx - 1, p.gy]);
        if (!gameBoardData.vLine[p.gy] || !gameBoardData.vLine[p.gy][p.gx + 1] && p.gx + 1 < blockNum)//右
            moveableList.push([p.gx + 1, p.gy]);
        if (!gameBoardData.hLine[p.gy] || !gameBoardData.hLine[p.gy][p.gx] && p.gy - 1 >= 0)//上
            moveableList.push([p.gx, p.gy - 1]);
        if (!gameBoardData.hLine[p.gy + 1] || !gameBoardData.hLine[p.gy + 1][p.gx] && p.gy + 1 < blockNum)//下
            moveableList.push([p.gx, p.gy + 1]);

        for (var i in gameBoardData.player) {
            if (Math.abs(gameBoardData.player[i].gx - p.gx) + Math.abs(gameBoardData.player[i].gy - p.gy) == 1) {//玩家相邻
                var p2 = gameBoardData.player[i];
                // 删除可移动列表中的格子
                for (var j in moveableList) {
                    if (p2.gx == moveableList[j][0] && p2.gy == moveableList[j][1]) {
                        moveableList.splice(j, 1);
                    }
                }

                if (p2.gx - 1 == p.gx && p2.gy == p.gy) {//右
                    if (!gameBoardData.vLine[p2.gy] || !gameBoardData.vLine[p2.gy][p2.gx + 1] && p2.gx + 1 < blockNum)//右边没墙
                        moveableList.push([p2.gx + 1, p2.gy]);
                    else {
                        if (!gameBoardData.hLine[p2.gy] || !gameBoardData.hLine[p2.gy][p2.gx] && p2.gy - 1 >= 0)//上
                            moveableList.push([p2.gx, p2.gy - 1]);
                        if (!gameBoardData.hLine[p2.gy + 1] || !gameBoardData.hLine[p2.gy + 1][p2.gx] && p2.gy + 1 < blockNum)//下
                            moveableList.push([p2.gx, p2.gy + 1]);
                    }
                }
                if (p2.gx + 1 == p.gx && p2.gy == p.gy) {//左
                    if (!gameBoardData.vLine[p2.gy] || !gameBoardData.vLine[p2.gy][p2.gx] && p2.gx - 1 >= 0)//左边没墙
                        moveableList.push([p2.gx - 1, p2.gy]);
                    else {
                        if (!gameBoardData.hLine[p2.gy] || !gameBoardData.hLine[p2.gy][p2.gx] && p2.gy - 1 >= 0)//上
                            moveableList.push([p2.gx, p2.gy - 1]);
                        if (!gameBoardData.hLine[p2.gy + 1] || !gameBoardData.hLine[p2.gy + 1][p2.gx] && p2.gy + 1 < blockNum)//下
                            moveableList.push([p2.gx, p2.gy + 1]);
                    }
                }
                if (p2.gy + 1 == p.gy && p2.gx == p.gx) {//上
                    if (!gameBoardData.hLine[p2.gy] || !gameBoardData.hLine[p2.gy][p2.gx] && p2.gy - 1 >= 0)//上
                        moveableList.push([p2.gx, p2.gy - 1]);
                    else {
                        if (!gameBoardData.vLine[p2.gy] || !gameBoardData.vLine[p2.gy][p2.gx + 1] && p2.gx + 1 < blockNum)//右边没墙
                            moveableList.push([p2.gx + 1, p2.gy]);
                        if (!gameBoardData.vLine[p2.gy] || !gameBoardData.vLine[p2.gy][p2.gx] && p2.gx - 1 >= 0)//左边没墙
                            moveableList.push([p2.gx - 1, p2.gy]);
                    }
                }
                if (p2.gy - 1 == p.gy && p2.gx == p.gx) {//下
                    if (!gameBoardData.hLine[p2.gy + 1] || !gameBoardData.hLine[p2.gy + 1][p2.gx] && p2.gy + 1 < blockNum)//下
                        moveableList.push([p2.gx, p2.gy + 1]);
                    else {
                        if (!gameBoardData.vLine[p2.gy] || !gameBoardData.vLine[p2.gy][p2.gx + 1] && p2.gx + 1 < blockNum)//右边没墙
                            moveableList.push([p2.gx + 1, p2.gy]);
                        if (!gameBoardData.vLine[p2.gy] || !gameBoardData.vLine[p2.gy][p2.gx] && p2.gx - 1 >= 0)//左边没墙
                            moveableList.push([p2.gx - 1, p2.gy]);
                    }
                }




                // if (
                //     (!gameBoardData.vLine[p2.gy] || !gameBoardData.vLine[p2.gy][p2.gx])
                //     && !(p2.gx - 1 == p.gx && p2.gy == p.gy))//左
                //     moveableList.push([p2.gx - 1, p2.gy]);
                // if (
                //     (!gameBoardData.vLine[p2.gy] || !gameBoardData.vLine[p2.gy][p2.gx + 1])
                //     && !(p2.gx + 1 == p.gx && p2.gy == p.gy))//右
                //     moveableList.push([p2.gx + 1, p2.gy]);
                // if (
                //     (!gameBoardData.hLine[p2.gy] || !gameBoardData.hLine[p2.gy][p2.gx])
                //     && !(p2.gx == p.gx && p2.gy - 1 == p.gy))//上
                //     moveableList.push([p2.gx, p2.gy - 1]);
                // if (
                //     (!gameBoardData.hLine[p2.gy + 1] || !gameBoardData.hLine[p2.gy + 1][p2.gx])
                //     && !(p2.gx == p.gx && p2.gy + 1 == p.gy))//下
                //     moveableList.push([p2.gx, p2.gy + 1]);
            }
        }

        console.log("moveableList", moveableList);

        // if (Math.abs(data[0].gx - p.gx) + Math.abs(data[0].gy - p.gy) == 1) {
        //     // 不能跨墙
        //     var isWall = false;
        //     if (Math.abs(data[0].gx - p.gx) == 1) {
        //         // 横移
        //         var x = Math.max(data[0].gx, p.gx)
        //         if (gameBoardData.vLine[p.gy] && gameBoardData.vLine[p.gy][x]) {
        //             isWall = true;
        //         }
        //     }
        //     if (Math.abs(data[0].gy - p.gy) == 1) {
        //         // 竖移
        //         var y = Math.max(data[0].gy, p.gy)
        //         if (gameBoardData.hLine[y] && gameBoardData.hLine[y][p.gx]) {
        //             isWall = true;
        //         }
        //     }
        //     // 遇到玩家
        //     for (var i in gameBoardData.player) {
        //         if (gameBoardData.player[i].gx == data[0].gx && gameBoardData.player[i].gy == data[0].gy)
        //             isWall = true;
        //     }
        //     if (!isWall) {
        //         p.gx = data[0].gx;
        //         p.gy = data[0].gy;
        //         // player = (player + 1) % playerNum;
        //         uploadStep();
        //         retry = false;
        //     }
        // }
        for (var i in moveableList) {
            //可以移动
            if (data[0].gx == moveableList[i][0] && data[0].gy == moveableList[i][1]) {
                p.gx = data[0].gx;
                p.gy = data[0].gy;
                uploadStep();
                retry = false;
            }
        }
        window.gameBoard.setPLayerPosition(player, p.gx, p.gy)
    }
    // console.log(gameBoardData);
    //next player
    if (retry) {
        window.gameBoard.startTouch(player, gameBoardData.player[player].walls);
    }
}

// 判断是否能达到终点
var waySearch = function (gbdata) {
    function nextBlock(next, player, checkedList) {
        var nextList = [];
        for (var i in next) {
            // 左
            if (next[i].gx > 0
                && !gbdata.vLine[next[i].gy][next[i].gx]
                && !checkedList[next[i].gy][next[i].gx - 1]) {
                if (player == 3 && next[i].gx - 1 == 0) return true;
                nextList.push({ gx: next[i].gx - 1, gy: next[i].gy });
                checkedList[next[i].gy][next[i].gx - 1] = 1;
                // console.log(next[i].gx - 1, next[i].gy)
            }
            // 右
            if (next[i].gx < blockNum - 1
                && !gbdata.vLine[next[i].gy][next[i].gx + 1]
                && !checkedList[next[i].gy][next[i].gx + 1]) {
                if (player == 2 && next[i].gx + 1 == blockNum - 1) return true;
                nextList.push({ gx: next[i].gx + 1, gy: next[i].gy });
                checkedList[next[i].gy][next[i].gx + 1] = 1;
                // console.log(next[i].gx +1, next[i].gy)
            }
            // 上
            if (next[i].gy > 0
                && !gbdata.hLine[next[i].gy][next[i].gx]
                && !checkedList[next[i].gy - 1][next[i].gx]) {
                if (player == 1 && next[i].gy - 1 == 0) return true;
                nextList.push({ gx: next[i].gx, gy: next[i].gy - 1 });
                checkedList[next[i].gy - 1][next[i].gx] = 1;
                // console.log(next[i].gx , next[i].gy-1)
            }
            // 下
            if (next[i].gy < blockNum - 1
                && !gbdata.hLine[next[i].gy + 1][next[i].gx]
                && !checkedList[next[i].gy + 1][next[i].gx]) {
                if (player == 0 && next[i].gy + 1 == blockNum - 1) return true;
                nextList.push({ gx: next[i].gx, gy: next[i].gy + 1 });
                checkedList[next[i].gy + 1][next[i].gx] = 1;
                // console.log(next[i].gx, next[i].gy+1)
            }
        }
        if (nextList.length == 0) return false;
        // console.log(nextList);
        return nextBlock(nextList, player, checkedList)
    }

    for (var i in gbdata.player) {
        var p = gbdata.player[i];
        var checkedList = [];
        for (var j = 0; j < blockNum; j++) {
            checkedList[j] = [];
        }
        checkedList[p.gy][p.gx] = 1;
        var isEnd = nextBlock([p], i, checkedList);
        // console.log(isEnd);
        if (!isEnd) return false;
    }
    return true;

}