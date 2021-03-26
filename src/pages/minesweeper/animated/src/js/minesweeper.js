import SquareObj from "./SquareObj.js";
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext('2d');

let squares = [];
let isGameOver = false;
let flags = 0;
let bombAmount = 0;
let fontSize = "";
let width = 0;
let numSquares = 0;
let flagAnimationDone = false;

let drawFlagPart = true;
let drawBase = true;
let flagMaxY = 0;
let poleRect = null;
let poleXCoordinate = 0;
let poleYCoordinate = 0;
let poleSize = 0;
let baseDimensions = [];
let baseStartCoordinates = [];
let flagDimensions = [];
let circleDimensions = 0;

async function createBoard(){
  var shuffledGameArray;
  var difficultyString;
  var height;
  var numBombs;

  await clearGameBoard();
  var difficulty = document.getElementById("difficultySelector");
  var value = difficulty.options[difficulty.selectedIndex].value;


  if (value === "easy" || value === "default"){
    difficultyString = "easy";
    width = 10;
    height = 8;
    numBombs = 10;
    fontSize = "40px";
    canvas.width = "450";
    canvas.height = "360";

    poleXCoordinate = 9;
    poleYCoordinate = 35;
    poleSize = 7;
    baseDimensions = [14, 7];
    baseStartCoordinates = [5.45, 35];
    flagDimensions = [9, 3.9, 37, 16, 28.1, 13.9];
    flagMaxY = 6;
    circleDimensions = 11;
  }else if(value === "medium"){
    difficultyString = "medium";
    width = 18;
    height = 14;
    numBombs = 40;
    fontSize = "25px";
    canvas.width = "540";
    canvas.height = "420";

    poleXCoordinate = 7;
    poleYCoordinate = 22;
    poleSize = 5;
    baseDimensions = [10, 5];
    baseStartCoordinates = [4.45, 22];
    flagDimensions = [7, 3.9, 25, 12, 16.1, 7.9];
    flagMaxY = 6;
    circleDimensions = 9;
  }else if(value === "hard"){
    difficultyString = "difficult";
    height = 20;
    width = 24;
    numBombs = 99;
    fontSize = "19px";
    canvas.width = "600";
    canvas.height = "500";

    poleXCoordinate = 6;
    poleYCoordinate = 18;
    poleSize = 5;
    baseDimensions = [10, 5];
    baseStartCoordinates = [3.45, 18];
    flagDimensions = [6, 3.9, 22, 10, 14.1, 7.9];
    flagMaxY = 6;
    circleDimensions = 7;
  }

  bombAmount = numBombs;
  flags = numBombs;
  numSquares = width * height;
  var returnedVal = await placeMines(numBombs, width*height);
  var shuffledGameArray = returnedVal[0];
  var squareDimensions = parseFloat(canvas.width) / width;
  for (var i = 0; i < width*height; i++){
    let row = Math.floor(i / width) + 1;
    let column = (i % width) + 1;
    var squareAttributeList = [];
    squareAttributeList.push([squareDimensions*column - squareDimensions, squareDimensions*row - squareDimensions]);
    squareAttributeList.push([squareDimensions*column, squareDimensions*row - squareDimensions]);
    squareAttributeList.push([squareDimensions*column, squareDimensions*row]);
    squareAttributeList.push([squareDimensions*column - squareDimensions, squareDimensions*row]);
    
    squareAttributeList.push(i);
    squareAttributeList.push(shuffledGameArray[i]);
    if ((row + column) % 2 == 0) {
      squareAttributeList.push("rgb(49, 47, 47)");
      squareAttributeList.push("#998263");
    } else {
      squareAttributeList.push("rgb(73, 70, 70)");
      squareAttributeList.push("tan");
    }

    var square = new SquareObj(squareAttributeList[0], squareAttributeList[1], squareAttributeList[2], squareAttributeList[3], squareAttributeList[4], squareAttributeList[5], squareAttributeList[6], squareAttributeList[7], null, null, null)
    //console.log(square);
    ctx.fillStyle = square.greyColor;
    
    ctx.fillRect(square.topLeftVertex[0], square.topLeftVertex[1], squareDimensions, squareDimensions);
    squares.push(square);
  }
  assignNumbers();
  canvas.className = "game-board-" + difficultyString;
  document.getElementById("ms-header").style = "width: "+ canvas.width + "px; height: 60px;";
  document.getElementById("flagsLeft").innerHTML = flags;
  document.getElementById("looseModal").style = "width: " + canvas.width + "px; height: " + (parseInt(canvas.height) + 60) + "px;";
  document.getElementById("winModal").style = "width: " + canvas.width + "px; height: " + (parseInt(canvas.height) + 60) + "px;";
  
}


