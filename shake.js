function Shake() {

    //기능 감지
    this.hasDeviceMotion = 'ondevicemotion' in window;

    //흔들림에 대한 기본 속도 임계 값
    this.threshold = 15;

    //여러 번 흔들리는 것을 방지하기 위해 
    this.lastTime = new Date();

    //가속도값
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;

    //맞춤이벤트
    this.event = document.createEvent('Event');
    this.event.initEvent('shake', true, true);
}

//reset timer values 좌표 리셋
Shake.prototype.reset = function () {

    this.lastTime = new Date();
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;
};

//리스너 시작
Shake.prototype.start = function () {

    this.reset();
    if (this.hasDeviceMotion) { window.addEventListener('devicemotion', this, false); } //리셋 후 이벤트 리스너 추가 및 시작
};

// 리스너 제거
Shake.prototype.stop = function () {

    if (this.hasDeviceMotion) { window.removeEventListener('devicemotion', this, false); } //이벤트 리스너 제거
    this.reset();
};

//흔들림 시작시 방향과 좌표 계산
Shake.prototype.devicemotion = function (e) {

    var current = e.accelerationIncludingGravity,
        currentTime,
        timeDifference,
        deltaX = 0,
        deltaY = 0,
        deltaZ = 0;

    if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) { //처음

        this.lastX = current.x; //처음에 최근값을 지금값으로
        this.lastY = current.y;
        this.lastZ = current.z;
        return;
    }

    deltaX = Math.abs(this.lastX - current.x); //방향 측정
    deltaY = Math.abs(this.lastY - current.y);
    deltaZ = Math.abs(this.lastZ - current.z);

    if (((deltaX > this.threshold) && (deltaY > this.threshold)) || ((deltaX > this.threshold) && (deltaZ > this.threshold)) || ((deltaY > this.threshold) && (deltaZ > this.threshold))) {

        //마지막 흔들림이 등록 된 이후 시간을 밀리 초 단위로 계산
        currentTime = new Date();
        timeDifference = currentTime.getTime() - this.lastTime.getTime();

        if (timeDifference > 1000) {
            window.dispatchEvent(this.event);
            this.lastTime = new Date();
        }
    }
};

// 이벤트 제어
Shake.prototype.handleEvent = function (e) {

    if (typeof (this[e.type]) === 'function') {
        return this[e.type](e);
    }
};

//새 인스턴스 생성 shake.js. 이게 트리거 같은데 어떤 원리인지...
var myShakeEvent = new Shake();
myShakeEvent.start();