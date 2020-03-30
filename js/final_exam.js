var title = document.querySelector(".Cy_TItle>.clearfix").innerText;

chrome.runtime.sendMessage({type: "exam", text: title, index: 0}, function(response){
    // titles[response.index].getElementsByTagName("div")[0].before(response.answer);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    document.querySelector(".Cy_TItle").before(message.answer)
});