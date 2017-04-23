var columns = 8, rows = 8, pixelSize = 20, gapWidth = 5, disBetweenGrids = 20;
var dct_grid = [], image_grid = [], inverse_grid = [], error_grid = [];

function setup() {
  createCanvas((columns * (pixelSize + gapWidth) * 2) - gapWidth + disBetweenGrids, (rows * (pixelSize + gapWidth) * 2) - gapWidth + disBetweenGrids);
  
  createGrid(dct_grid);
  createGrid(image_grid);
  createGrid(inverse_grid);
  createGrid(error_grid);
}

function createGrid(grid){
  for(var i = 0; i < rows; i++){
    var row = [];
    for(var j = 0; j < columns; j++){
      row.push({painting:false, value:0, color:color(250)});
    }
    grid.push(row);
  }
}

function draw() {
  background(200, 200, 250);
  
  
  
  for(var v = 0; v < rows; v++){
    for(var u = 0; u < columns; u++){
      
      var cu = (u === 0 ? 1/sqrt(2) : 1);
      var cv = (v === 0 ? 1/sqrt(2) : 1);
      
      var sum = 0;
      for(var i = 0; i < rows; i++){
        var innerSum = 0;
        for(var j = 0; j < columns; j++){
          var cos_y = cos(v * PI * ((2*i+1)/(2*rows)));
          var cos_x = cos(u * PI * ((2*j+1)/(2*columns)));
          innerSum += (red(image_grid[i][j].color) - 128) * cos_y * cos_x;
        }
        sum += innerSum;
      }
      
      var dct_value = 1/4 * cv * cu * sum;
      dct_grid[v][u].value = dct_value;
      dct_grid[v][u].color = color(map(dct_value, -100, 100, 0, 250));
    }
  }
  
  var subSample = 2;
  var startX = 0, endX = 8, startY = 0, endY = 8;
  
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < columns; j++){
      var sum = 0;
      for(var v = startY; v < endY; v++){
        var innerSum = 0;
        for(var u = startX; u < endX; u++){
          var cu = (u === 0 ? 1/sqrt(2) : 1);
          var cv = (v === 0 ? 1/sqrt(2) : 1);
          
          var cos_y = cos(v * PI * ((2*i+1)/(2*rows)));
          var cos_x = cos(u * PI * ((2*j+1)/(2*columns)));
          innerSum += cu * cv * dct_grid[v][u].value * cos_y * cos_x;
        }
        sum += innerSum;
      }
      
      var dct_value = 1/4 * sum;
      inverse_grid[i][j].color = color(dct_value + 128);
      if(i === 0 && j === 0){
        //console.log(dct_value);
      }
    }
  }
  
  var max_error = 0, min_error = 255;
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < columns; j++){
      var error = (red(image_grid[i][j].color) - red(inverse_grid[i][j].color));
      if(error < min_error) {
        min_error = error;
      }
      if(error > max_error){
        max_error = error;
      }
      error_grid[i][j].color = color(error);
    }
  }
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < columns; j++){
      error_grid[i][j].color = color(map(red(error_grid[i][j].color), min_error, max_error, 0, 255));
    }
  }
  
  drawGrid(0, 0, dct_grid);
  
  var xOffset = (pixelSize + gapWidth) * columns + disBetweenGrids;
  drawGrid(xOffset, 0, image_grid);
  
  var yOffset = (pixelSize + gapWidth) * columns + disBetweenGrids;
  drawGrid(xOffset, yOffset, inverse_grid);
  
  drawGrid(0, yOffset, error_grid);
}

function drawGrid(xOffset, yOffset, grid){
  var pixelArea = pixelSize + gapWidth;
  
  var mouseColumn = floor((mouseX - xOffset) / pixelArea);
  var mouseRow = floor((mouseY - yOffset) / pixelArea);
  
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < columns; j++){
      if(!mouseIsPressed && grid[i][j].painting){
        grid[i][j].color = color(red(grid[i][j].color) - 50);
        //grid[i][j].value = grid[i][j].value + 50;
        grid[i][j].painting = false;
      }
      if(grid[i][j].painting){
        fill(0, 200, 0);
      }else{
        fill(grid[i][j].color);
      }
      if(i === mouseRow && j === mouseColumn){
        //grid[i][j].value = 700;
        if(mouseIsPressed){
          grid[i][j].painting = true;
        }
        stroke(200, 0, 0);
        strokeWeight(3);
      }else{
        //grid[i][j].value = 0;
        noStroke();
      }
      rect(xOffset + pixelArea * j, yOffset + pixelArea * i, pixelSize, pixelSize);
    }
  }
}