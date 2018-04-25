stoppable(function(onStop){

var paddleSketch = function( p ) {

onStop.then(function(){
  p.noLoop();
})

const game = {
  ball: {
    xVelocity: 3,
    yVelocity: 5,
    x: 0,
    y: 0,
    radius: 30
  },
  board: {
    width: 400,
    height: 400
  },
  paddleConfig: {
    height: 100,
    width: 20,
    wallOffset: 20
  },
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
}

function drawBall(ball) {
  p.rect(ball.x, ball.y, ball.radius, ball.radius)
}

function moveBall(ball) {
  ball.x += ball.xVelocity
  ball.y += ball.yVelocity
}

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

function drawLeftPaddle(paddleConfig, paddle){
  p.rect(paddleConfig.wallOffset, paddle.y, paddleConfig.width, paddleConfig.height)
}

function drawRightPaddle(paddleConfig, paddle, board){
  p.rect(board.width - paddleConfig.width - paddleConfig.wallOffset, paddle.y, paddleConfig.width, paddleConfig.height)
}

function movePaddle(paddle, buttons){
  if(p.keyIsDown(buttons.up))
    paddle.y -= 10

  if(p.keyIsDown(buttons.down))
    paddle.y += 10
}

function keepPaddleOnBoard(paddleConfig, paddle, board){
  if(paddle.y < 0)
    paddle.y = 0

  if(paddle.y + paddleConfig.height > board.height)
    paddle.y = board.height - paddleConfig.height
}

p.setup = function() {
  p.createCanvas(game.board.width, game.board.height)
}

p.draw = function() {
  p.background(220)
  if(isDemoEnabled(p, 'paddleDemo')){
    moveBall(game.ball)
    bounceBallOffWalls(game.ball, game.board)
    drawBall(game.ball)
    movePaddle(game.leftPlayer.paddle, game.leftPlayer.buttons)
    movePaddle(game.rightPlayer.paddle, game.rightPlayer.buttons)
    keepPaddleOnBoard(game.paddleConfig, game.leftPlayer.paddle, game.board)
    keepPaddleOnBoard(game.paddleConfig, game.rightPlayer.paddle, game.board)
    drawLeftPaddle(game.paddleConfig, game.leftPlayer.paddle, game.board)
    drawRightPaddle(game.paddleConfig, game.rightPlayer.paddle, game.board)
  }
}

}

window.addEventListener('load', function () {
  new p5(paddleSketch, 'paddle_sketch_holder')
})

})
