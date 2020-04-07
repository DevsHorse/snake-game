'use strict';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const food = new Image();
food.src = 'img/food.png';

const RECT = 32;
const TO_RADIANS = Math.PI/180; 

let backgroundColor = ['rgba(42, 119, 34, 1)', '#3AA02E'];
let direction = 'left';
let snake = [];
let score = 0;
let isEnd = false;
let record = localStorage.getItem('record') || 0;
let idAnimation;
let speed = 0;

const setfoodObj = () => {
  return ({
    x: Math.floor((Math.random() * 22)) * RECT,
    y: Math.floor((Math.random() * 22) + 1) * RECT
  });
};

let foodCords = setfoodObj();

snake[0] = {
  x: 12 * RECT,
  y: 12 * RECT
};

const setMessage = (message, distanseX) => {
  ctx.fillStyle = '#fff';
  ctx.font = '24px Roboto';
  ctx.fillText(message, RECT * distanseX, RECT / 1.3);
};

const setBackground = () => {
  for (let i = 0; i < RECT * 23; i += RECT) {
    if ((i / RECT) % 2 !== 0) backgroundColor.reverse();
    for(let k = 0; k < RECT * 22; k += RECT) {
      if (i === 0) ctx.fillStyle = 'black';
      else if ((k / RECT) % 2 === 0) ctx.fillStyle = backgroundColor[0];
      else ctx.fillStyle = backgroundColor[1];

      ctx.fillRect(k, i, RECT, RECT);
    }
    if ((i / RECT) % 2 !== 0) backgroundColor.reverse();
  }
};

const setDirection = event => {
  if (event.keyCode === 37 && direction !== 'right')
    direction = 'left';
  else if (event.keyCode === 38 && direction !== 'down')
    direction = 'up';
  else if (event.keyCode === 39 && direction !== 'left')
    direction = 'right';
  else if (event.keyCode === 40 && direction !== 'up')
    direction = 'down';
};

document.addEventListener('keydown', setDirection);

const eatSelf = (head, body) => {
  for (let i = 0; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y)  {
      cancelAnimationFrame(idAnimation);
      isEnd = true;
    }
  }
};

const gameLogic = () => {
  let scoreMsg = `Score - ${score}`;
 
  for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? 'black' : 'coral';
      ctx.fillRect(snake[i].x, snake[i].y, RECT, RECT);
      ctx.strokeRect(snake[i].x, snake[i].y, RECT, RECT);
  }

  setMessage(scoreMsg, 2);  //Score out

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (snakeX === foodCords.x && snakeY === foodCords.y) {
    foodCords = setfoodObj();
    score++;
  } else {
    snake.pop();
  }

  if (snakeX < 0) snakeX = RECT * 22;
  if (snakeX > RECT * 22) snakeX = -RECT;
  if (snakeY < RECT) snakeY = RECT * 23;
  if (snakeY > RECT * 24) snakeY = 0;

  if (direction === 'left') snakeX -= RECT;
  if (direction === 'right') snakeX += RECT;
  if (direction === 'up') snakeY -= RECT;
  if (direction === 'down') snakeY += RECT;

  let newHead = { x: snakeX, y: snakeY };

  eatSelf(newHead, snake);

  if (isEnd === true) {
    record = score;
  }

  let recordMsg = `Record - ${record}`;
  setMessage(recordMsg, 16); //Record out

  localStorage.setItem('record', record);

  snake.unshift(newHead);
};


const drawGame = () => {
  setBackground();
  ctx.drawImage(food, foodCords.x + RECT / 8, foodCords.y + RECT / 12, RECT / 1.2, RECT / 1.2);
  gameLogic();
};


// const playGame = setInterval(drawGame, 200);
const playGame = () => {
  idAnimation = requestAnimationFrame(playGame);
  if (speed % 8 === 0) {
    drawGame();
  }
  speed++;
};

idAnimation = requestAnimationFrame(playGame);
