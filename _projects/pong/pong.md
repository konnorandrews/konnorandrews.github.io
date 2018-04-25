---
layout: post
title:  "Pong (Beginner Tutorial)"
date:   2017-10-28
categories: javascript
custombodyjs:
 - /libraries/p5.js
 - /libraries/p5.dom.js
 - /javascript/p5DemoEnable.js
 - bounceSketch.js
 - paddleSketch.js
 - finishedGameSketch.js
---
This tutorial's code is written in JavaScript, and uses p5.js to draw to the screen.
If you are new to p5.js, visit [the p5.js website](https://p5js.org/) for more information.
You can also follow along using the [online p5.js editor](http://alpha.editor.p5js.org).

Welcome, in this tutorial we will be programming the classic game of [Pong](https://en.wikipedia.org/wiki/Pong).
Too start, we will need to create a new p5.js sketch.
```javascript
function setup() {
  createCanvas(400, 400)
}

function draw() {
  background(220)
}
```
An empty p5.js sketch contains a `setup()` and `draw()` function.
The `setup()` function will be executed when the game first loads.
Additionally, the `draw()` function will be executed at 30fps, and is where all the game logic will be.


## The Ball
The ball is very important in Pong.
So lets create an object to store the ball's position and speed.
```javascript
const ball = {
  xVelocity: 1,
  yVelocity: 1,
  x: 0,
  y: 0,
  radius: 10
}
```
Next, to draw the ball to the screen we can use the `rect(x, y, width, height)` function.
The `rect()` function draws a rectangle at the position `(x, y)` with a size of `width x height`.
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
Wrapping the `rect()` function in the `drawBall()` function increases the code's readability.
Additionally, if we wanted to draw multiple balls at the same time we won't need to copy the draw code again
(multi-ball Pong anyone?).
If you run the sketch, the ball will be drawn, but it doesn't move.
To make the ball move, we will need to change its position slowly over time.
By repeatedly adding the ball's velocity to its position, we can create the allusion of a smooth animation.
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
Every frame, the ball will be moved by the amount stored in its velocity.
Because the `draw()` function is executed at 30fps the human eye will see just one smooth motion.

Next, to stop the ball from leaving the screen, we can invert its velocity when it gets next to an edge.
Lets create an object `game` to store all the game's info.
We will give it the property `board` that contains the `width` and `height` of the screen.
```javascript
const game = {
  ball: {
    ...
  },
  board: {
    width: 400,
    height: 400
  }
}
```
Using our new `game` object, if the ball is past any of the screen's edges, we will set the ball's velocity to bring it back onto the screen.
We could just do `ball.yVelocity *= -1`, but that can cause the ball to get stuck in the wall.
Instead, using `ball.yVelocity = Math.abs(ball.yVelocity)` will guarantee that the ball can't get stuck.
```javascript
function bounceBallOffWalls(ball, board) {
  if (ball.y < 0)
    ball.yVelocity = Math.abs(ball.yVelocity)

  if (ball.y + ball.radius > board.height)
    ball.yVelocity = -Math.abs(ball.yVelocity)

  if (ball.x < 0)
    ball.xVelocity = Math.abs(ball.xVelocity)

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
Now we have a ball that bounces around the screen.
[Source Code](bounceSketch.js)
<div id="bounce_sketch_holder" style="display: flex; justify-content: center; align-items: center;"></div>

## The Paddles
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
  p.rect(
    board.width - paddleConfig.width - paddleConfig.wallOffset,
    paddle.y,
    paddleConfig.width,
    paddleConfig.height
  )
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

## Scoring
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
