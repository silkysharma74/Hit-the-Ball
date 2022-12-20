//////////////////////////////VARIABLES///////////////////////////////
let life = 5;
let score = 0;

let headerContainer = document.querySelector('.header-container');
let scoreLabel = document.querySelector('.score');
let livesLabel = document.querySelector('.lives');
let mainContainer = document.querySelector('.container');
let ball = document.querySelector('.ball');
let gameOver = document.querySelector('.game-over');
let startGame = document.querySelector('.start-game');
let endGame = document.querySelector('.finishing');
let paddle = document.querySelector('.paddle');
let bricksContainer = document.querySelector('.bricks-container');
//create bricks
for (let i = 0; i <= 59; i++) {
  let createBricks = document.createElement('div');
  createBricks.classList.add('bricks');
  bricksContainer.appendChild(createBricks);
}
let bricks = document.querySelectorAll('.bricks');
let volume = document.querySelector('.volume');
let breakSound = document.getElementById('break');
let applauseSound = document.getElementById('applause');
let loosingSound = document.getElementById('loosing');

let mainContainerW = mainContainer.offsetWidth;
let mainContainerH = mainContainer.offsetHeight;

let counter = 0;
let finishCounter = 0;
let timer = null;
let gameEnd = false;

let moveX = 2 * (Math.random() > 0.5 ? 1 : -1);
let moveY = -2;

let ballD = ball.offsetWidth;
let ballX = mainContainerW / 2;
let ballY = 562;

let paddleX = paddle.offsetLeft;
const paddleXDefault = paddle.offsetLeft;
let paddleY = paddle.offsetTop;
let paddleW = paddle.offsetWidth;
let paddleH = paddle.offsetHeight;

///////////////////////////////GAME START///////////////////////////////
const space = document.addEventListener('keyup', (e) => {
  if (e.code === 'Space' && counter === 0 && !gameEnd) {
    counter += 1;
    //remove instructions
    startGame.style.display = 'none';
    //change 5 bricks to kim
    changeBrickToKim();
    //change 5 bricks to boris
    changeBrickToBoris();
    //change 5 bricks to putin
    changeBrickToPutin();
    //change 5 bricks to xi
    changeBrickToXi();
    //change brick to donald
    changeBrickToDonald();
    //ball simulate speed
    timer = setInterval(ballSimulate, 750 / 100);
  }
});

///////////////////////////////SIMULATE BALL///////////////////////////////
const ballSimulate = () => {
  //ball movement
  ballX += moveX;
  ballY += moveY;
  //paddle collide
  paddleCollide();
  //bricks collide
  bricksCollide();
  //ball position
  ball.style.top = `${ballY}px`;
  ball.style.left = `${ballX}px`;
};

///////////////////////////////MAKE PADDLE MOVE///////////////////////////////
const positionPaddle = (e) => {
  //make paddle move right
  if (e.code == 'ArrowRight') {
    paddleX += 30;
    paddle.style.left = `${paddleX}px`;
    if (paddleX >= mainContainerW - paddleW) {
      paddleX -= 30;
    }
  }
  //make paddle move left
  if (e.code == 'ArrowLeft') {
    paddleX -= 30;
    paddle.style.left = `${paddleX}px`;
    if (paddleX <= 0) {
      paddleX += 30;
    }
  }
  //make ball move with paddle
  if (!space && counter === 0) {
    ballX = paddleX;
    ball.style.left = `${ballX + paddleW / 2 - 5}px`;
  }
};
document.onkeydown = positionPaddle;

///////////////////////////////PADDLE COLISSION FORMULA///////////////////////////////
const collidePaddle = (paddleX, paddleY, paddleW, paddleH) => {
  return (
    paddleX < ballX &&
    paddleX - ballD + paddleW > ballX &&
    paddleY - ballD < ballY &&
    paddleY - ballD / 2 + paddleH > ballY
  );
};

///////////////////////////////PADLE COLLIDE///////////////////////////////
const paddleCollide = () => {
  const collidepaddle = collidePaddle(paddleX, paddleY, paddleW, paddleH);
  if (ballX > mainContainerW - 25 || ballX <= 0) {
    moveX *= -1;
  }
  if (collidepaddle) {
    moveY = -1 * Math.abs(moveY);
  } else {
    looseLife();
  }
};

