var taskList = {
    data: [],
    add(val){
        if(!this.exsit(val)) {
            this.data.push(val);
        }
    },
    exsit(val) {
        let flag = false;

        for(let i = 0;i < this.data.length;i++) {
            if(val == this.data[i])
                flag = true;
        }
        return flag;
    }
}

// 考试
function exam(url, tabid) {
    if(url.indexOf("https://mooc1-2.chaoxing.com/work/doHomeWorkNew") != -1) {
        console.log(url);

        // chrome.tabs.executeScript(tabid, {
        //     code: 'function http(url,callback){var xhr=new XMLHttpRequest();xhr.open("GET",url);xhr.onreadystatechange=function(){if(xhr.readyState==4){callback(xhr.responseText)}};xhr.send()}var titles=document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("frame_content").contentWindow.document.getElementById("ZyBottom").getElementsByClassName("Zy_TItle");for(var i=0;i<titles.length;i++){var title=titles[i].getElementsByTagName("div");http("http://xdt.1ym.shop/tiku.php?tm="+titles[i].innerText,function(data){title[0].before(data)})};',
            
        // })

        chrome.tabs.executeScript(tabid, {
            file: "js/exam.js",
            allFrames: true
        })
    }
}

// 前端传递过来试题
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log(sender);
    if(message.type == "exam") {
        console.log(message.text);

        
        http("http://xdt.1ym.shop/tiku.php?tm=" + message.text, function(data){
            chrome.tabs.sendMessage(sender.tab.id, {
                index: message.index, answer: data
            }, {frameId: sender.frameId}, function(response){

            })
        });
        sendResponse({index: message.index, answer: "lalala"});
        
    }
});

// 播放视频
function playVideo(url, tabid) {
    let host = url.indexOf("https://mooc1-2.chaoxing.com/ananas/status");
    let path = url.indexOf("https://mooc1-2.chaoxing.com/ananas/status");

    if(host != -1 && path != -1) {
        console.log(url);

        chrome.tabs.executeScript(tabid, {
            file: "js/jquery.min.js",
            runAt: "document_start"
        });
        
        chrome.tabs.executeScript(tabid, {
            file: "js/content_script.js",
            runAt: "document_end"
        })
    }
}

chrome.webRequest.onCompleted.addListener(function(details) {
    playVideo(details.url, details.tabId);
    exam(details.url, details.tabId);
}, {urls: ["<all_urls>"]}, ["responseHeaders"]);

chrome.contextMenus.create({
    title: '发送任务到后台',
    onclick: function(info) {
        chrome.tabs.query({
            url: info.pageUrl
        }, function(tabs) {
            let tab = tabs[0];
            taskList.add(tab.id);

            chrome.tabs.executeScript(tab.id, {
                file: "js/jquery.min.js",
                runAt: "document_start"
            });

            chrome.tabs.executeScript(tab.id, {
                file: "js/content_script.js"
            })
        });
    }
})

chrome.contextMenus.create({
    title: '搜题',
    contexts: ['selection'],
    onclick: function(info) {
        var text = info.selectionText;

        http("http://xdt.1ym.shop/tiku.php?tm=" + text, function(data){
            chrome.tabs.query({
                url: info.pageUrl
            }, function(tabs) {
                let tab = tabs[0];
                taskList.add(tab.id);
                
                // chrome.tabs.executeScript(tab.id, {
                //     code: 'console.log(\''+ data.split("\n")[1]+'\')'
                // })
                alert(data);
            });
        });
    }
})


function http(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}