//working on currently
function openGameLostModal(){
  var modal = document.getElementById("looseModal");
  var newGameBtn = document.getElementById("newGameOnLooseButton");
  modal.style.display = "block";

  newGameBtn.onclick = function(e) {
    e.preventDefault();

    modal.style.display = "none";
    isGameOver = false;
    createBoard();
  }
}

function openGameWonModal(){
  var modal = document.getElementById("winModal");
  var newGameBtn = document.getElementById("newGameOnWinButton");
  modal.style.display = "block";

  newGameBtn.onclick = function(e) {
    e.preventDefault();

    modal.style.display = "none";
    isGameOver = false;
    createBoard();
  }
}

function checkForWin(){
  let matches = 0
  let bombs = bombAmount;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i].isFlagged && squares[i].squareType === 'mine') {
      matches++;
    }
    if (matches === bombs) {
      openGameWonModal();
      isGameOver = true
    }
  }
}

function gameOver(){
  isGameOver = true;

  squares.forEach(elem => {
    if(elem.squareType === 'mine'){
      if(elem.isFlagged){
        ctx.fillStyle = elem.greyColor;
        ctx.fillRect(elem.topLeftVertex[0], elem.topLeftVertex[1], canvas.width / width, canvas.width / width);
        var v_canvas = createVCanvas(canvas.width, canvas.height);
        v_canvas.className = "vCanvas";
        document.getElementById("canvas-container").appendChild(v_canvas);
        var v_ctx = v_canvas.getContext('2d');
        elem.isFlagged = false;
        v_ctx.clearRect(elem.topLeftVertex[0], elem.topLeftVertex[1], v_canvas.width / width, v_canvas.width / width);
        var i = 0;
        var z = 1;
        drawRotatingFlagRunner(v_ctx, elem, i, z);
        flags++;
        document.getElementById("flagsLeft").innerHTML = flags;
      }

      drawMine(ctx, mineColorGenerator(), elem.topLeftVertex[0], elem.topLeftVertex[1], elem.topRightVertex[0] - elem.topLeftVertex[0], elem.bottomRightVertex[1] - elem.topRightVertex[1]);
    }
  });
  setTimeout(() => {
    openGameLostModal();
  }, 1000);
}