///////////////////////////////BRICK COLISSION FORMULA///////////////////////////////
const collideBrick = (brickX, brickY, brickW, brickH) => {
  const br = ballD / 2;
  const bx = ballX + br;
  const by = ballY + br;
  const blueHitBox = brickX - br < bx && brickX + br + brickW > bx;
  const redHitBox = brickY < by && brickY + brickH > by;

  if (ballY >= 0) {
    if (blueHitBox && brickY - br < by && brickY > by) {
      moveY = -1 * Math.abs(moveY);
      return true;
    } else if (
      blueHitBox &&
      brickY + brickH < by &&
      brickY + brickH + br > by
    ) {
      moveY = 1 * Math.abs(moveY);
      return true;
    } else if (redHitBox && bx > brickX - br && bx < brickX) {
      moveX = -1 * Math.abs(moveX);
      return true;
    } else if (redHitBox && bx > brickX + brickW && bx < brickX + brickW + br) {
      moveX = 1 * Math.abs(moveX);
      return true;
    }
  } else {
    moveY = 1 * Math.abs(moveY);
  }
};

///////////////////////////////BRICKS COLLIDE///////////////////////////////
const bricksCollide = () => {
  bricks.forEach((brick) => {
    if (brick.style.visibility === 'hidden') {
      return;
    }
    //invoke brick collision function
    const collidebrick = collideBrick(
      brick.offsetLeft,
      brick.offsetTop,
      brick.offsetWidth - 10,
      brick.offsetHeight
    );
    if (collidebrick) {
      //add collide sound
      toggleBreakSound();
      if (brick.style.color == 'gold') {
        score += 1000;
      } else if (brick.style.color == 'yellow') {
        score += 800;
      } else if (brick.style.color == 'green') {
        score += 500;
      } else if (brick.style.color == 'blue') {
        score += 300;
      } else if (brick.style.color == 'red') {
        score += 100;
      } else {
        score += 20;
      }
      //updates the score after hitting brick
      scoreLabel.textContent = `Score: ${score}`;
      //hides brick when hit
      brick.style.visibility = 'hidden';
      //game finish
      gameFinish();
    }
  });
};

