const score: HTMLDivElement | null = document.querySelector('.score'),
      start: HTMLDivElement | null = document.querySelector('.start'),
      stopGameBtn: HTMLDivElement | null = document.querySelector('.stop'),
      gameArea: HTMLDivElement | any = document.querySelector('.gameArea'),
      car: HTMLDivElement = document.createElement('div');

      car.classList.add('car')

const keys: {[key:string]: any} = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
}

const setting: {[key:string]: any} = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3
}

// how many elements on viewport screen
const getQuantityElements = (heightElement: number) => {
  return document.documentElement.clientHeight / heightElement + 1
} 

const startGame = (): void => {
  start?.classList.add('hide');
  stopGameBtn?.classList.remove('hide');

  // drawing lines
  for (let i = 0; i < getQuantityElements(100); i++) {

    const line: any = document.createElement('div');
    
    line.classList.add('line');
    line.style.top = `${i * 100}px`;
    line.y = i * 100;
    gameArea?.appendChild(line)
  }

  // drawing enemy
  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy: any = document.createElement('div')
    enemy.classList.add('enemy')
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.top = `${enemy.y}px`;
    enemy.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
    // enemy.style.background = `transparent url('../images/enemy2.png') center/cover no-repeat`;
    gameArea?.appendChild(enemy)
  }

  setting.start = true

  gameArea?.appendChild(car);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;

  requestAnimationFrame(playGame)
}

const playGame = (): void => {

  if (setting.start) {
    moveRoad();
    moveEnemy()
    
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }

    if (keys.ArrowRight && setting.x < (gameArea !== null && (gameArea.offsetWidth - car.offsetWidth))) {
      setting.x += setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea !== null && (gameArea.offsetHeight - car.offsetHeight))) {
      setting.y += setting.speed
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed
    }

    car.style.left = `${setting.x}px`
    car.style.top = `${setting.y}px`

    requestAnimationFrame(playGame)

    // ост
    // setTimeout(() => {
    //   setting.start = false
    //   console.log('Game stopped');
    // }, 50000);
  }
}

const stopGame = ():void => {
  start?.classList.remove('hide');
  stopGameBtn?.classList.add('hide');

  gameArea.innerHTML = '';

  setting.start = false
}

const startRun = (event: KeyboardEvent):void => {
  event.preventDefault();
  keys[event.key] = true
}

const stopRun = (event: KeyboardEvent):void => {
  event.preventDefault()
  keys[event.key] = false
}

const moveRoad = ():void => {
  let lines = document.querySelectorAll('.line');

  lines.forEach(function (line: any): void {
    line.y += setting.speed;
    line.style.top = `${line.y}px`;

    // restart lines on viewport
    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  })
}

const moveEnemy = ():void => {
  let enemy: any = document.querySelectorAll('.enemy')

  enemy.forEach(function (item: any) {
    item.y += setting.speed / 2;
    item.style.top = `${item.y}px`

    // random position restarted cars
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100 * setting.traffic;
      item.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
    }
  })
}

start?.addEventListener('click', startGame);
stopGameBtn?.addEventListener('click', stopGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);