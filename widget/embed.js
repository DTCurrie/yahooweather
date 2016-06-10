window.onload = function(){
    console.log("loaded");
    document.getElementById("yahooweather")
        .innerHTML = '<object type="type/html" data="https://rawgit.com/DTCurrie/yahooweather/master/widget/index.html" ></object>';
};