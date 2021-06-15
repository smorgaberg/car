function pause1() {
    // 끄기
    var audio = document.getElementById("audio1");
    audio.pause();
}
function play1() {
    // 기다렸다가 시작 (밀리초)
    setTimeout(function(){
        document.getElementById("audio1").play();
        console.log('your audio is started just now');
      }, 1000)
}

function play2() {
    // 기다렸다가 시작 (밀리초)
    setTimeout(function(){
        document.getElementById("audio2").play();
        console.log('your audio is started just now');
      }, 0)
}

function pause2() {
    var audio = document.getElementById("audio2");
    audio.pause();
}

function play3() {
    setTimeout(function(){
        document.getElementById("audio3").play();
        console.log('your audio is started just now');
      }, 0)
}

function pause3() {
    var audio = document.getElementById("audio3");
    audio.pause();
}

function play4() {
    setTimeout(function(){
        document.getElementById("audio4").play();
        console.log('your audio is started just now');
      }, 0)
}

function pause4() {
    var audio = document.getElementById("audio4");
    audio.pause();
}

function play5() {
    setTimeout(function(){
        document.getElementById("audio5").play();
        console.log('your audio is started just now');
      }, 0)
}