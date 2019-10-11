var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        // private async loadResource() {
        //     try {
        //         const loadingView = new LoadingUI();
        //         this.stage.addChild(loadingView);
        //         await RES.loadConfig("resource/default.res.json", "resource/");
        //         await RES.loadGroup("preload", 0, loadingView);
        //         this.stage.removeChild(loadingView);
        //     }
        //     catch (e) {
        //         console.error(e);
        //     }
        // }
        // private textfield: egret.TextField;
        /**
         * 创建游戏场景
         * Create a game scene
         */
        _this.childrenList = [];
        _this.playerList = [];
        _this.blockPosition = function (gx, gy) {
            return [
                this.canvasParam.blockWdith * (gx + 0.5) + 10,
                this.canvasParam.blockWdith * (gy + 0.5) + 10,
            ];
        };
        _this.touchList = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        // egret.lifecycle.addLifecycleListener((context) => {
        //     // custom lifecycle plugin
        //     context.onUpdate = () => {
        //     }
        // })
        // egret.lifecycle.onPause = () => {
        //     egret.ticker.pause();
        // }
        // egret.lifecycle.onResume = () => {
        //     egret.ticker.resume();
        // }
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                window["gameBoard"] = this;
                window["canvasReady"]();
                return [2 /*return*/];
            });
        });
    };
    Main.prototype.createGameScene = function (canvasParam) {
        // 棋盘生成
        this.canvasParam = canvasParam;
        var p = canvasParam.blockWdith;
        for (var i = 0; i < canvasParam.blockNum + 1; i++) {
            for (var j = 0; j < canvasParam.blockNum + 1; j++) {
                if (i < canvasParam.blockNum) {
                    var hline = new Line(i, j, p, canvasParam.lineWidth, "hLine", canvasParam);
                    this.addChild(hline);
                    hline.x = 10 + p * i + p / 2;
                    hline.y = 10 + p * j;
                    this.childrenList.push(hline);
                    if (j == 0 || j == canvasParam.blockNum) {
                        hline.touched = true;
                    }
                }
                if (j < canvasParam.blockNum) {
                    var vline = new Line(i, j, canvasParam.lineWidth, p, "vLine", canvasParam);
                    this.addChild(vline);
                    vline.x = 10 + p * i;
                    vline.y = 10 + p * j + p / 2;
                    this.childrenList.push(vline);
                    if (i == 0 || i == canvasParam.blockNum) {
                        vline.touched = true;
                    }
                }
            }
        }
        //玩家生成
        for (var i = 0; i < canvasParam.playerNum; i++) {
            var player = new Player(canvasParam.blockWdith / 2 * 0.8, i, canvasParam);
            this.addChild(player);
            this.playerList[i] = player;
            if (i == 0)
                // player.setPosition(canvasParam.blockWdith, 4, 0);
                this.setPLayerPosition(i, Math.floor(canvasParam.blockNum / 2), 0);
            if (i == 1)
                this.setPLayerPosition(i, Math.floor(canvasParam.blockNum / 2), canvasParam.blockNum - 1);
            // player.setPosition(canvasParam.blockWdith, 4, 8);
            if (i == 2)
                this.setPLayerPosition(i, 0, Math.floor(canvasParam.blockNum / 2));
            // player.setPosition(canvasParam.blockWdith, 0, 4);
            if (i == 3)
                this.setPLayerPosition(i, canvasParam.blockNum - 1, Math.floor(canvasParam.blockNum / 2));
            // player.setPosition(canvasParam.blockWdith, 8, 4);
        }
        return this.playerList;
    };
    Main.prototype.startTouch = function (playerIndex, wall) {
        // 重置触摸参数
        this.touchList = [];
        for (var i in this.childrenList) {
            this.childrenList[i].touchEnabled = (wall) ? true : false;
        }
        for (var i in this.playerList) {
            this.playerList[i].touchEnabled = (i == playerIndex);
        }
        // 开始触摸
        // 触摸的线上下或左右可以触摸，其他不能触摸
        var touchType;
        this.touchEnabled = false;
        var touchStart = function (e) {
            touchType = e.target.name;
            console.log(touchType);
            if (touchType == "Line") {
                if (e.target.touched) {
                    return;
                }
                this.touchList.push(e.target);
                if (e.target.onTouch && !e.target.touched) {
                    e.target.onTouch();
                    for (var i in this.childrenList) {
                        this.childrenList[i].touchEnabled = false;
                        if (this.childrenList[i].gtype == e.target.gtype) {
                            if (e.target.gtype == 'hLine') {
                                if (this.childrenList[i].gy == e.target.gy && (this.childrenList[i].gx == e.target.gx + 1 || this.childrenList[i].gx == e.target.gx - 1)) {
                                    this.childrenList[i].touchEnabled = true;
                                }
                            }
                            if (e.target.gtype == 'vLine') {
                                if (this.childrenList[i].gx == e.target.gx && (this.childrenList[i].gy == e.target.gy + 1 || this.childrenList[i].gy == e.target.gy - 1)) {
                                    this.childrenList[i].touchEnabled = true;
                                }
                            }
                        }
                        e.target.touchEnabled = true;
                    }
                }
                return;
            }
            if (touchType == "player") {
                this.touchEnabled = true;
                for (var i in this.childrenList) {
                    this.childrenList[i].touchEnabled = false;
                }
            }
        };
        // 触摸移动
        var touchMove = function (e) {
            if (touchType == "Line") {
                if (this.touchList.length == 2 && e.target != this.touchList[1]) {
                    this.touchList[1].endTouch();
                    this.touchList.pop();
                    return;
                }
                if (this.touchList.length != 1 || e.target == this.touchList[0])
                    return; //第一段触摸失败直接返回
                if (!e.target.touched) {
                    this.touchList.push(e.target);
                    if (e.target.onTouch) {
                        e.target.onTouch();
                    }
                }
            }
            if (touchType == "player") {
                var player = this.playerList[playerIndex];
                player.x = e.stageX;
                player.y = e.stageY;
                var canvasParam = this.canvasParam;
                var setP = function (blockPosition) {
                    // console.log("this.canvasParam",canvasParam);
                    if (Math.abs(player.x - blockPosition[0]) < canvasParam.blockWdith * 0.3
                        && Math.abs(player.y - blockPosition[1]) < canvasParam.blockWdith * 0.3) {
                        player.x = blockPosition[0];
                        player.y = blockPosition[1];
                    }
                };
                for (var i = 0; i < this.canvasParam.blockNum; i++) {
                    for (var j = 0; j < this.canvasParam.blockNum; j++) {
                        setP(this.blockPosition(i, j));
                    }
                }
            }
        };
        // 触摸结束
        // 触摸结果如果符合规则，则传回游戏；不符合则取消触摸信息
        var self = this;
        var touchEnd = function (e) {
            var uploadList = this.touchList;
            if (touchType == "Line") {
                //结果返回逻辑层
                for (var i in this.touchList) {
                    if (this.touchList[i].endTouch)
                        this.touchList[i].endTouch();
                }
                // this.touchList = [];
                // for (var i in this.childrenList) {
                //     this.childrenList[i].touchEnabled = true;
                // }
            }
            if (touchType == "player") {
                var player = this.playerList[playerIndex];
                for (var gx = 0; gx < this.canvasParam.blockNum; gx++) {
                    for (var gy = 0; gy < this.canvasParam.blockNum; gy++) {
                        var blockPosition = this.blockPosition(gx, gy);
                        if (Math.abs(player.x - blockPosition[0]) < this.canvasParam.blockWdith / 2
                            && Math.abs(player.y - blockPosition[1]) < this.canvasParam.blockWdith / 2) {
                            player.gx = gx;
                            player.gy = gy;
                        }
                    }
                }
                uploadList = [player];
            }
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, touchStart, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, touchMove, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, touchEnd, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, touchEnd, this);
            window["touchResult"](uploadList);
        };
        // 触摸事件
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, touchStart, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, touchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, touchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, touchEnd, this);
    };
    Main.prototype.setWall = function (player, list) {
        for (var i in list) {
            list[i].setWall(player);
        }
    };
    Main.prototype.setPositionWall = function (player, type, gx, gy) {
        for (var i in this.childrenList) {
            if (this.childrenList[i].gtype == type && this.childrenList[i].gx == gx && this.childrenList[i].gy == gy) {
                this.childrenList[i].setWall(player);
                return;
            }
        }
    };
    Main.prototype.setPLayerPosition = function (playerIndex, gx, gy) {
        // this.x = width * (gx + 0.5) + 10;
        // this.y = width * (gy + 0.5) + 10;
        console.log("setPLayerPosition", playerIndex, gx, gy);
        var player = this.playerList[playerIndex];
        var p = this.blockPosition(gx, gy);
        player.x = p[0];
        player.y = p[1];
        player.gx = gx;
        player.gy = gy;
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var Dot = (function (_super) {
    __extends(Dot, _super);
    function Dot(gx, gy, size) {
        var _this = _super.call(this) || this;
        _this.graphics.beginFill(0x121212);
        _this.graphics.drawCircle(0, 0, size);
        _this.graphics.endFill();
        _this.gx = gx;
        _this.gy = gy;
        _this.touchEnabled = true;
        _this.name = "dot";
        return _this;
    }
    Dot.prototype.onTouch = function () {
        this.scaleX = 1.2;
        this.scaleY = 1.2;
    };
    Dot.prototype.endTouch = function () {
        this.scaleX = 1;
        this.scaleY = 1;
    };
    return Dot;
}(egret.Shape));
__reflect(Dot.prototype, "Dot");
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(gx, gy, width, height, type, param) {
        var _this = _super.call(this) || this;
        _this.touched = false;
        _this.lineColor = param.lineColor;
        _this.lineTouchColor = param.lineTouchColor;
        _this.playerLineColor = param.playerLineColor;
        _this.graphics.beginFill(_this.lineColor);
        _this.graphics.drawRect(-width / 2, -height / 2, width, height);
        _this.graphics.endFill();
        _this.gx = gx;
        _this.gy = gy;
        _this.gtype = type;
        _this.touchEnabled = true;
        _this.width = width;
        _this.height = height;
        _this.name = "Line";
        return _this;
    }
    Line.prototype.onTouch = function () {
        this.graphics.beginFill(this.lineTouchColor);
        this.graphics.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.graphics.endFill();
    };
    Line.prototype.endTouch = function () {
        this.graphics.beginFill(this.lineColor);
        this.graphics.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.graphics.endFill();
    };
    Line.prototype.setWall = function (player) {
        this.touched = true;
        this.graphics.beginFill(this.playerLineColor[player]);
        this.graphics.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.graphics.endFill();
    };
    return Line;
}(egret.Shape));
__reflect(Line.prototype, "Line");
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(r, player, param) {
        var _this = _super.call(this) || this;
        _this.graphics.beginFill(param.playerLineColor[player]);
        _this.graphics.drawCircle(0, 0, r);
        _this.graphics.endFill();
        _this.player = player;
        _this.touchEnabled = true;
        _this.name = "player";
        // this.lineColor = param.lineColor;
        // this.lineTouchColor = param.lineTouchColor;
        // this.playerLineColor = param.playerLineColor;
        // this.graphics.beginFill(this.lineColor);
        // this.graphics.drawRect(-width / 2, -height / 2, width, height);
        // this.graphics.endFill();
        // this.gx = gx;
        // this.gy = gy;
        // this.gtype = type;
        _this.touchEnabled = true;
        return _this;
        // this.width = width;
        // this.height = height;
        // this.name = "Line";
    }
    return Player;
}(egret.Shape));
__reflect(Player.prototype, "Player");
