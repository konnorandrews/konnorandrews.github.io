stoppable(function(onStop){
  
var sketch = function( p ) {

  onStop.then(function(){
    p.noLoop();
  })

var cWidth = 700, cHeight = 700;
var cOffsetX = 0, cOffsetY = 0;
var cubeXnum = 30, cubeX = cWidth / cubeXnum;
var cubeYnum = 30, cubeY = cHeight / cubeYnum;
var cubes = [];

var start = {x: 2, y: 2};
var end = {x: 8, y: 8};
var nPattern = [{x: -1, y: 0, cost:1},
                {x: 1, y: 0, cost:1},
                {x: 0, y: -1, cost:1},
                {x: 0, y: 1, cost:1}];/*,

                {x: -1, y: -1, cost:1},
                {x: 1, y: 1, cost:1},
                {x: 1, y: -1, cost:1},
                {x: -1, y: 1, cost:1}];*/

p.setup = function() {
  var canvas = p.createCanvas(cWidth, cHeight);

  //canvas.parent('sketch-holder');

  for(var i = 0; i < cubeYnum; i++) {
    var rowCubes = [];
    for(var j = 0; j < cubeXnum; j++){
      rowCubes.push(false); // f_cost = g_cost + h_cost
    }
    cubes.push(rowCubes);
  }
}

p.draw = function() {
  p.background(220)
  if(isDemoEnabled(p, 'sketch')){
  //reset
  for(var i = 0; i < cubeYnum; i++) {
    for(var j = 0; j < cubeXnum; j++){
      if(cubes[i][j].state !== 1){
        cubes[i][j] = {x: j, y: i, g_cost: 0, h_cost: 0, state:0, last:-1, isTurn:false}; // f_cost = g_cost + h_cost
      }
    }
  }

  // add any new bricks
  if(p.mouseIsPressed){
    var x = p.floor(p.mouseX / cubeX);
    var y = p.floor(p.mouseY / cubeY);
    //console.log('X: ' + x + ' Y: ' + y);
    if(x >= 0 && x < cubeXnum && y >= 0 && y < cubeYnum){
      cubes[y][x].state = 1;
      //cubes[y + 1][x].state = 1;
      //cubes[y - 1][x].state = 1;
      //cubes[y][x + 1].state = 1;
      //cubes[y][x - 1].state = 1;
    }
  }else{
    end.x = p.floor(p.mouseX / cubeX);
    end.y = p.floor(p.mouseY / cubeY);
  }

  //run A*
  var open = [], closed = [];
  open.push(cubes[start.y][start.x]);
  var pathDone = false;
  var dir = 0; // 0 - right, 1 - left, 2 - down, 3 - up
  while(!pathDone){
    var current = open.splice(getLowestFcost(open), 1)[0];
    if(current === undefined){
      break;
    }
    var last = closed[current.last];
    if(last !== undefined){
      if(current.x < last.x){
        dir = 1;
      } else if(current.x > last.x){
        dir = 0;
      } else if(current.y < last.y){
        dir = 3;
      }else{
        dir = 2;
      }
    }
    var f_cost = current.g_cost + current.h_cost;
    closed.push(current);

    if(current.x === end.x && current.y === end.y){
      pathDone = true;
      break;
    }

    for(var i = 0; i < nPattern.length; i++){
      var nX = current.x + nPattern[i].x;
      var nY = current.y + nPattern[i].y;
      var extraCost = 0;

      var scall = 1;
      if(dir === 0 && nPattern[i].x < 0){
        extraCost = scall * 2;
      } else if(dir === 0 && nPattern[i].y !== 0){
        extraCost = scall;
      } else if(dir === 1 && nPattern[i].x > 0){
        extraCost = scall * 2;
      } else if(dir === 1 && nPattern[i].y !== 0){
        extraCost = scall;
      } else if(dir === 2 && nPattern[i].y < 0){
        extraCost = scall * 2;
      } else if(dir === 2 && nPattern[i].x !== 0){
        extraCost = scall;
      } else if(dir === 3 && nPattern[i].y > 0){
        extraCost = scall * 2;
      } else if(dir === 3 && nPattern[i].x !== 0){
        extraCost = scall;
      }

      extraCost = 0;

      if(nX >= 0 && nX < cubeXnum && nY >= 0 && nY < cubeYnum){
        var neighbour = cubes[nY][nX];
        if(neighbour.state !== 1 && !isInList(closed, neighbour)){
          if(f_cost + nPattern[i].cost + extraCost < neighbour.g_cost + neighbour.h_cost ||
              !isInList(open, neighbour)){
            neighbour.g_cost = current.g_cost + nPattern[i].cost + extraCost;

            var xdis = p.abs(neighbour.x - end.x);
            var ydis = p.abs(neighbour.y - end.y);
            var minDir = p.min(xdis, ydis);
            var maxDir = p.max(xdis, ydis);

            neighbour.isTurn = extraCost !== 0;

            //neighbour.h_cost = xdis * 1 + ydis * 1//(maxDir - minDir) * 10 + minDir * 14;
            neighbour.last = closed.length - 1;
            if(!isInList(open, neighbour)){
              open.push(neighbour);
            }
          }
        }
      }
    }
  }

  if(pathDone){
    var doneRetrace = false;
    var current = closed[closed.length - 1];
    while(!doneRetrace){
      if(current.last === -1){
        doneRetrace = true;
        cubes[closed[0].y][closed[0].x].state = 3;
      }
      else{
        var next = closed[current.last];
        if(current.isTurn){
          cubes[next.y][next.x].state = 4;
        }else{
          cubes[next.y][next.x].state = 2;
        }
        current = next;
      }
    }
    cubes[closed[closed.length - 1].y][closed[closed.length - 1].x].state = 3;
    console.log('Moves to target: ' + cubes[closed[closed.length - 1].y][closed[closed.length - 1].x].g_cost);
  } else {
    console.log('Impossible to get to target');
  }


  //draw nodes
    for(var i = 0; i < cubeYnum; i++){
      for(var j = 0; j < cubeXnum; j++){
        drawNode(j * cubeX, i * cubeY, cubeX - cOffsetX, cubeY - cOffsetY, cubes[i][j]);
      }
    }
  }
}

function isInList(list, node){
  var found = false;
  for(var i = 0; i < list.length; i++){
    if(list[i].x === node.x && list[i].y === node.y){
      found = true;
      break;
    }
  }
  return found;
}

function getLowestFcost(open){
  var loc = -1;
  for(var i = 0; i < open.length; i++){
    if(loc === -1 || open[loc].g_cost + open[loc].h_cost > open[i].g_cost + open[i].h_cost){
      //console.log('loc: ' + loc);
      loc = i;
    }
  }
  return loc;
}

// state: 0 - default, 1 - black, 2 - green, 3 - red
function drawNode(x_, y_, width_, height_, node_){
  var g_cost = node_.g_cost, h_cost = node_.h_cost;
  var f_cost = g_cost + h_cost;

  if(node_.state === 2){
    p.fill(100, 250, 100);
  } else if(node_.state === 3){
    p.fill(250, 100, 100);
  } else if(node_.state === 1){
    p.fill(100, 100, 250);
  }  else if(node_.state === 4){
    p.fill(200, 200, 100);
  }else{
    p.fill(250);
  }
  p.noStroke();
  p.rect(x_, y_, width_, height_);

  p.fill(0);
  p.textSize(16);
  p.textAlign(p.CENTER);
  //text(f_cost, x_ + width_ / 2, y_ + 3 * height_ / 4);

  p.fill(0);
  p.textSize(10);
  p.textAlign(p.LEFT);
  //text(g_cost, x_ + 10, y_ + height_ / 4);

  p.fill(0);
  p.textSize(10);
  p.textAlign(p.RIGHT);
  //text(h_cost, x_ + width_ - 10, y_ + height_ / 4);
}
}

function startDemo(){
  new p5(sketch, 'sketch-holder')
}

if (document.readyState === "complete") {
  console.log('window loaded')
  startDemo();
}else{
  console.log('window not loaded')
  window.addEventListener("load", startDemo);
}

});
