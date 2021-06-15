// 캔버스
var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 변수 선언
    var stars = [], // 별
        FPS = 60,
        x = 100, // 별의 개수
        mouse = {
          x: 0,
          y: 0
        };  // 마우스 위치
    
    // 별을 배열에 넣는다
    for (var i = 0; i < x; i++) {
      stars.push({
        x: Math.random() * canvas.width, // 별 랜덤으로 생성
        y: Math.random() * canvas.height,
        radius: Math.random() * 1 + 1,
        vx: Math.floor(Math.random() * 50) - 25,
        vy: Math.floor(Math.random() * 50) - 25
      });
    }
    
    // 전체 그리기
    function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height); // 화면 지우기
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0, x = stars.length; i < x; i++) {
        var s = stars[i];
        ctx.fillStyle = "#fff";
        ctx.beginPath(); // 마우스를 따라 선 생성
        ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.stroke();
      }
      
      // 마우스를 따라 선 생성
      ctx.beginPath();
      for (var i = 0, x = stars.length; i < x; i++) {
        var starI = stars[i];
        ctx.moveTo(starI.x,starI.y); 
        if(distance(mouse, starI) < 150) ctx.lineTo(mouse.x, mouse.y);
        for (var j = 0, x = stars.length; j < x; j++) {
          var starII = stars[j];
          if(distance(starI, starII) < 150) {
            //ctx.globalAlpha = (1 / 150 * distance(starI, starII).toFixed(1));
            ctx.lineTo(starII.x,starII.y); 
          }
        }
      }
      ctx.lineWidth = 0.05;
      ctx.strokeStyle = 'white';
      ctx.stroke();
    }
    
    // 두 점 사이 거리 계산
    function distance( point1, point2 ){
      var xs = 0;
      var ys = 0;

      xs = point2.x - point1.x;
      xs = xs * xs;

      ys = point2.y - point1.y;
      ys = ys * ys;

      return Math.sqrt( xs + ys );
    }
    
    // 별의 위치를 업데이트
    function update() {
      for (var i = 0, x = stars.length; i < x; i++) {
        var s = stars[i];
      
        s.x += s.vx / FPS;
        s.y += s.vy / FPS;
        
        if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
        if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
      }
    }
    
    canvas.addEventListener("mousemove", function(e){
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    
    // 업데이트 및 그리기
    function tick() {
      draw();
      update();
      requestAnimationFrame(tick);
    }
    
    tick();