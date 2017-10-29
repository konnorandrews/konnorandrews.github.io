---
layout: post
title:  "Pong (Beginner Tutorial)"
date:   2017-10-28
categories: javascript
customjs:
 - /libraries/p5.js
 - /libraries/p5.dom.js
 - /javascript/p5DemoEnable.js
 - bounceSketch.js
 - paddleSketch.js
 - finishedGameSketch.js
---

Pong project

Starting with basic p5.js sketch.
```javascript
function setup() {
  createCanvas(400, 400)
}

function draw() {
  background(220)
}
```

Adding ball object.
```javascript
const ball = {
  xVelocity: 1,
  yVelocity: 1,
  x: 0,
  y: 0,
  radius: 10
}
```

Draw ball.
```javascript
function drawBall(ball) {
  rect(ball.x, ball.y, ball.radius, ball.radius)
}
...
function draw() {
  background(220)
  drawBall(ball)
}
```

Move ball.
```javascript
function moveBall(ball) {
  ball.x += ball.xVelocity
  ball.y += ball.yVelocity
}
...
function draw() {
  background(220)
  moveBall(ball)
  drawBall(ball)
}
```

Talk about need for place to store board properties for use later. Creates game object.
```javascript
const game = {
  ball: {
    xVelocity: 1,
    yVelocity: 5,
    x: 0,
    y: 0,
    radius: 10
  },
  board: {
    width: 400,
    height: 400
  }
}
```

Collide with walls.
```javascript
function bounceBallOffWalls(ball, board) {
  if (ball.y < 0)
    ball.yVelocity *= -1

  if (ball.y + ball.radius > board.height)
    ball.yVelocity = -Math.abs(ball.yVelocity)

  if (ball.x < 0)
    ball.xVelocity *= -1

  if (ball.x + ball.radius > board.width)
    ball.xVelocity = -Math.abs(ball.xVelocity)
}
...
function draw() {
  ...
  bounceBallOffWalls(game.ball, game.board)
  ...
}
```

[Bounce Sketch](bounceSketch.js)
<div id="bounce_sketch_holder" style="display: flex; justify-content: center; align-items: center;"></div>

Add paddle object to game, and player objects with y for each player's paddle.
```javascript
const game = {
  ...
  paddleConfig: {
    height: 100,
    width: 20,
    wallOffset: 20
  },
  leftPlayer: {
    paddle: { y: 0 }
  },
  rightPlayer: {
    paddle: { y: 0 }
  }
}
```

Add paddle drawing functions.
```javascript
function drawLeftPaddle(paddleConfig, paddle){
  p.rect(paddleConfig.wallOffset, paddle.y, paddleConfig.width, paddleConfig.height)
}

function drawRightPaddle(paddleConfig, paddle, board){
  p.rect(board.width - paddleConfig.width - paddleConfig.wallOffset, paddle.y, paddleConfig.width, paddleConfig.height)
}
...
function draw() {
  ...
  drawLeftPaddle(game.paddleConfig, game.leftPlayer.paddle, game.board)
  drawRightPaddle(game.paddleConfig, game.rightPlayer.paddle, game.board)
}
```

Move paddles using keyboard. w,s and p,l using keycode.info
```javascript
...
  leftPlayer: {
    paddle: { y: 0 },
    buttons: {
      up: 87, // w
      down: 83 // s
    }
  },
  rightPlayer: {
    paddle: { y: 0 },
    buttons: {
      up: 80, // p
      down: 76 // l
    }
  }
...
function movePaddle(paddle, buttons){
  if(p.keyIsDown(buttons.up))
    paddle.y -= 10

  if(p.keyIsDown(buttons.down))
    paddle.y += 10
}
...
function draw() {
  ...
  movePaddle(game.leftPlayer.paddle, game.leftPlayer.buttons)
  movePaddle(game.rightPlayer.paddle, game.rightPlayer.buttons)
  ...
}
```

make paddles collide with bottom and top.
```javascript
function keepPaddleOnBoard(paddleConfig, paddle, board){
  if(paddle.y < 0)
    paddle.y = 0

  if(paddle.y + paddleConfig.height > board.height)
    paddle.y = board.height - paddleConfig.height
}
...
function draw() {
  ...
  keepPaddleOnBoard(game.paddleConfig, game.leftPlayer.paddle, game.board)
  keepPaddleOnBoard(game.paddleConfig, game.rightPlayer.paddle, game.board)
  ...
}
```

[Paddle Sketch](paddleSketch.js)
<div id="paddle_sketch_holder" style="display: flex; justify-content: center; align-items: center;"></div>


Make ball bounce off the paddles
```javascript
function keepPaddleOnBoard(paddleConfig, paddle, board){
  if(paddle.y < 0)
    paddle.y = 0

  if(paddle.y + paddleConfig.height > board.height)
    paddle.y = board.height - paddleConfig.height
}
...
function draw() {
  ...
  keepPaddleOnBoard(game.paddleConfig, game.leftPlayer.paddle, game.board)
  keepPaddleOnBoard(game.paddleConfig, game.rightPlayer.paddle, game.board)
  ...
}
```

Add scoring to player objects
```javascript
...
leftPlayer: {
  ...
  score: 0
},
rightPlayer: {
  ...
  score: 0
}
...
```

removing bounce on left right walls, and adding scoring
```javascript
...
function bounceBallOffWalls(ball, board, leftPlayer, rightPlayer) {
  ...
  if (ball.x < 0){
    rightPlayer.score++
    resetBall(ball, board)
  }

  if (ball.x + ball.radius > board.width){
    leftPlayer.score++
    resetBall(ball, board)
  }
}
...
function resetBall(ball, board, goLeft){
  ball.x = board.width / 2 - ball.radius / 2
  ball.y = board.height / 2 - ball.radius / 2
  ball.xVelocity = (goLeft ? -3 : 3 )
  ball.yVelocity = 5
}
...
function draw(){
  ...
  bounceBallOffWalls(game.ball, game.board, game.leftPlayer, game.rightPlayer)
  ...
}
```

draw text for scoring
```javascript
...
function drawScores(leftPlayer, rightPlayer, board){
  p.textSize(32)
  p.text(leftPlayer.score, 50, 40)
  p.text(rightPlayer.score, board.width - 70, 40)
}
...
function draw(){
  ...
  drawScores(game.leftPlayer, game.rightPlayer, game.board)
}
```

[Finished Game Sketch](finishedGameSketch.js)
<div id="finishedGame_sketch_holder" style="display: flex; justify-content: center; align-items: center;"></div>

## Styled Game
[Pong Demo]() *Coming soon*