///////////////////////////////LOSE LIFE///////////////////////////////
const looseLife = () => {
  if (ballY >= mainContainerH && life > 0) {
    life -= 1;
    counter = 0;
    livesLabel.textContent = `Lives: ${life}`;
    //play when loosing life
    toggleLoosingSound();
    ballReset();
    clearInterval(timer);
    //game over
    if (life === 0) {
      clearInterval(timer);
      gameEnd = true;
      gameOver.style.display = 'block';
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  }
};

///////////////////////////////RESET BALL POSITION///////////////////////////////
const ballReset = () => {
  ballX = 1000 / 2;
  ballY = 562;
  paddle.style.left = `${paddleXDefault}px`;
  paddleX = paddleXDefault;
  moveX = 2 * (Math.random() > 0.5 ? 1 : -1);
  moveY = -2;
};

///////////////////////////////GAME FINISHING///////////////////////////////
const gameFinish = () => {
  finishCounter = 0;
  bricks.forEach((b) => {
    if (b.style.visibility === 'hidden') {
      finishCounter++;
    }
  });
  if (finishCounter === bricks.length) {
    //reset ball position
    ballReset();
    //play applause
    toggleApplauseSound();
    //clear simulation
    clearInterval(timer);
    gameEnd = true;
    endGame.style.display = 'block';
    setTimeout(() => {
      location.reload();
    }, 5000);
  }
};

///////////////////////////////GAME VOLUME///////////////////////////////
volume.addEventListener('click', () => {
  volume.classList.toggle('fa-volume-up');
});
const toggleBreakSound = () => {
  if (volume.classList.contains('fa-volume-up')) {
    breakSound.play();
  } else {
    breakSound.pause();
  }
};
const toggleApplauseSound = () => {
  if (volume.classList.contains('fa-volume-up')) {
    applauseSound.play();
  } else {
    applauseSound.pause();
  }
};
const toggleLoosingSound = () => {
  if (volume.classList.contains('fa-volume-up')) {
    loosingSound.play();
  } else {
    loosingSound.pause();
  }
};

///////////////////////////////CHANGE BRICK COLOR TO RED///////////////////////////////
const changeBrickToKim = () => {
  const randomNum1 = Math.round(Math.random() * bricks.length);
  const randomNum2 = Math.round(Math.random() * bricks.length);
  const randomNum3 = Math.round(Math.random() * bricks.length);
  const randomNum4 = Math.round(Math.random() * bricks.length);
  const randomNum5 = Math.round(Math.random() * bricks.length);
  //adds 5 red brick after 5 seconds of life reset
  setTimeout(() => {
    bricks[randomNum1].style.backgroundImage = "url('./img/kim.jpg')";
    bricks[randomNum1].style.color = 'red';

    bricks[randomNum2].style.backgroundImage = "url('./img/kim.jpg')";
    bricks[randomNum2].style.color = 'red';

    bricks[randomNum3].style.backgroundImage = "url('./img/kim.jpg')";
    bricks[randomNum3].style.color = 'red';

    bricks[randomNum4].style.backgroundImage = "url('./img/kim.jpg')";
    bricks[randomNum4].style.color = 'red';

    bricks[randomNum5].style.backgroundImage = "url('./img/kim.jpg')";
    bricks[randomNum5].style.color = 'red';
  }, 2000);
};

///////////////////////////////CHANGE BRICK COLOR TO BLUE///////////////////////////////
const changeBrickToBoris = () => {
  const randomNum1 = Math.round(Math.random() * bricks.length);
  const randomNum2 = Math.round(Math.random() * bricks.length);
  const randomNum3 = Math.round(Math.random() * bricks.length);
  const randomNum4 = Math.round(Math.random() * bricks.length);
  //adds 5 red brick after 5 seconds of life reset
  setTimeout(() => {
    bricks[randomNum1].style.backgroundImage = "url('./img/boris.jpg')";
    bricks[randomNum1].style.color = 'blue';

    bricks[randomNum2].style.backgroundImage = "url('./img/boris.jpg')";
    bricks[randomNum2].style.color = 'blue';

    bricks[randomNum3].style.backgroundImage = "url('./img/boris.jpg')";
    bricks[randomNum3].style.color = 'blue';

    bricks[randomNum4].style.backgroundImage = "url('./img/boris.jpg')";
    bricks[randomNum4].style.color = 'blue';
  }, 4000);
};

///////////////////////////////CHANGE BRICK COLOR TO GREEN///////////////////////////////
const changeBrickToPutin = () => {
  const randomNum1 = Math.round(Math.random() * bricks.length);
  const randomNum2 = Math.round(Math.random() * bricks.length);
  const randomNum3 = Math.round(Math.random() * bricks.length);
  //adds 5 red brick after 5 seconds of life reset
  setTimeout(() => {
    bricks[randomNum1].style.backgroundImage = "url('./img/putin.jpg')";
    bricks[randomNum1].style.color = 'green';

    bricks[randomNum2].style.backgroundImage = "url('./img/putin.jpg')";
    bricks[randomNum2].style.color = 'green';

    bricks[randomNum3].style.backgroundImage = "url('./img/putin.jpg')";
    bricks[randomNum3].style.color = 'green';
  }, 6000);
};

///////////////////////////////CHANGE BRICK COLOR TO YELLOW///////////////////////////////
const changeBrickToXi = () => {
  const randomNum1 = Math.round(Math.random() * bricks.length);
  const randomNum2 = Math.round(Math.random() * bricks.length);
  //adds 5 red brick after 5 seconds of life reset
  setTimeout(() => {
    bricks[randomNum1].style.backgroundImage = "url('./img/xi.jpg')";
    bricks[randomNum1].style.color = 'yellow';

    bricks[randomNum2].style.backgroundImage = "url('./img/xi.jpg')";
    bricks[randomNum2].style.color = 'yellow';
  }, 8000);
};

///////////////////////////////CHANGE BRICK COLOR TO GOLD///////////////////////////////
const changeBrickToDonald = () => {
  const randomNum1 = Math.round(Math.random() * bricks.length);
  //adds 1 gold brick after 10 seconds of life reset
  setTimeout(() => {
    bricks[randomNum1].style.backgroundImage = "url('./img/donald.jpg')";
    bricks[randomNum1].style.color = 'gold';
  }, 10000);
};
