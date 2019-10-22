console.log("exam")

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

var zyBottom = document.getElementById("ZyBottom");
if(zyBottom != null && zyBottom != undefined){
    var titles = document.getElementById("ZyBottom").getElementsByClassName("Zy_TItle");;
    console.log(titles);

    for(var i = 0;i < titles.length;i++) {
        var title = titles[i].getElementsByTagName("div")[0];

        chrome.runtime.sendMessage({type: "exam", text: title.innerText, index: i}, function(response){
            // titles[response.index].getElementsByTagName("div")[0].before(response.answer);
        });
    }
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    var titles = document.getElementById("ZyBottom").getElementsByClassName("Zy_TItle");
    titles[message.index].getElementsByTagName("div")[0].before(message.answer);
    
});

// var titles = document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("frame_content").contentWindow.document.getElementById("ZyBottom").getElementsByClassName("Zy_TItle");

// for(var i = 0;i < titles.length;i++) {
//     var title = titles[i].getElementsByTagName("div");
    
//     http("http://xdt.1ym.shop/tiku.php?tm=" + titles[i].innerText, function(data){
//         title[0].before(data);
//     });
// }