//completed animations
function drawMine(context, color, x, y, width, height) {
  context.beginPath();

  context.fillStyle = color[0];
  context.rect(x, y, width, height);
  context.closePath();
  context.fill();

  context.beginPath();
  context.fillStyle = color[1];
  context.arc(x+width/2, y+height/2, circleDimensions, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}


function drawRotatingFlag(context, square, color, degrees, z){
  var x = square.topLeftVertex[0] + flagDimensions[0];
  var y = square.topLeftVertex[1] + flagDimensions[1];
  var width = flagDimensions[2] - flagDimensions[0];
  var height = baseStartCoordinates[1] + baseDimensions[1] - flagMaxY;
  
  context.save();
  context.beginPath();
  context.translate(x + width / 2, y + height / 2);
  context.rotate(degrees * Math.PI / 180);
  context.scale(z, z);
  context.moveTo(-width / 2, -height / 2);

  
  context.lineTo(-width / 2 + flagDimensions[2] - 8, -height / 2 + flagDimensions[3] - 4);
  context.lineTo(-width / 2 + poleSize, -height / 2 + flagDimensions[4] - flagDimensions[1]);
  context.lineTo(-width / 2 + poleSize, -height / 2 + baseStartCoordinates[1] - flagDimensions[1]);
  context.lineTo(-width / 2 + poleSize + (baseDimensions[0] / 4), -height / 2 + baseStartCoordinates[1] - flagDimensions[1]);
  context.lineTo(-width / 2 + poleSize + (baseDimensions[0] / 4), -height / 2 + baseStartCoordinates[1] + baseDimensions[1] - flagDimensions[1]);
  context.lineTo(-width / 2 + poleSize + (baseDimensions[0] / 4) - baseDimensions[0], -height / 2 + baseStartCoordinates[1] + baseDimensions[1] - flagDimensions[1]);
  context.lineTo(-width / 2 + poleSize + (baseDimensions[0] / 4) - baseDimensions[0], -height / 2 + baseStartCoordinates[1] - flagDimensions[1]);
  context.lineTo(-width / 2, -height / 2 + baseStartCoordinates[1] - flagDimensions[1]);

  context.closePath();
  
  context.fillStyle = color;
  context.fill();
  context.restore();
}

function drawRotatingFlagRunner(context, square, i, z){
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawRotatingFlag(context, square, 'red', i, z);
  if (i < 720 && z > 0){
    requestAnimationFrame(function() {
      drawRotatingFlagRunner(context, square, i, z);
    });
    if (z > 0){
      z -= .05;
    }
    i +=5;
  }else {
    var parent = document.getElementById("canvas-container");
    var child = document.getElementsByClassName("vCanvas")[0];
    parent.removeChild(child);
  }
}

function drawFlag(square){

  if(drawBase){
    ctx.beginPath();
    ctx.rect(square.topLeftVertex[0] + baseStartCoordinates[0], square.topLeftVertex[1] + baseStartCoordinates[1], baseDimensions[0], baseDimensions[1]);
    ctx.fillStyle = 'red';
    ctx.fill();
    drawBase = false;
  } else if(poleRect.y > flagMaxY){
    ctx.beginPath();
    ctx.rect(poleRect.x, poleRect.y, poleRect.width, poleRect.height);
    ctx.fillStyle = 'red';
    ctx.fill();
    poleRect.y -= poleRect.dy;
  } else if(drawFlagPart) {
    ctx.beginPath();
    ctx.moveTo(square.topLeftVertex[0] + flagDimensions[0], square.topLeftVertex[1] + flagDimensions[1]);
    ctx.lineTo(square.topLeftVertex[0] + flagDimensions[2], square.topLeftVertex[1] + flagDimensions[3]);
    ctx.lineTo(square.topLeftVertex[0] + flagDimensions[3], square.topLeftVertex[1] + flagDimensions[4]);
    ctx.lineTo(square.topLeftVertex[0] + flagDimensions[0], square.topLeftVertex[1] + flagDimensions[5]);
    ctx.closePath();
    ctx.fillStyle = 'rgb(255, 41, 41)';
    ctx.fill();
    drawFlagPart = false;
  } else {
    flagAnimationDone = true;
    drawBase = true;
    drawFlagPart = true;
    flagMaxY -= square.topLeftVertex[1];
  }

  if(!flagAnimationDone){
    requestAnimationFrame(() => {
      drawFlag(square);
    });
  }
}


function drawTilePopOff(context, x, y, width, height, degrees, color){
  context.save();

  context.beginPath();
  
  context.translate(x + width / 2, y + height / 2);
  
  context.rotate(degrees * Math.PI / 180);

  context.moveTo(-width / 2, -height/2);
  context.rect(-width / 2, -height/2, width, height)
  context.closePath();
  
  context.fillStyle = color;
  context.fill();

  context.closePath();

  context.restore();
}

function drawTilePopOffWithScale(context, x, y, width, height, degrees, color, scale){
  context.save();

  context.beginPath();
  
  context.translate(x + width / 2, y + height / 2);
  
  context.rotate(degrees * Math.PI / 180);

  context.scale(scale, scale);
  context.moveTo(-width / 2, -height/2);
  context.rect(-width / 2, -height/2, width, height)
  context.closePath();
  
  context.fillStyle = color;
  context.fill();

  context.closePath();

  context.restore();
}

function tilePopOffRunner(degrees, ogY, hasReachedMaxHeight, downCounter, context, x, y, width, height, color, scale){
  
  context.clearRect(0, 0, canvas.width, canvas.height)
  degrees += 3;
  if(y === ogY - 20 && !hasReachedMaxHeight){
    hasReachedMaxHeight = true;
  } else if (y > ogY - 20 && !hasReachedMaxHeight){
    y -= 2;
  } else {
    downCounter++;
    y += 3;
  }
  
  if (downCounter >= 12){
    if (scale > 0){
      scale -= .03;
    }
    drawTilePopOffWithScale(context, x, y, width, height, degrees, color, scale);
  } else {
    drawTilePopOff(context, x, y, width, height, degrees, color);
  }

  if(scale > 0){
    requestAnimationFrame(function(){
      tilePopOffRunner(degrees, ogY, hasReachedMaxHeight, downCounter, context, x, y, width, height, color, scale);
    })
  }else{
    var parent = document.getElementById("canvas-container");
    var child = document.getElementsByClassName("vCanvas")[0];
    parent.removeChild(child);
  }
}

function titlePopOffHandler(context, square){
  var x = square.topLeftVertex[0];
  var y = square.topLeftVertex[1];
  var width = square.topRightVertex[0] - square.topLeftVertex[0];
  var height = square.bottomRightVertex[1] - square.topRightVertex[1];
  var ogY = y;
  var degrees = 0;
  var downCounter = 0;
  var hasReachedMaxHeight = false;
  var scale = 1;
  var color = square.greyColor;

  tilePopOffRunner(degrees, ogY, hasReachedMaxHeight, downCounter, context, x, y, width, height, color, scale);
}


//utils functions
function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log("x: " + x + " y: " + y);
  return [x, y];
}

