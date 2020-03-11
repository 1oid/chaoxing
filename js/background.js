var taskList = {
    data: [],
    add(val) {
        if (!this.exsit(val)) {
            this.data.push(val);
        }
    },
    exsit(val) {
        let flag = false;

        for (let i = 0; i < this.data.length; i++) {
            if (val == this.data[i])
                flag = true;
        }
        return flag;
    }
}

var a;
// 遇到考试题
function _temp_exam(url, tabid) {
    if (url.indexOf("chaoxing.com/richvideo/initdatawithviewer?mid=") != -1 && url.indexOf("_bg") == -1) {
        http(url + "&_bg", function (data) {
            var datas = JSON.parse(data)[0].datas;
            console.log(datas);
            var question_length = 0;
            var answers = [];

            for (var i = 0; i < datas.length; i++) {
                if (!datas[i].answered) {
                    question_length++;

                    console.log(datas[i].options);
                    for (var j = 0; j < datas[i].options.length; j++) {
                        if (datas[i].options[j].isRight) {
                            answers.push("第" + (i + 1) + "题的答案是: " + datas[i].options[j].name);
                        }
                    }

                }
            }

            chrome.tabs.executeScript(tabid, {
                file: "js/jquery.min.js",
                runAt: "document_start"
            });

            var ans = 'if(document.getElementsByClassName("ans-cc").length > 0) {document.getElementsByClassName("ans-cc")[0].getElementsByTagName("h2")[0].getElementsByTagName("strong")[0].getElementsByTagName("span")[0].innerText = document.getElementsByClassName("ans-cc")[0].getElementsByTagName("h2")[0].getElementsByTagName("strong")[0].getElementsByTagName("span")[0].innerText + \'' + '该章节有' + question_length + '道题, ' + answers.join(',') + "'}";
            chrome.tabs.executeScript(tabid, {
                code: ans,
                allFrames: true
            })
        })
    }
}

// 考试
function exam(url, tabid) {
    if (url.indexOf("chaoxing.com/work/doHomeWorkNew") != -1) {
        console.log("work");
        console.log(url);

        chrome.tabs.executeScript(tabid, {
            file: "js/exam.js",
            allFrames: true
        })
    }
}

// 前端传递过来试题
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(sender);
    if (message.type == "exam") {
        console.log(message.text);


        http("http://xdt.1ym.shop/tiku.php?tm=" + message.text, function (data) {
            chrome.tabs.sendMessage(sender.tab.id, {
                index: message.index, answer: data
            }, { frameId: sender.frameId }, function (response) {

            })
        });
        sendResponse({ index: message.index, answer: "lalala" });

    }
});

// 播放视频
function playVideo(url, tabid) {
    let host = url.indexOf("chaoxing.com/ananas/status");
    let path = url.indexOf("chaoxing.com/ananas/status");

    if (host != -1 && path != -1) {
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

// 切换tab
function switch_tabs(url, tabid) {
    if (url.indexOf('chaoxing.com/knowledge/cards?clazzid=') != -1) {
        console.log(url);

        chrome.tabs.executeScript(tabid, {
            file: "js/jquery.min.js",
            runAt: "document_start"
        });

        chrome.tabs.executeScript(tabid, {
            file: "js/switch_tabs.js"
        })
    }
}

chrome.webRequest.onCompleted.addListener(function (details) {
    playVideo(details.url, details.tabId);
    exam(details.url, details.tabId);
    switch_tabs(details.url, details.tabId);
    _temp_exam(details.url, details.tabId);
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);

chrome.contextMenus.create({
    title: '发送任务到后台',
    onclick: function (info) {
        chrome.tabs.query({
            url: info.pageUrl
        }, function (tabs) {
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
    onclick: function (info) {
        var text = info.selectionText;

        http("http://xdt.1ym.shop/tiku.php?tm=" + text, function (data) {
            chrome.tabs.query({
                url: info.pageUrl
            }, function (tabs) {
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
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}
