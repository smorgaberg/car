            const speedDash = document.querySelector('.speedDash');
            const scoreDash = document.querySelector('.scoreDash');
            const lifeDash = document.querySelector('.lifeDash');
            const container = document.getElementById('container');
            const btnStart = document.querySelector('.btnStart');
            var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/);
            btnStart.addEventListener('click',startGame); // 버튼
            document.addEventListener('keydown',pressKeyOn); // 아래화살표 키
            document.addEventListener('keyup',pressKeyOff); // 위화살표 키
            var btn=document.getElementById("btn");
            //Game Variables
            let animationGame; //= requestAnimationFrame(playGame);
            let gamePlay = false; // 게임 시작 여부
            let player; 
            let keys = {
                ArrowUp:false,
                ArrowDown:false,
                ArrowLeft: false,
                ArrowRight: false
            }
            
            // 게임 시작
            function startGame() {
                //console.log(gamePlay);
                container.innerHTML ='';
                btnStart.style.display = "none";
                var div = document.createElement('div');
                div.setAttribute('class','playerBike');
                //자전거 x축 위치
                if(isMobile!=null) //모바일
                {div.x = 800;}
                else{div.x=850;} //웹
                div.y = 500; // 자전거 y축 위치
                container.appendChild(div); 
                gamePlay = true;
                animationGame = requestAnimationFrame(playGame);
                player ={ // 자전거
                    ele:div,
                    speed:0, //스피드
                    lives:10, //생명
                    gameScore:0,
                    carstoPass:0, //차 지나가기
                    score :0,
                    roadwidth:250, // 도로 너비
                    gameEndCounter:0
                }
                
                startBoard();
                setupBadGuys(10);
            }

            // ***  
            setTimeout(function() {
                btn.style.display='block';
              }, 10000);

            // 장애물 셋팅
            function setupBadGuys(num){
                for(let x =0; x<num; x++)
                {
                    let temp = 'badGuy'+(x+1);
                    let div = document.createElement('div');
                    div.innerHTML = (x+1);
                    div.setAttribute('class','baddy');
                    div.setAttribute('id',temp);
                    //div.style.backgroundColor = randomColor();
                    makeBad(div);
                    container.appendChild(div);
                }
            }
            
            // 장애물 색상 랜덤 생성
            function randomColor(){
                function c(){
                    let hex = Math.floor(Math.random()*256).toString(16);
                    return ('0'+String(hex)).substr(-2);
                }
                return '#'+c()+c()+c();
            }
            
            // 장애물 랜덤 생성
            function makeBad(e){
                let tempRoad = document.querySelector('.road');
                e.style.left = tempRoad.offsetLeft + Math.ceil(Math.random()*tempRoad.offsetWidth)-30+'px';
                e.style.top = Math.ceil(Math.random()*-400)+'px';
                e.speed = Math.ceil(Math.random()*17)+2;
                e.style.backgroundColor = randomColor();
            }
            
            // 
            function startBoard() {
                for(let x=0; x<13; x++) {
                    let div = document.createElement('div');
                    div.setAttribute('class','road');
                    div.style.top = (x*50)+'px';
                    div.style.width = player.roadwidth + 'px';
                    container.appendChild(div);
                }
            }
            
            // 위 방향 키 이벤트
            function pressKeyOn(event){
                event.preventDefault();
                //console.log(keys);
                keys[event.key]=true;
            }

            // 아래 방향 키 이벤트
            function pressKeyOff(event){
                event.preventDefault();
                //console.log(keys);
                keys[event.key]=false;
            }
            
            // 대시보드 업데이트
            function updateDash(){
                //console.log(player);
                scoreDash.innerHTML = player.score;
                lifeDash.innerHTML = player.lives;
                speedDash.innerHTML = Math.round(player.speed*10);
            }
            
            // 도로 *****
            function moveRoad(){
                let tempRoad = document.querySelectorAll('.road');
                //console.log(tempRoad);
                let previousRoad = tempRoad[0].offsetLeft;
                let previousWidth = tempRoad[0].offsetWidth;
                const pSpeed = Math.floor(player.speed);
                for(let x=0; x<tempRoad.length; x++)
                {
                    let num = tempRoad[x].offsetTop + pSpeed;
                    if(num>600){
                        num = num - 650;
                        let mover = previousRoad + (Math.floor(Math.random()*6)-3);
                        let roadWidth = (Math.floor(Math.random()*11)-5)+previousWidth;
                        if(roadWidth<200)roadWidth=200;
                        if(roadWidth>400)roadWidth=400;
                        if(mover<100)mover=100;
                        if(mover>600)mover=600;
                        //도로 시작
                        if(isMobile!=null) //모바일
                        {tempRoad[x].style.left = "40%";} //도로 위치
                        else{tempRoad[x].style.left = "44%";} //웹
                        tempRoad[x].style.width = roadWidth + 'px';
                        previousRoad = tempRoad[x].offsetLeft;
                         previousWidth = tempRoad[x].width;
                    }
                    tempRoad[x].style.top = num + 'px';
                }
                return {'width':previousWidth,'left':previousRoad};
            }
            
            // 장애물과 충돌할 경우
            function isCollide(a,b){
                let aRect =a.getBoundingClientRect();
                let bRect =b.getBoundingClientRect();
                //console.log(aRect);
                return !(
                    (aRect.bottom < bRect.top)||
                    (aRect.top > bRect.bottom)||
                    (aRect.right <bRect.left)||
                    (aRect.left > bRect.right)
                )
            }
            
            // 장애물의 움직임
            function moveBadGuys(){
                let tempBaddy = document.querySelectorAll('.baddy');
                for(let i=0; i<tempBaddy.length; i++) {   
                    for(let ii=0; ii<tempBaddy.length; ii++) {
                        if(i!=ii && isCollide(tempBaddy[i],tempBaddy[ii])) {
                            tempBaddy[ii].style.top = (tempBaddy[ii].offsetTop + 50)+'px';
                            tempBaddy[i].style.top = (tempBaddy[i].offsetTop - 50)+'px';
                            tempBaddy[ii].style.left = (tempBaddy[ii].offsetLeft - 50)+'px';
                            tempBaddy[i].style.left = (tempBaddy[i].offsetLeft + 50)+'px';
                        }
                    }
            
                    let y = tempBaddy[i].offsetTop + player.speed - tempBaddy[i].speed;
                    if(y>2000 || y<-2000){
                        //reset car
                        if(y>2000)
                        {
                            player.score++;
                            // 점수가 일정 숫자를 넘어가면 승리
                            if(player.score > player.carstoPass) {
                                gameOverPlay();
                            }
                        }
                        makeBad(tempBaddy[i]);
                    }else{
                        tempBaddy[i].style.top = y + 'px';
                        let hitCar = isCollide(tempBaddy[i],player.ele);
                        console.log(hitCar);
                        if(hitCar){ // 충돌 횟수가 늘어나면 생명이 줄어듦
                            player.speed =0;
                            player.lives--;
                            if(player.lives<1) { //gameover
                            player.gameEndCounter = 1;
                            }
                            makeBad(tempBaddy[i]);
                        }
                    }
                }
            }
            
            // 게임 오버? 승리?
            function gameOverPlay()
            {
                player.gameEndCounter =12; // ******
                player.speed =0;
            }
            
            // main play
            function playGame(){
                if(gamePlay){
                    updateDash(); // Dashboard
                // movement
                let roadPara=moveRoad(); // 도로의 움직임
                moveBadGuys(); // 장애물의 움직임
                // 방향 키에 따른 속도 계산
                if(keys.ArrowUp)
                {   if(player.ele.y>400)
                    player.ele.y -=  1;
                    player.speed = player.speed <20 ? (player.speed+0.05):20;
                }
                if(keys.ArrowDown)
                {   if(player.ele.y<500)
                    {player.ele.y +=  1;}
                    player.speed = player.speed>0?(player.speed-0.2):0;
                }
                if(keys.ArrowRight)
                {
                    player.ele.x += (player.speed/4);
                }
                if(keys.ArrowLeft)
                {
                    player.ele.x -= (player.speed/4);
                }

                // 도로 위에 있음을 확인
                if((player.ele.x + 40)<roadPara.left || (player.ele.x)>(roadPara.left + roadPara.width))
                {   if(player.ele.y <500)player.ele.y += +1;
                    player.speed = player.speed >0?(player.speed-0.2):5;
                    //console.log('OFF ROAD');
                }
            
                // move bike
                player.ele.style.top = player.ele.y+'px';
                player.ele.style.left = player.ele.x+'px';
                }
                animationGame = requestAnimationFrame(playGame);
                if(player.gameEndCounter>0)
                {
                    player.gameEndCounter--;
                    player.y = (player.y >60)?player.y-30:60;
                    if(player.gameEndCounter ==0)
                    {
                        gamePlay = false;
                        if(player.lives<1) { // 패배 시
                        let losediv = document.createElement('div');
                        losediv.setAttribute('class','road');
                        losediv.style.top = '500px';
                        losediv.style.backgroundColor ='red';
                        losediv.style.width = '250px';
                        losediv.innerHTML = 'You Lose!'; // 
                        losediv.style.fontSize = '3em';
                        losediv.style.zIndex = '120';
                        container.appendChild(losediv);
                        }
                        cancelAnimationFrame(animationGame);
                        btnStart.style.display = 'block';
                    }
                }
            }