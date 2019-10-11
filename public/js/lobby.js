var username = localStorage.username;
if (!localStorage.username) {
    username = getUserName();
    function getUserName() {
        var n = prompt("请输入用户名");
        if (n) return n;
        else return getUserName()
    }
    localStorage.username = username;
}

var room = location.hash.replace("#", "");


function setGameData(roomData) {
    if (roomData.error == 1) {
        alert(roomData.errorMsg);
        clearInterval(timer);
        return;
    }
    if (room != roomData.roomId) {
        location.hash = "#" + roomData.roomId;
        room = roomData.roomId;
    }
    
    lobby.roomData = roomData;

    // 玩家准备
    lobby.ready = roomData.players[username].ready;
    // 游戏开始
    if (roomData.gameStatus == 1 && lobby.lobby) {
        lobby.lobby = false;
        document.getElementById("gameBoard").hidden = false;
        // 游戏配置
        playerNum = 0;
        for(var i in roomData.players){
            playerNum++;
        }
        // gameStart();
        canvasLoad();
    }
    // 游戏信息同步
    if (roomData.gameStatus == 1 && isCanvasReady && roomData.gameBoardData) {
        syncGameData();
    }
}

function updateGameData() {
    Ajax.post("getRoom", {
        room: room,
        username: username
    }, function (data) {
        var roomData = JSON.parse(data);
        // console.log(roomData);
        setGameData(roomData)
    });
}
var timer = setInterval(updateGameData, 3000);
updateGameData();


var lobby = new Vue({
    el: "#lobby",
    data: {
        lobby: true,
        roomData: {},
        ready: false
    },
    methods: {
        setReady: function () {
            // console.log("ready");
            // game.gameStart = true;
            // this.lobby = false;
            Ajax.post("playerReady", {
                room: room,
                username: username
            }, function (data) {
                console.log(data);
                setGameData(JSON.parse(data));
            });
        }
    }
});
