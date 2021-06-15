var canvas = document.getElementById("area");
var context = canvas.getContext("2d");
var mouseX = 0; // 마우스 위치
var mouseY = 0;
var gravity = 4; // 중력
var clickDuration = 1; // 클릭 지속 시간
var points = 0; // 포인트
var arrowState = 0; // 0 - not moving / 1 - Moving
let timer = null;
var btn=document.getElementById("btn");
canvas.height = window.innerHeight;
canvas.width = 1350; //캔버스 너비

let gravityLabel;
let pointsLabel;

let arrowMovement;
let target4 = new Target(10, canvas.height / 2 , canvas.width - 30, canvas.height / 4, "#ff6699"); // 과녁 가로 세로 , 
let target6 = new Target(10, canvas.height / 3, canvas.width - 30, canvas.height / 3, "#ffae29");
let target8 = new Target(10, canvas.height / 6, canvas.width - 30, canvas.height / 2.4, "#00b896");
let target10 = new Target(10, canvas.height / 15, canvas.width - 30, canvas.height / 2.15, "#2b3039");
let bow = new Bow(310, canvas.height / 2, canvas.height / 10); //크기, 다름
let arrow = new Arrow(310, canvas.height / 2 , 160, 2); //x, y ,width, height, angle

window.onload = () => { // 중력
  gravityLabel = document.getElementById("gravity");
  gravityLabel.innerText = "중력 : " + gravity;
  pointsLabel = document.getElementById("points");
}

// ********
setTimeout(function() {
  btn.style.display='block';
}, 10000);

//Objects----------------------------------------------------------
//args order = width, height, x, y, color

// 과녁
function Target(...args){
  this.width = args[0];
  this.height = args[1];
  this.x = args[2];
  this.y = args[3];
  this.color = args[4];
  context = context;
  context.fillStyle = args[4];
  context.fillRect(this.x, this.y, this.width, this.height);
}

// 활
function Bow(x, y, radius) {
  this.x = x;
  this.y = y;
  context.lineWidth=5;
  // 활 회전
  this.rotate = (degrees) => {
    context.clearRect(0, 0, x + 500, canvas.height);
    context.save();
    
    context.translate(x, y+2);
    context.rotate(degrees * Math.PI/180);

    context.beginPath();
    context.arc(-20, 0, radius, -Math.PI/2, Math.PI/2);
    context.stroke();

    context.beginPath();
    context.moveTo(-20, 0 - radius);
    context.strokeStyle="#fff"; //활시위색상
    context.lineTo(-20, 0 + radius);
    context.stroke();

    context.restore();
  }

  context.beginPath();
  context.arc(x, y, radius, -Math.PI/2, Math.PI/2);
  context.stroke();
  
  context.beginPath();
  context.moveTo(-20, 0 - radius);
  context.lineTo(-20, 0 + radius);
  context.stroke();

  requestAnimationFrame(Bow);
}

// 화살
function Arrow(x, y, width, height, angle = 0){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.angle = angle;

  // 화살 회전
  this.rotate = (degrees) => {
    this.angle = degrees;
    if(arrowState == 1){
      context.clearRect(x - 10, y  - 100 , x + width*2+ 1, y + 100);
    }
    context.save();
    context.translate(x, y + 2);
    context.rotate(degrees * Math.PI / 180);
    //-30, -1, 60, 2, 

    context.fillStyle = "black";
    context.fillRect(-30, -1, width, height);

    context.restore();
  }
  context.rotate(angle * Math.PI / 180);
  context.fillStyle = "black";
  context.fillRect(x, y, width, height);
  requestAnimationFrame(Arrow);
}
//------------------------------------------------------


//Events-------------------------------------------------
// 마우스
canvas.addEventListener("mousemove", (e) => {
  if(arrowState == 0){
    mouseY = e.clientY;
    mouseX = e.clientX;
    let degrees = ((canvas.height/2 - mouseY) * (-90) / canvas.height); // 마우스 위치 -> 각도
    bow.rotate(degrees);
    arrow.rotate(degrees);
  }
}, false);

// keep pressing
document.addEventListener("keydown", (e) => {
  if(arrowState == 0){
    if(e.code == "Space"){ // 
      timer = setTimeout(() => {
        clickDuration += 100;
      }, 100);
    }
  }
});

// stop pressing
document.addEventListener("keyup", (e) => {
  if(arrowState == 0){
    if(e.code == "Space"){
      clearTimeout(timer); //
      shootArrow(clickDuration);
      clickDuration = 1;
      timer = null;
    }
  }
});
//---------------------------------------------


// 화살 발사
function shootArrow(force) {
  arrowState = 1;
  // 화살 속도
  force  = force >= 4000 ? 4000 : force; // 힘 크기 제한
  arrowMovement = setInterval(() => {
    let speed = force / 100; // 힘과 속도가 비례
    let previousAngle = arrow.angle;
    context.clearRect(arrow.x - 50, arrow.y  - 100 , arrow.x + arrow.width + 1, arrow.y + 100); // x, y, width, height
    arrow = new Arrow(arrow.x + speed, arrow.y + (previousAngle / 15) * gravity, arrow.width, arrow.height);
    arrow.rotate(previousAngle + 10 / (gravity *2));
    
    // 과녁 생성
    target4 = new Target(10, canvas.height / 2 , canvas.width - 30, canvas.height / 4, "#ff6699");
    target6 = new Target(10, canvas.height / 3, canvas.width - 30, canvas.height / 3, "#ffae29");
    target8 = new Target(10, canvas.height / 6, canvas.width - 30, canvas.height / 2.4, "#00b896");
    target10 = new Target(10, canvas.height / 15, canvas.width - 30, canvas.height / 2.15, "#2b3039");

    let collided = checkCollision(target10.x);
    if(collided) { // 과녁에 충돌했다면
      clearInterval(arrowMovement);
      arrowState = 0;
      arrowMovement = null;
      reset(target10, target8, target6, target4);
    }

  }, 20);
}

// 화살이 과녁에 맞았는가?
function checkCollision(target){
  if(arrow.y + arrow.height >= canvas.height){
    return true;
  } else if(arrow.x + arrow.width >= target){  
    return true;
  } 
    return false;
  }

// 포인트 계산
function countPoints(targets){
  for(let target of targets){
    if(target.y <= arrow.y + Math.abs(arrow.angle) && target.y + target.height > arrow.y + Math.abs(arrow.angle)){ //맞은 위치에 따라 차등 점수 배분
      switch (target) {
        case target10:
          return 10;
        case target8:
          return 8;
        case target6:
          return 6;
        case target4:
          return 4;
      }
    }
  }
  return 0;
}

// 리셋
function reset(...targets){
  points += countPoints(targets);
  console.log(countPoints(targets));
  pointsLabel.innerText = "Points: " + points;
  bow = new Bow(310, canvas.height / 2, canvas.height / 10);
  arrow = new Arrow(310, canvas.height / 2 , 160, 2);
  gravity = ((10 - 3)) + 3;
  gravityLabel.innerText = "Gravity: " + Math.floor(gravity);
}