function inpoly( nvert, vertx, verty, testx, testy ) {
  var i, j, c = false;
  for(i = 0, j = nvert-1; i < nvert; j = i++) {
    if(((verty[i] > testy) != (verty[j] > testy)) &&
    (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i])) {
      c = !c;
    }
  }
  return c;
}

function onSquareClick(square){

  var squareId = square.id;
  var squareDimensions = parseFloat(canvas.width) / width;
  if (isGameOver) return;
  if(square.isChecked) return;
  if (square.squareType === 'mine'){
    gameOver(squareId);
  } else {
    var v_canvas = createVCanvas(canvas.width, canvas.height);
    v_canvas.className = "vCanvas";
    document.getElementById("canvas-container").appendChild(v_canvas);
    var v_ctx = v_canvas.getContext('2d');
    let total = square.total;
    
    titlePopOffHandler(v_ctx, square);
    if (total != 0){

      square.isChecked = true;
      ctx.clearRect(square.topLeftVertex[0], square.topLeftVertex[1], squareDimensions, squareDimensions);
      ctx.fillStyle = square.tanColor;
      ctx.fillRect(square.topLeftVertex[0], square.topLeftVertex[1], squareDimensions, squareDimensions);
      
      ctx.font = fontSize + " 'Baloo Tamma 2'";
      ctx.fillStyle = getNumColor(parseInt(total));
      ctx.textAlign = "center";
      ctx.textBaseline = 'middle';
      ctx.fillText(total, square.topLeftVertex[0] + (parseFloat(squareDimensions) / 2), square.topLeftVertex[1] + (parseFloat(squareDimensions) / 2) + 4);
      return;
    }
    checkSquare(squareId);
    square.isChecked = true;
    ctx.clearRect(square.topLeftVertex[0], square.topLeftVertex[1], squareDimensions, squareDimensions);
    ctx.fillStyle = square.tanColor;
    ctx.fillRect(square.topLeftVertex[0], square.topLeftVertex[1], squareDimensions, squareDimensions);
  }
}

