var bounceSketch = function( p ) {

const game = {
  ball: {
    xVelocity: 3,
    yVelocity: 5,
    x: 0,
    y: 0,
    radius: 50
  },
  board: {
    width: 400,
    height: 400
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

p.setup = function() {
  p.createCanvas(game.board.width, game.board.height)
}

p.draw = function() {
  p.background(220)
  if(isDemoEnabled(p, 'bounceDemo')){
    moveBall(game.ball)
    bounceBallOffWalls(game.ball, game.board)
    drawBall(game.ball)
  }
}

}

window.addEventListener('load', function () {
  new p5(bounceSketch, 'bounce_sketch_holder')
})
