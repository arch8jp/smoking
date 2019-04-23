// 位置情報自動取得
function CurrentPosition() {
    navigator.geolocation.getCurrentPosition(CurrentPosition2);
}

function CurrentPosition2(position) {

    var lat2 = position.coords.latitude ;
    var lng2 = position.coords.longitude ;
    console.log(lat2);
    console.log(lng2);

    //textbox に自動入力
    document.getElementById( "textbox" ).value = "*現在地* "+ lat2 + " " + lng2; 

    //自動でクリックイベントを行う
     document.getElementById("submit_button").click();
    
}