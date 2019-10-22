function switch_tab(){

    var tagtabs = $(".tabtags>span");

    console.log(tagtabs)
    if($(".tabtags .currents").attr("title") != "视频") {
        for(var i = 0;i<tagtabs.length;i++) {
            var t = $(tagtabs[i]).attr('title');

            if(t == "视频"){
                tagtabs[i].click();
                break;
            }
        }
    }
    
}

console.log("sasaad");

switch_tab();