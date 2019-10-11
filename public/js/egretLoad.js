function canvasLoad(){
var loadScript = function (list, callback) {
    var loaded = 0;
    var loadNext = function () {
        loadSingleScript(list[loaded], function () {
            loaded++;
            if (loaded >= list.length) {
                callback();
            }
            else {
                loadNext();
            }
        })
    };
    loadNext();
};

var loadSingleScript = function (src, callback) {
    var s = document.createElement('script');
    s.async = false;
    s.src = src;
    s.addEventListener('load', function () {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', arguments.callee, false);
        callback();
    }, false);
    document.body.appendChild(s);
};

var xhr = new XMLHttpRequest();
xhr.open('GET', './manifest.json?v=' + Math.random(), true);
xhr.addEventListener("load", function () {
    var manifest = JSON.parse(xhr.response);
    var list = manifest.initial.concat(manifest.game);
    loadScript(list, function () {
        /**
         * {
         * "renderMode":, //Engine rendering mode, "canvas" or "webgl"
         * "audioType": 0 //Use the audio type, 0: default, 2: web audio, 3: audio
         * "antialias": //Whether the anti-aliasing is enabled in WebGL mode, true: on, false: off, defaults to false
         * "calculateCanvasScaleFactor": //a function return canvas scale factor
         * }
         **/
        egret.runEgret({ renderMode: "webgl", audioType: 0, calculateCanvasScaleFactor:function(context) {
            var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            return (window.devicePixelRatio || 1) / backingStore;
        }});
    });
});
xhr.send(null);
}