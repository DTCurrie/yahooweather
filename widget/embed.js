window.onload = function(){
    console.log("loaded");

    var head = document.head
        , link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = 'yahooweather.min.css';

    head.appendChild(link);

    document.getElementById("yahooweather")
        .innerHTML = '<object type="type/html" data="https://rawgit.com/DTCurrie/yahooweather/master/widget/index.html" ></object>';
};