function onSquareRightClick(square){

  if(isGameOver) return;
  if(!(square.squareType === 'checked') && (flags > 0)){
    if(!square.isFlagged){
      square.isFlagged = true;
      flagAnimationDone = false;
      flagMaxY += square.topLeftVertex[1];
      poleRect = {
        x: square.topLeftVertex[0] + poleXCoordinate,
        y: square.topLeftVertex[1] + poleYCoordinate,
        dx: 0,
        dy: 5,
        width: poleSize,
        height: poleSize
      }
      drawFlag(square);
      flags--;
      document.getElementById("flagsLeft").innerHTML = flags;
      checkForWin();
    } else {
      ctx.fillStyle = square.greyColor;
      ctx.fillRect(square.topLeftVertex[0], square.topLeftVertex[1], canvas.width / width, canvas.width / width);
      var v_canvas = createVCanvas(canvas.width, canvas.height);
      v_canvas.className = "vCanvas";
      document.getElementById("canvas-container").appendChild(v_canvas);
      var v_ctx = v_canvas.getContext('2d');
      square.isFlagged = false;
      v_ctx.clearRect(square.topLeftVertex[0], square.topLeftVertex[1], v_canvas.width / width, v_canvas.width / width);
      var i = 0;
      var z = 1;
      drawRotatingFlagRunner(v_ctx, square, i, z);
      flags++;
      document.getElementById("flagsLeft").innerHTML = flags;
    }
  }
}

function checkSquare(id){
  const isLeftEdge = id % width === 0;
  const isRightEdge = id % width === width - 1;

  setTimeout(() => {
    if (id > 0 && !isLeftEdge){
      const newId = parseInt(id) - 1;
      onSquareClick(squares[newId]);
    }
    if (id > width - 1 && !isRightEdge){
      const newId = parseInt(id) + 1 - width;
      onSquareClick(squares[newId]);
    }
    if (id > width){
      const newId = parseInt(id) - width;
      onSquareClick(squares[newId]);
    }
    if (id > width + 1 && !isLeftEdge){
      const newId = parseInt(id) - width -1;
      onSquareClick(squares[newId]);
    }
    if (id < numSquares - 1 && !isRightEdge){
      const newId = parseInt(id) + 1;
      onSquareClick(squares[newId]);
    }
    if (id < numSquares - width && !isLeftEdge){
      const newId = parseInt(id) + width -1;
      onSquareClick(squares[newId]);
    }
    if (id < numSquares - width - 2 && !isRightEdge){
      const newId = parseInt(id) + width + 1;
      onSquareClick(squares[newId]);
    }
    if (id < numSquares - width - 1){
      const newId = parseInt(id) + width;
      onSquareClick(squares[newId]);
    }
  }, 10)

}

function getNumColor(num){
  if(num === 1){
    return "#006aff";
  } else if(num === 2){
    return "#158c41";
  } else if(num === 3){
    return "#c71212";
  } else if(num === 4){
    return "#761ab8";
  } else if(num === 5){
    return "#ffa600";
  } else if(num === 6){
    return "#eded09";
  } else if(num === 7){
    return "#4ded09";
  } else if(num === 8){
    return "#d10fcb";
  }
}

