import Tetronimo from "./Tetronimo.js";
import Point from "./Point.js";

const h_canvas = document.getElementById("holdingBoard");
const h_ctx = h_canvas.getContext("2d");

h_canvas.width = 200;
h_canvas.height = 200;

const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 800;

var v_canvas = createVCanvas(canvas.width, canvas.height);
v_canvas.className = "vCanvas";
document.getElementById("canvas-container").appendChild(v_canvas);
var v_ctx = v_canvas.getContext('2d');

let ctrlsList = ["Escape", " ", "s", "a", "d", "q", "e"];
let btnIdList = ["pauseButton", "resetButton", "downButton", "leftButton", "rightButton", "rLeftButton", "rRightButton"];

let upcomingPieceList = [];
let boardMatrix = []
let currentT = null;
let tempT = null;

let isPaused = false;
let hasLocked = false;
let gameOver = false;
let wasSentToHold = false;
let isBeingHeld = false;
let level = 1;

function update(context, run){
  if(!isPaused && !gameOver){
    if(run % 40 == 0){
      if (isNotMoveAble()){
        hasLocked = true;
        currentT.draw(ctx);
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height);
        currentT.draw(context);
  
        currentT.p1.moveDown(currentT.dy);
        currentT.p2.moveDown(currentT.dy);
        currentT.p3.moveDown(currentT.dy);
        currentT.p4.moveDown(currentT.dy);
      }
    }
  }
  if (!hasLocked && !wasSentToHold) {
    requestAnimationFrame(function(){
      run++;
      update(context, run);
    });
  } else {
    run = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (wasSentToHold){
      wasSentToHold = false;
    } else {
      if(isBeingHeld){
        isBeingHeld = false;
      }
      checkGameOver(currentT);
      if (gameOver){
        console.log(boardMatrix);
        console.log(upcomingPieceList);
        console.log(currentT);
        showGameOverModel();
      } else {
        mapTetronimoToMatrix(currentT);
        hasLocked = false;
        runner();
      }
      checkRows();
    }
    
  }
}


function drawHeldTetronimo(t){
  if (!isPaused){
    h_ctx.clearRect(0, 0, h_canvas.width, h_canvas.height);
    t.drawHeldTet(h_ctx);
  }
  if (isBeingHeld){
    requestAnimationFrame(function(){
      drawHeldTetronimo(t);
    });
  } else {
    h_ctx.clearRect(0, 0, h_canvas.width, h_canvas.height);
  }
  
}

function hold(){
  if (!currentT.hasBeenHeld){
    currentT.hasBeenHeld = true;
    wasSentToHold = true;
    currentT.p1 = currentT.origin1;
    currentT.p2 = currentT.origin2;
    currentT.p3 = currentT.origin3;
    currentT.p4 = currentT.origin4;
    if(upcomingPieceList.length > 1){
      upcomingPieceList.splice(1, 0, currentT);
    } else if (upcomingPieceList.length == 1){
      upcomingPieceList.push(currentT);
    } else {
      tempT = currentT;
    }
    isBeingHeld = true;
    drawHeldTetronimo(currentT);
    runner();
  }
}
function runner(){
  generateNextPieceNum();
  var run = 0;
  update(v_ctx, run);
}

function isNotMoveAble(){
  var p1 = currentT.p1;
  var p2 = currentT.p2;
  var p3 = currentT.p3;
  var p4 = currentT.p4;
  if (p1.y / 40 + 1 == 20 || p2.y / 40 + 1 == 20 || p3.y / 40 + 1 == 20 || p4.y / 40 + 1 == 20){
    return true;
  } else {
    if (boardMatrix[p1.y / 40 + 1][p1.x / 40] == 1 || 
      boardMatrix[p2.y / 40 + 1][p2.x / 40] == 1 || 
      boardMatrix[p3.y / 40 + 1][p3.x / 40] == 1 || 
      boardMatrix[p4.y / 40 + 1][p4.x / 40] == 1){
      return true;
    }
  }
  return false;
}

