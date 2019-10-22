
function getTitle(selector) {
    let t = document.getElementById(selector);

    if(t != undefined && t != null && t.attributes.title.textContent == "视频"){
        return t;
    }
    return false;
}

function selected() {
    let dt2 = getTitle("dct2");
    let dt3 = getTitle("dct3");

    if(dt2) {
        dt2.click();
    }else if(dt3) {
        dt3.click();
    }
}

// 自动播放
function video_start() {
    console.log("video start");
    $("#iframe").contents().find(".ans-attach-online").contents().find(".vjs-big-play-button").click();
}

function stop_pause(){
    $("#iframe").contents().find(".ans-attach-online").contents().find("#video_html5_api").on("pause", function(){
        console.log("stop pause");
        video_start();
    })
}


setTimeout(function() {
    video_start();
    stop_pause();

    // 时间监听
    $("#iframe").contents().find(".ans-attach-online").contents().find("video").on("timeupdate", 
        function(){
            var video = $("#iframe").contents().find(".ans-attach-online").contents().find("video")[0];
            var ctime = video.currentTime / 60;
            var ttime = video.duration / 60 - 1;
            
            // console.log(ctime);
            // console.log(ttime);
            if(ctime >= ttime) {
                console.log("已完成");
                $($(".orange01")[0]).siblings()[2].click();

                setTimeout(function() {
                    video_start();
                    stop_pause();
                }, 2000);
            }
        })
}, 2000);