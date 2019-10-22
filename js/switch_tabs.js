function switch_tab(){

    var tagtabs = $(".tabtags>span");
    var text = $(".tabtags .currents").attr("title");
    console.log(text);


    if(text == "学习目标") {
        for(var i = 0;i<tagtabs.length;i++) {
            var t = $(tagtabs[i]).attr('title');

            if(t == "视频"){
                tagtabs[i].click();
                break;
            }
        }
    }
    
}


switch_tab();