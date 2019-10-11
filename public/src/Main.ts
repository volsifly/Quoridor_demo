class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

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

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        window["gameBoard"] = this;
        window["canvasReady"]();
    }

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
    private childrenList = [];
    private playerList = [];
    private canvasParam;
    public createGameScene(canvasParam) {
        // 棋盘生成
        this.canvasParam = canvasParam;
        var p = canvasParam.blockWdith;
        for (var i = 0; i < canvasParam.blockNum+1; i++) {

            for (var j = 0; j < canvasParam.blockNum+1; j++) {
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
                this.setPLayerPosition(i, Math.floor(canvasParam.blockNum/2), 0)
            if (i == 1)
                this.setPLayerPosition(i, Math.floor(canvasParam.blockNum/2), canvasParam.blockNum-1)
            // player.setPosition(canvasParam.blockWdith, 4, 8);
            if (i == 2)
                this.setPLayerPosition(i, 0, Math.floor(canvasParam.blockNum/2))
            // player.setPosition(canvasParam.blockWdith, 0, 4);
            if (i == 3)
                this.setPLayerPosition(i, canvasParam.blockNum-1, Math.floor(canvasParam.blockNum/2))
            // player.setPosition(canvasParam.blockWdith, 8, 4);
        }
        return this.playerList;
    }
    private blockPosition = function (gx, gy) {
        return [
            this.canvasParam.blockWdith * (gx + 0.5) + 10,
            this.canvasParam.blockWdith * (gy + 0.5) + 10,
        ]
    };
    private touchList = [];
    public startTouch(playerIndex,wall) {
        // 重置触摸参数
        this.touchList = [];
        for (var i in this.childrenList) {
            this.childrenList[i].touchEnabled = (wall)?true:false;
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
                if (e.target.touched) {//已经放置墙的不能再次被触摸
                    return
                }
                this.touchList.push(e.target);
                if (e.target.onTouch && !e.target.touched) {
                    e.target.onTouch();
                    for (var i in this.childrenList) {
                        this.childrenList[i].touchEnabled = false;
                        if (this.childrenList[i].gtype == e.target.gtype) {
                            if (e.target.gtype == 'hLine') {

                                if (this.childrenList[i].gy == e.target.gy && (this.childrenList[i].gx == e.target.gx + 1 || this.childrenList[i].gx == e.target.gx - 1)) {
                                    this.childrenList[i].touchEnabled = true
                                }
                            }
                            if (e.target.gtype == 'vLine') {
                                if (this.childrenList[i].gx == e.target.gx && (this.childrenList[i].gy == e.target.gy + 1 || this.childrenList[i].gy == e.target.gy - 1)) {
                                    this.childrenList[i].touchEnabled = true
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
        }
        // 触摸移动
        var touchMove = function (e) {
            if (touchType == "Line") {
                if (this.touchList.length == 2 && e.target != this.touchList[1]) {
                    this.touchList[1].endTouch();
                    this.touchList.pop();
                    return;
                }
                if (this.touchList.length != 1 || e.target == this.touchList[0]) return //第一段触摸失败直接返回
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
                        && Math.abs(player.y - blockPosition[1]) < canvasParam.blockWdith * 0.3
                    ) {
                        player.x = blockPosition[0];
                        player.y = blockPosition[1];
                    }
                }

                for(var i = 0;i<this.canvasParam.blockNum;i++){
                    for(var j = 0;j<this.canvasParam.blockNum;j++){
                        setP(this.blockPosition(i,j));
                    }
                }
            }
        }
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
                        var blockPosition = this.blockPosition(gx, gy)
                        if (Math.abs(player.x - blockPosition[0]) < this.canvasParam.blockWdith / 2
                            && Math.abs(player.y - blockPosition[1]) < this.canvasParam.blockWdith / 2
                        ) {
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
        }

        // 触摸事件
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, touchStart, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, touchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, touchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, touchEnd, this);
    }

    public setWall(player, list) {
        for (var i in list) {
            list[i].setWall(player)
        }
    }

    public setPositionWall(player,type,gx,gy){
        for(var i in this.childrenList){
            if(this.childrenList[i].gtype == type && this.childrenList[i].gx == gx && this.childrenList[i].gy == gy){
                this.childrenList[i].setWall(player);
                return;
            }
        }
    }

    public setPLayerPosition(playerIndex, gx, gy) {
        // this.x = width * (gx + 0.5) + 10;
        // this.y = width * (gy + 0.5) + 10;
        console.log("setPLayerPosition",playerIndex, gx, gy);
        var player = this.playerList[playerIndex];

        var p = this.blockPosition(gx, gy);
        player.x = p[0];
        player.y = p[1];
        player.gx = gx;
        player.gy = gy;
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    // private createBitmapByName(name: string) {
    //     let result = new egret.Bitmap();
    //     let texture: egret.Texture = RES.getRes(name);
    //     result.texture = texture;
    //     return result;
    // }

    // /**
    //  * 描述文件加载成功，开始播放动画
    //  * Description file loading is successful, start to play the animation
    //  */
    // private startAnimation(result: string[]) {
    //     let parser = new egret.HtmlTextParser();

    //     let textflowArr = result.map(text => parser.parse(text));
    //     let textfield = this.textfield;
    //     let count = -1;
    //     let change = () => {
    //         count++;
    //         if (count >= textflowArr.length) {
    //             count = 0;
    //         }
    //         let textFlow = textflowArr[count];

    //         // 切换描述内容
    //         // Switch to described content
    //         textfield.textFlow = textFlow;
    //         let tw = egret.Tween.get(textfield);
    //         tw.to({ "alpha": 1 }, 200);
    //         tw.wait(2000);
    //         tw.to({ "alpha": 0 }, 200);
    //         tw.call(change, this);
    //     };

    //     change();
    // }
}

class Dot extends egret.Shape {
    public constructor(gx, gy, size) {
        super();
        this.graphics.beginFill(0x121212);
        this.graphics.drawCircle(0, 0, size);
        this.graphics.endFill();
        this.gx = gx;
        this.gy = gy;
        this.touchEnabled = true;
        this.name = "dot";
    }
    public gx;
    public gy;
    public onTouch() {
        this.scaleX = 1.2;
        this.scaleY = 1.2;
    }
    public endTouch() {
        this.scaleX = 1;
        this.scaleY = 1;
    }
}
class Line extends egret.Shape {
    private lineColor;
    private lineTouchColor;
    private playerLineColor;
    public constructor(gx, gy, width, height, type, param) {
        super();
        this.lineColor = param.lineColor;
        this.lineTouchColor = param.lineTouchColor;
        this.playerLineColor = param.playerLineColor;
        this.graphics.beginFill(this.lineColor);
        this.graphics.drawRect(-width / 2, -height / 2, width, height);
        this.graphics.endFill();
        this.gx = gx;
        this.gy = gy;
        this.gtype = type;
        this.touchEnabled = true;
        this.width = width;
        this.height = height;
        this.name = "Line";
    }
    public width;
    public height;
    public gx;
    public gy;
    public gtype;
    public touched = false;
    public onTouch() {
        this.graphics.beginFill(this.lineTouchColor);
        this.graphics.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.graphics.endFill();
    }
    public endTouch() {
        this.graphics.beginFill(this.lineColor);
        this.graphics.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.graphics.endFill();
    }
    public setWall(player) {
        this.touched = true;
        this.graphics.beginFill(this.playerLineColor[player]);
        this.graphics.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.graphics.endFill();
    }
}

class Player extends egret.Shape {
    // private lineColor;
    // private lineTouchColor;
    // private playerLineColor;

    public player;
    public constructor(r, player, param) {
        super();
        this.graphics.beginFill(param.playerLineColor[player]);
        this.graphics.drawCircle(0, 0, r);
        this.graphics.endFill();
        this.player = player;
        this.touchEnabled = true;
        this.name = "player";
        // this.lineColor = param.lineColor;
        // this.lineTouchColor = param.lineTouchColor;
        // this.playerLineColor = param.playerLineColor;
        // this.graphics.beginFill(this.lineColor);
        // this.graphics.drawRect(-width / 2, -height / 2, width, height);
        // this.graphics.endFill();
        // this.gx = gx;
        // this.gy = gy;
        // this.gtype = type;
        this.touchEnabled = true;
        // this.width = width;
        // this.height = height;
        // this.name = "Line";
    }
    // public width;
    // public height;
    public gx;
    public gy;
    // public setPosition(width, gx, gy) {
    //     this.x = width * (gx + 0.5) + 10;
    //     this.y = width * (gy + 0.5) + 10;
    //     this.gx = gx;
    //     this.gy = gy;
    // }
    // public gtype;
    // public touched = false;
    // public onTouch() {
    //     this.graphics.beginFill(this.lineTouchColor);
    //     this.graphics.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
    //     this.graphics.endFill();
    // }
    // public endTouch() {
    //     this.graphics.beginFill(this.lineColor);
    //     this.graphics.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
    //     this.graphics.endFill();
    // }
    // public setWall(player) {
    //     this.touched = true;
    //     this.graphics.beginFill(this.playerLineColor[player]);
    //     this.graphics.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
    //     this.graphics.endFill();
    // }
}   