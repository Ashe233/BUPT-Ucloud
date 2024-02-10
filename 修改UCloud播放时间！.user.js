// ==UserScript==
// @name         修改UCloud播放时间！
// @namespace    https://ucloud.bupt.edu.cn/
// @version      0.1
// @description  改一次播放的时长
// @author       Lynnette
// @match        https://ucloud.bupt.edu.cn/uclass/course.html*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // 定义一个全局变量，用于标记是否已经hook过
    var isHooked = false;
    let timetoadd = 0;

    function createAutoDisappearingPopup(message, duration) {
        var popupContainer = document.createElement('div');
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.padding = '20px';
        popupContainer.style.background = 'white';
        popupContainer.style.border = '1px solid #ccc';
        popupContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        popupContainer.style.zIndex = '9999';

        var popupMessage = document.createElement('p');
        popupMessage.textContent = message;

        popupContainer.appendChild(popupMessage);
        document.body.appendChild(popupContainer);

        // Auto-hide after the specified duration
        setTimeout(function() {
            popupContainer.remove();
        }, duration);
        //setTimeout(function(){
            //location.reload();
        //},5000);
    }
    // 创建一个按钮
    function createHookButton() {
        var textElement = document.createElement("div");
        textElement.innerText = "输入秒数（最少9秒）后点击按钮即可hook心跳包发送函数。这会把本次播放的时间修改，即叠加到以前的时间上";
        textElement.style.position = "fixed";
        textElement.style.top = "5px";
        textElement.style.left = "10px";
        textElement.style.zIndex = "9999";
        textElement.style.backgroundColor = "white"; // 设置背景颜色为白色
        document.body.appendChild(textElement);
        let inputBox = document.createElement('input');
        inputBox.style.position = "fixed";
        inputBox.style.top = "60px";
        inputBox.style.left = "10px";
        inputBox.style.zIndex = "9999";
        inputBox.placeholder = '修改观看时间为：秒数';

    // 将输入框添加到页面
        document.body.appendChild(inputBox);

    // 为输入框添加事件监听器（示例：在输入框内容变化时输出到控制台）
        inputBox.addEventListener('input', function() {
            timetoadd = inputBox.value
            console.log('输入框内容变化:', timetoadd);
        });

        var button = document.createElement("button");
        button.innerText = "点击一次即可。将在n%9==0时候修改时间。";
        button.style.position = "fixed";
        button.style.top = "30px";
        button.style.left = "10px";
        button.style.zIndex = "9999";

        // 给按钮添加点击事件
        button.addEventListener("click", function() {
        if (!isHooked) {
            hookXMLHttpRequest();
            var newButton = document.createElement("button");
            newButton.innerText = "已经启动";
            newButton.style.position = "fixed";
            newButton.style.top = "30px";
            newButton.style.left = "10px";
            newButton.style.zIndex = "9999";
            newButton.disabled = true;
            document.body.appendChild(newButton); // 添加新按钮
            isHooked = true;
            document.body.removeChild(button); // 移除原按钮
        }
    });
        // 将按钮添加到页面
        document.body.appendChild(button);
    }

    // 获取原始的 XMLHttpRequest 函数
function hookXMLHttpRequest() {
    // 拦截请求
    var originalOpen = XMLHttpRequest.prototype.open;
    var originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        let that = this;
        // 在这里可以修改请求的URL、方法等信息
        console.log('Intercepted XMLHttpRequest - Method:', method, 'URL:', url);
        this._url = url; // 保存原始URL
        let lastIndex = url.lastIndexOf('=');

// 删除等号后面的内容
        if (lastIndex !== -1) {
            url = url.substring(0, lastIndex + 1);
            var mytime = timetoadd*1000;
            console.log(timetoadd);
            url += (mytime);
            console.log(url);
        } else {
            console.log("字符串中没有等号");
        }
        originalOpen.call(this, method, url, async, user, password);
    };

    XMLHttpRequest.prototype.send = function(data) {
        let that = this;
        // 在这里可以修改请求的数据
        console.log('Intercepted XMLHttpRequest - Sending Data:', data);

        // 修改请求数据的例子：在原有数据前面添加一段字符串
        var modifiedData = "ModifiedData: " + data;

        // 监听readystatechange事件
        this.onreadystatechange = function() {
            // 当readyState变为4时获取响应
            if (this.readyState === 4) {
                // this 里面就是请求的全部信息
                var alldata = JSON.parse(this.responseText); //可以获取到返回的数据
                console.log('Modified Response Data:', alldata);
                createAutoDisappearingPopup("已经修改过时间。刷新即可保存，如果后悔了，输入一个较小数值，等待下次弹窗即可。当前时间:"+(timetoadd)+"秒",6000)
            }
        };

        // 调用原始的send方法，传入修改后的数据
        originalSend.call(this, modifiedData);
    };
}
    var currentUrl = window.location.href;
// 检查是否是特殊网址的条件
    if (currentUrl.includes("https://ucloud.bupt.edu.cn/uclass/course.html#/resourceLearn?")) {
    // 创建按钮
    createHookButton();
    }
})();