function mapTetronimoToMatrix(t){
  var p1 = t.p1;
  var p2 = t.p2;
  var p3 = t.p3;
  var p4 = t.p4;

  boardMatrix[p1.y / 40][p1.x / 40] = 1;
  boardMatrix[p2.y / 40][p2.x / 40] = 1; 
  boardMatrix[p3.y / 40][p3.x / 40] = 1;
  boardMatrix[p4.y / 40][p4.x / 40] = 1;
}

function checkRows(){
  var numRowsRemoved = 0;
  var index = 0;
  boardMatrix.forEach((elem) => {
    var isFull = elem.every((num) => num == 1);

    if (isFull){
      numRowsRemoved++;
      ctx.clearRect(0, index * 40, 400, 40);
      var aboveCleared = ctx.getImageData(0, 0, 400, index * 40);
      ctx.clearRect(0, 0, 400, index * 40);
      ctx.putImageData(aboveCleared, 0, 40);
      boardMatrix.splice(index, 1);
      boardMatrix.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    index++;
  });
  if (numRowsRemoved == 1){
    addScore(100 * level);
  } else if (numRowsRemoved == 2){
    addScore(300 * level);
  } else if (numRowsRemoved == 3){
    addScore(500 * level);
  } else if (numRowsRemoved == 4){
    addScore(800 * level);
  }
}
function addScore(num){
  document.getElementById("scoreHeader").innerHTML = "Score: " + (parseFloat(document.getElementById("scoreHeader").innerHTML.substr(document.getElementById("scoreHeader").innerHTML.indexOf(" "))) + num);
}
function checkGameOver(t){
  var p1 = t.p1;
  var p2 = t.p2;
  var p3 = t.p3;
  var p4 = t.p4;

  if (boardMatrix[p4.y / 40] == undefined || 
    boardMatrix[p3.y / 40] == undefined || 
    boardMatrix[p2.y / 40] == undefined || 
    boardMatrix[p1.y / 40] == undefined){
    gameOver = true;
  } else {
    gameOver = false;
  }
}
async function runGame(){
  await setBoard();
  runner();
}
function generateNextPieceNum(){
  currentT = null;
  if (upcomingPieceList.length == 0){
    upcomingPieceList = generateNextSevenPieces();
  }
  currentT = upcomingPieceList.shift();
}
async function setBoard(){
  upcomingPieceList = [];
  boardMatrix = []
  currentT = null;
  tempT = null;
  
  isPaused = false;
  hasLocked = false;
  gameOver = false;
  wasSentToHold = false;
  isBeingHeld = false;
  level = 1;
  for(var i = 0; i < 20; i++){
    boardMatrix.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
}
function generateNextSevenPieces(){
  var toReturn = [new Tetronimo(new Point(160, 0), new Point(160, -40), new Point(200, 0), new Point(120, 0), "#a903fc", "#b638f5", 1), //T
  new Tetronimo(new Point(160, 0), new Point(120, 0), new Point(200, 0), new Point(240, 0), "#00a6ff", "#00ccff", 2), //I
  new Tetronimo(new Point(160, 0), new Point(120, 0), new Point(200, 0), new Point(120, -40), "#002fff", "#2574cf", 3), //J
  new Tetronimo(new Point(160, 0), new Point(120, 0), new Point(200, 0), new Point(200, -40), "#ff9500", "#e8ab1c", 4), //L
  new Tetronimo(new Point(160, 0), new Point(200, 0), new Point(200, -40), new Point(160, -40), "#e6e61c", "yellow", 5), //O
  new Tetronimo(new Point(160, 0), new Point(200, 0), new Point(200, -40), new Point(160, 40), "#781111", "#fa0505", 6), //S
  new Tetronimo(new Point(160, 0), new Point(200, 0), new Point(200, 40), new Point(160, -40), "#127811", "#21e61e", 7)]; //Z
  for (let i = toReturn.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [toReturn[i], toReturn[j]] = [toReturn[j], toReturn[i]];
  }
  if(!tempT == null){
    toReturn.splice(1, 0, tempT);
    tempT = null;
  }
  return toReturn;
}

function createVCanvas(width, height){
  var toReturn = document.createElement("canvas");
  toReturn.id = "v_canvas";
  toReturn.width = width;
  toReturn.height = height;
  toReturn.style = "position: absolute; background-color: transparent;";
  return toReturn;
}
function getKeyPressed(e){
  var toReturn = [e.key, e.keyCode, e.code]
  return toReturn;
}
function closeOptionModal(){
  var modal = document.getElementById("optionModal");
  modal.style.display = "none";
}
function openOptionModal(){
  var modal = document.getElementById("optionModal");
  modal.style.display = "block";
}
function openSettingsModal(){
  var modal = document.getElementById("settingsModal");
  modal.style.display = "block";
  var bb = document.getElementById("backButton");
  bb.onclick = function(){
    modal.style.display = "none";
    openOptionModal();
  }

  var db = document.getElementById("downButton");
  db.onclick = function(e){
    e.preventDefault
    displaySAKDiv(db.id, 4);
  }
  var lb = document.getElementById("leftButton");
  lb.onclick = function(e){
    e.preventDefault
    displaySAKDiv(lb.id, 4);
  }
  var rb = document.getElementById("rightButton");
  rb.onclick = function(e){
    e.preventDefault
    displaySAKDiv(rb.id, 2);
  }
  var rLb = document.getElementById("rLeftButton");
  rLb.onclick = function(e){
    e.preventDefault
    displaySAKDiv(rLb.id, 5);
  }
  var rRb = document.getElementById("rRightButton");
  rRb.onclick = function(e){
    e.preventDefault
    displaySAKDiv(rRb.id, 6);
  }
  var reset = document.getElementById("resetButton");
  reset.onclick = function(e){
    e.preventDefault
    displaySAKDiv(reset.id, 1);
  }
  var pause = document.getElementById("pauseButton");
  pause.onclick = function(e){
    e.preventDefault
    displaySAKDiv(pause.id, 0);
  }

}
function displaySAKDiv(btnId, btnIndex){
  var modal = document.getElementById("settingsModal");
  modal.style.display = "none";
  var sak = document.getElementById("sakDiv");
  sak.style.display = "block";
  document.addEventListener('keydown', (e) => {
    var isAssigned = [];
    var i = 0;
    for(var elem of ctrlsList){
      if (elem == e.key && btnIdList[i] != btnId){
        isAssigned[0] = true;
        isAssigned[1] = i;
        break;
      }
      i++;
    }
    if(isAssigned[0]){
      var confirmed = window.confirm("Another control is already bound to this. Are you sure you want to override?");
      if (confirmed){
        if (e.key == " "){
          document.getElementById(btnId).innerHTML = "Space";
          ctrlsList[btnIndex] = " ";
        } else {
          var keyInfo = getKeyPressed(e);
          document.getElementById(btnId).innerHTML = keyInfo[0];
        }
        ctrlsList[isAssigned[1]] = "none";
        document.getElementById(btnIdList[isAssigned[1]]).innerHTML = "none";
        sak.style.display = "none";
        modal.style.display = "block";
      } else {
        sak.style.display = "none";
        modal.style.display = "block";
      }
      
    } else {
      if (e.key == " "){
        document.getElementById(btnId).innerHTML = "Space";
        ctrlsList[btnIndex] = " ";
      } else {
        var keyInfo = getKeyPressed(e);
        document.getElementById(btnId).innerHTML = keyInfo[0];
      }
      sak.style.display = "none";
      modal.style.display = "block";
    }
  }, {once: true});
}
function showGameOverModel(){
  var modal = document.getElementById("gameOverModal");
  modal.style.display = "block";
}
function closeGameOverModal(){
  var modal = document.getElementById("gameOverModal");
  modal.style.display = "none";
}

//control methods
function canMoveLeft(){
  var p1 = currentT.p1.x;
  var p2 = currentT.p2.x;
  var p3 = currentT.p3.x;
  var p4 = currentT.p4.x;
  if (p1 / 40 == 0 || p2 / 40 == 0 || p3 / 40 == 0 || p4 / 40 == 0){
    return false;
  }
  return true;
}
function canMoveRight(){
  var p1 = currentT.p1.x;
  var p2 = currentT.p2.x;
  var p3 = currentT.p3.x;
  var p4 = currentT.p4.x;
  if (p1 / 40 == 9 || p2 / 40 == 9 || p3 / 40 == 9 || p4 / 40 == 9){
    return false;
  }
  return true;
}
function moveLeft(){
  if(canMoveLeft()){
    currentT.moveLeft();
    v_ctx.clearRect(0, 0, v_canvas.width, v_canvas.height);
    currentT.draw(v_ctx);
  }
}
function moveRight(){
  if (canMoveRight()){
    currentT.moveRight();
    v_ctx.clearRect(0, 0, v_canvas.width, v_canvas.height);
    currentT.draw(v_ctx);
  }
}
function hardDrop(){
  while (!isNotMoveAble(currentT)){
    currentT.p1.moveDown(currentT.dy);
    currentT.p2.moveDown(currentT.dy);
    currentT.p3.moveDown(currentT.dy);
    currentT.p4.moveDown(currentT.dy);
    v_ctx.clearRect(0, 0, v_canvas.width, v_canvas.height);
    currentT.draw(v_ctx);
  }
  
}

function canRotate(){
  var p1 = currentT.p1.x;
  var p2 = currentT.p2.x;
  var p3 = currentT.p3.x;
  var p4 = currentT.p4.x;
  if (p1 / 40 == 0 || p2 / 40 == 0 || p3 / 40 == 0 || p4 / 40 == 0 || p1 / 40 == 9 || p2 / 40 == 9 || p3 / 40 == 9 || p4 / 40 == 9){
    return false;
  }
  return true;
}

function rotateLeft(){
  if(canRotate()){
    currentT.rotateLeft();
    v_ctx.clearRect(0, 0, v_canvas.width, v_canvas.height);
    currentT.draw(v_ctx);
  }
}
function rotateRight(){
  if(canRotate()){
    currentT.rotateRight();
    v_ctx.clearRect(0, 0, v_canvas.width, v_canvas.height);
    currentT.draw(v_ctx);
  }
}

document.body.addEventListener('keydown', function(e) {
  if (document.getElementById("sakDiv").style.display == "block" || document.getElementById("settingsModal").style.display == "block"){
    return;
  } else if (!gameOver) {
    if (e.key == ctrlsList[0]) {
      var modal = document.getElementById("optionModal");
      var playbtn = document.getElementById("playButton");
      if (gameOver){
        playbtn.innerHTML = "PLAY";
        gameOver = false;
      } else {
        playbtn.innerHTML = "RESUME";
      }
  
      if (modal.style.display == "block"){
        closeOptionModal();
        isPaused = false;
      } else {
        openOptionModal();
        isPaused = true;
      }
    }else if (!isPaused){
      if (e.key == ctrlsList[1]){
        hold();
      } else if (e.key == ctrlsList[2]){
        hardDrop();
      } else if (e.key == ctrlsList[3]){
        moveLeft();
      } else if (e.key == ctrlsList[4]){
        moveRight();
      } else if (e.key == ctrlsList[5]){
        rotateLeft();
      } else if (e.key == ctrlsList[6]){
        rotateRight();
      }
    }
  }
  e.preventDefault();
});

document.getElementById("playButton").addEventListener("click", function() {
  if (document.getElementById("playButton").innerHTML == "PLAY"){
    runGame();
  }
  isPaused = false;
  closeOptionModal();
});

document.getElementById("settingsButton").addEventListener("click", function() {
  closeOptionModal();
  openSettingsModal();
});

document.getElementById("playAgainButton").addEventListener("click", function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  closeGameOverModal();
  runGame();
});