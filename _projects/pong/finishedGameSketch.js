var finishedGameSketch = function( p ) {

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
    },
    score: 0
  },
  rightPlayer: {
    paddle: { y: 0 },
    buttons: {
      up: 80, // p
      down: 76 // l
    },
    score: 0
  }
}

function drawBall(ball) {
  p.rect(ball.x, ball.y, ball.radius, ball.radius)
}

function moveBall(ball) {
  ball.x += ball.xVelocity
  ball.y += ball.yVelocity
}

function bounceBallOffWalls(ball, board, leftPlayer, rightPlayer) {
  if (ball.y < 0)
    ball.yVelocity = Math.abs(ball.yVelocity)

  if (ball.y + ball.radius > board.height)
    ball.yVelocity = -Math.abs(ball.yVelocity)

  if (ball.x < 0){
    rightPlayer.score++
    resetBall(ball, board, false)
  }

  if (ball.x + ball.radius > board.width){
    leftPlayer.score++
    resetBall(ball, board, true)
  }
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

function bounceBallOffLeftPaddle(paddleConfig, paddle, ball){
  if(ball.y < paddle.y + paddleConfig.height &&
      ball.y + ball.radius > paddle.y &&
      ball.x < paddleConfig.wallOffset + paddleConfig.width){
    ball.xVelocity = Math.abs(ball.xVelocity)
  }
}

function bounceBallOffRightPaddle(paddleConfig, paddle, ball, board){
  if(ball.y < paddle.y + paddleConfig.height &&
      ball.y + ball.radius > paddle.y &&
      ball.x + ball.radius > board.width - paddleConfig.wallOffset - paddleConfig.width){
    ball.xVelocity = -Math.abs(ball.xVelocity)
  }
}

function resetBall(ball, board, goLeft){
  ball.x = board.width / 2 - ball.radius / 2
  ball.y = board.height / 2 - ball.radius / 2
  ball.xVelocity = (goLeft ? -3 : 3 )
  ball.yVelocity = 5
}

function drawScores(leftPlayer, rightPlayer, board){
  p.textSize(32)
  p.text(leftPlayer.score, 50, 40)
  p.text(rightPlayer.score, board.width - 70, 40)
}

p.setup = function() {
  p.createCanvas(game.board.width, game.board.height)
  resetBall(game.ball, game.board, true)
}

p.draw = function() {
  p.background(220)
  if(isDemoEnabled(p, 'finishedGameDemo')){
    movePaddle(game.leftPlayer.paddle, game.leftPlayer.buttons)
    movePaddle(game.rightPlayer.paddle, game.rightPlayer.buttons)
    keepPaddleOnBoard(game.paddleConfig, game.leftPlayer.paddle, game.board)
    keepPaddleOnBoard(game.paddleConfig, game.rightPlayer.paddle, game.board)
    moveBall(game.ball)
    bounceBallOffLeftPaddle(game.paddleConfig, game.leftPlayer.paddle, game.ball)
    bounceBallOffRightPaddle(game.paddleConfig, game.rightPlayer.paddle, game.ball, game.board)
    bounceBallOffWalls(game.ball, game.board, game.leftPlayer, game.rightPlayer)
    drawBall(game.ball)
    drawLeftPaddle(game.paddleConfig, game.leftPlayer.paddle, game.board)
    drawRightPaddle(game.paddleConfig, game.rightPlayer.paddle, game.board)
    drawScores(game.leftPlayer, game.rightPlayer, game.board)
  }
}

}

window.addEventListener('load', function () {
  new p5(finishedGameSketch, 'finishedGame_sketch_holder')
})
