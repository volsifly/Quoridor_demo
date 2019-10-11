var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');//用于解析上传文件和post数据
var multipartMiddleware = multipart();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.get("/game",function(req,res){
//   res.render("game",{});
// });
var rooms={}

router.post("/getRoom",multipartMiddleware,function(req,res){
  var roomId = req.body.room;
  if(!req.body.room){
    // 创建房间
    console.log("创建房间");
    roomId = Math.ceil(Math.random()*100000) + "" + new Date().getTime();
    // 设置默认数据
    rooms[roomId]={
      roomId:roomId,
      players:{},
      gameStatus:0,//未开始
    }
  }
  if(!rooms[roomId]){
    res.send({error:1,errorMsg:"房间ID错误"});
    return;
  }


  if(!rooms[roomId].players[req.body.username]){
    var roomCount = 0;
    for(var i in rooms[roomId].players){
      roomCount ++;
    }
    if(roomCount>=4){
      res.send({error:1,errorMsg:"房间已满"});
      return;
    }
    if(rooms[roomId].gameStatus>0){
      res.send({error:1,errorMsg:"游戏已开始"});
      return;
    }

    //加入房间
    rooms[roomId].players[req.body.username]={
      online:true,
      onlineTime:new Date().getTime(),
      ready:false,
      playerIndex:roomCount,
    };
  }
  else{
    rooms[roomId].players[req.body.username].online=true;
    rooms[roomId].players[req.body.username].onlineTime=new Date().getTime();
  }

  //在线检测
  for(var i in rooms[roomId].players){
    if(new Date().getTime() - rooms[roomId].players[i].onlineTime >5000){
      rooms[roomId].players[i].online=false;
    }
  }

  res.send(rooms[roomId])
});

router.post("/playerReady",multipartMiddleware,function(req,res){
  rooms[req.body.room].players[req.body.username].ready = !rooms[req.body.room].players[req.body.username].ready;
  // 所有人准备好游戏开始
  var allReady = true;
  for(var i in rooms[req.body.room].players){
    allReady = allReady && (rooms[req.body.room].players[i].ready)?true:false;
  }
  if(allReady){
    rooms[req.body.room].gameStatus = 1;
  }
  res.send(rooms[req.body.room]);
});

// 游戏回合提交
router.post("/gameData",multipartMiddleware,function(req,res){
  rooms[req.body.room].gameBoardData = JSON.parse(req.body.gameBoardData);
  res.send(rooms[req.body.room]);
});

module.exports = router;
