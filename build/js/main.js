var score = document.querySelector('.score'), start = document.querySelector('.start'), stopGameBtn = document.querySelector('.stop'), gameArea = document.querySelector('.gameArea'), car = document.createElement('div');
car.classList.add('car');
var keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};
var setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};
// how many elements on viewport screen
var getQuantityElements = function (heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
};
var startGame = function () {
    start === null || start === void 0 ? void 0 : start.classList.add('hide');
    stopGameBtn === null || stopGameBtn === void 0 ? void 0 : stopGameBtn.classList.remove('hide');
    // drawing lines
    for (var i = 0; i < getQuantityElements(100); i++) {
        var line = document.createElement('div');
        line.classList.add('line');
        line.style.top = i * 100 + "px";
        line.y = i * 100;
        gameArea === null || gameArea === void 0 ? void 0 : gameArea.appendChild(line);
    }
    // drawing enemy
    for (var i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        var enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.top = enemy.y + "px";
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
        enemy.style.background = "transparent url('../images/enemy.png') center / cover no-repeat";
        gameArea === null || gameArea === void 0 ? void 0 : gameArea.appendChild(enemy);
    }
    setting.start = true;
    gameArea === null || gameArea === void 0 ? void 0 : gameArea.appendChild(car);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
};
var playGame = function () {
    if (setting.start) {
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea !== null && (gameArea.offsetWidth - car.offsetWidth))) {
            setting.x += setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea !== null && (gameArea.offsetHeight - car.offsetHeight))) {
            setting.y += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        car.style.left = setting.x + "px";
        car.style.top = setting.y + "px";
        requestAnimationFrame(playGame);
        // ост
        // setTimeout(() => {
        //   setting.start = false
        //   console.log('Game stopped');
        // }, 50000);
    }
};
var stopGame = function () {
    start === null || start === void 0 ? void 0 : start.classList.remove('hide');
    stopGameBtn === null || stopGameBtn === void 0 ? void 0 : stopGameBtn.classList.add('hide');
    gameArea.innerHTML = '';
    setting.start = false;
};
var startRun = function (event) {
    event.preventDefault();
    keys[event.key] = true;
};
var stopRun = function (event) {
    event.preventDefault();
    keys[event.key] = false;
};
var moveRoad = function () {
    var lines = document.querySelectorAll('.line');
    lines.forEach(function (line) {
        line.y += setting.speed;
        line.style.top = line.y + "px";
        // restart lines on viewport
        if (line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
    });
};
var moveEnemy = function () {
    var enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function (item) {
        item.y += setting.speed / 2;
        item.style.top = item.y + "px";
        // random position restarted cars
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
        }
    });
};
start === null || start === void 0 ? void 0 : start.addEventListener('click', startGame);
stopGameBtn === null || stopGameBtn === void 0 ? void 0 : stopGameBtn.addEventListener('click', stopGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