async function shuffleArray(array) { 
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function assignNumbers(){
  
  for (let i = 0; i < squares.length; i++){
    let total = 0;
    const isLeftEdge = i % width === 0;
    const isRightEdge = i % width === width - 1;

    if (squares[i].squareType === 'valid'){
      if (i > 0 && !isLeftEdge && squares[i - 1].squareType === 'mine') total++;
      if (i > width - 1 && !isRightEdge && squares[i + 1 - width].squareType === 'mine') total++;
      if (i > width && squares[i - width].squareType === 'mine') total++;
      if (i > width + 1 && !isLeftEdge && squares[i - 1 - width].squareType === 'mine') total++;
      if (i < numSquares - 1 && !isRightEdge && squares[i + 1].squareType === 'mine') total++;
      if (i < numSquares - width && !isLeftEdge && squares[i - 1 + width].squareType === 'mine') total++;
      if (i < numSquares - width - 2 && !isRightEdge && squares[i + 1 + width].squareType === 'mine') total++;
      if (i < numSquares - width - 1 && squares[i + width].squareType === 'mine') total++;
      squares[i].total = total;
    }
  }
}

async function clearGameBoard(){
  squares = [];
  isGameOver = false;
  flags = 0;
  bombAmount = 0;
  fontSize = "";
  width = 0;
  numSquares = 0;
  flagAnimationDone = false;

  drawFlagPart = true;
  drawBase = true;
  flagMaxY = 0;
  poleRect = null;
  poleXCoordinate = 0;
  poleYCoordinate = 0;
  poleSize = 0;
  baseDimensions = [];
  baseStartCoordinates = [];
  flagDimensions = [];

  var canvas = document.getElementById("gameBoard");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.classList.remove("game-board-difficult");
  canvas.classList.remove("game-board-medium");
  canvas.classList.remove("game-board-easy");
}

async function placeMines(numMines, numSquares){
  var mineArrayToReturn = Array(numMines).fill('mine');
  var emptyArrayToReturn = Array(numSquares - numMines).fill('valid');
  var gameArrayToReturn = emptyArrayToReturn.concat(mineArrayToReturn)
  var shuffledGameArrayToReturn = await shuffleArray(gameArrayToReturn);
  return [shuffledGameArrayToReturn];
}

function createVCanvas(width, height){
  var toReturn = document.createElement("canvas");
  toReturn.id = "v_canvas";
  toReturn.width = width;
  toReturn.height = height;
  toReturn.style = "position: absolute; background-color: transparent;";
  return toReturn;
}

function mineColorGenerator(){
  var color = [["#eb0000", "#8f0000"], ["#d18e11", "#8f5d00"], ["#c9c118", "#8f8800"], ["#1da828", "#135c19"], ["#12c8db", "#00818f"], ["#4840db", "#15124a"], ["#9e13d6", "#66008f"], ["#b50da9", "#8f0085"]];

  return color[Math.floor(Math.random() * 8)];
}

canvas.addEventListener('click', function(e) {
  var clickCoordinates = getCursorPosition(canvas, e);
  squares.forEach(elem => {
    if (inpoly(4, 
      [elem.topLeftVertex[0], elem.topRightVertex[0], elem.bottomRightVertex[0], elem.bottomLeftVertex[0]], 
      [elem.topLeftVertex[1], elem.topRightVertex[1], elem.bottomRightVertex[1], elem.bottomLeftVertex[1]], 
      clickCoordinates[0], clickCoordinates[1])){

      onSquareClick(elem);  
    }
  });
});

canvas.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  var clickCoordinates = getCursorPosition(canvas, e);
  squares.forEach(elem => {
    if (inpoly(4, 
      [elem.topLeftVertex[0], elem.topRightVertex[0], elem.bottomRightVertex[0], elem.bottomLeftVertex[0]], 
      [elem.topLeftVertex[1], elem.topRightVertex[1], elem.bottomRightVertex[1], elem.bottomLeftVertex[1]], 
      clickCoordinates[0], clickCoordinates[1])){

        onSquareRightClick(elem);  
    }
  })
});

createBoard();
document.getElementById("difficulty-dropdown-menu").onclick = () => {
  console.log("ran func");
  createBoard();
};