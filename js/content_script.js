
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
    // // 切换公网线路(解决 湖南商务职业技术学院本校线路问题)
     $("#iframe").contents().find(".ans-attach-online").contents().find(".vjs-playline-button li:nth-of-type(2)").click()
    $("#iframe").contents().find(".ans-attach-online").contents().find(".vjs-big-play-button").click();
    $("#iframe").contents().find(".ans-attach-online").contents().find(".vjs-mute-control").click()
}

function stop_pause(){
    // document.querySelector("#video_html5_api").pause = function(){}
    // $("#iframe").contents().find(".ans-attach-online").contents().find("#video_html5_api").on("pause", function(){
    //     console.log("stop pause");
    //     video_start();
    // })
    $("#iframe").contents().find(".ans-attach-online").contents().find("#video_html5_api")[0].pause = function(){
        console.log("stop pause");
        video_start();
    }
}

function start(){
    setTimeout(function() {
        video_start();
        stop_pause();

        // 时间监听
        $("#iframe").contents().find(".ans-attach-online").contents().find("video").on("timeupdate", 
            function(){
                var video = $("#iframe").contents().find(".ans-attach-online").contents().find("video")[0];
                var ctime = video.currentTime / 60;
                var ttime = video.duration / 60 - 0.3;
                
                // console.log(ctime);
                // console.log(ttime);
                if(ctime >= ttime) {
                    console.log("已完成");
                    // $($(".orange01")[1]).siblings()[2].click();
                    if($($(".ncells .currents").parent()).next().length > 0) {
                        $($(".ncells .currents").parent()).next().find('a')[0].click();
                    }else{
                        $(".ncells .currents").parent().parent().next().find('a')[0].click();
                    }

                    start();
                }
            })
    }, 2000);
}

start();