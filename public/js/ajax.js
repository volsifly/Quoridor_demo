// 封装AJAX，实现类似jquery调用方式
var Ajax = {
    post: function (url, data, callback) {
        var xmlhttp;
        if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
        else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                callback(xmlhttp.responseText, xmlhttp);
            }
        };
        xmlhttp.open("post", url, true);
        var post_data = new FormData();
        for (var Key in data) {
            post_data.append(Key, data[Key]);
        }
        xmlhttp.send(post_data);
    },
    get:function (url, callback) {
        var xmlhttp;
        if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
        else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                callback(xmlhttp.responseText, xmlhttp);
            }
        };
        xmlhttp.open("get", url, true);
        xmlhttp.send();
    },
    getSync:function (url) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
        return xmlhttp.responseText;
    },
    postSync:function (url, data) {
        var xmlhttp;
        if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
        else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.open("post", url, false);
        var post_data = new FormData();
        for (var Key in data) {
            post_data.append(Key, data[Key]);
        }
        xmlhttp.send(post_data);
        return xmlhttp.responseText;
    }
};