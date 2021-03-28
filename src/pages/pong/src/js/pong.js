const canvas = document.getElementById("gameBoard")
const ctx = canvas.getContext("2d");
let isPaused = false;
let gameOver = false;
let circleAnimationRunning = false;

var p1_cavas = document.createElement("canvas");
p1_cavas.id = "p1_canvas";
p1_cavas.width = 600;
p1_cavas.height = 600;
p1_cavas.style = "position: absolute; background-color: transparent; z-index: 2;";
document.getElementById("canvas-container").appendChild(p1_cavas);
const p1_ctx = p1_cavas.getContext('2d');

var p2_cavas = document.createElement("canvas");
p2_cavas.id = "p2_canvas";
p2_cavas.width = 600;
p2_cavas.height = 600;
p2_cavas.style = "position: absolute; background-color: transparent; z-index: 3;";
document.getElementById("canvas-container").appendChild(p2_cavas);
const p2_ctx = p1_cavas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

let ctrlsList = ["Escape", " ", "ArrowUp", "ArrowDown", "w", "s"];
let btnIdList = ["pauseButton", "resetButton", "p2PaddleUpButton", "p2PaddleDownButton", "p1PaddleUpButton", "p1PaddleDownButton"];

let point = [2, 1]

let distance = Math.sqrt(point[0] * point[0] + point[1] * point[1]);

let rotationInRadians = Math.round(Math.random() * 360) * Math.PI / 180;

while (rotationInRadians < 0.52 || rotationInRadians > 5.76 || (rotationInRadians > 2.62 && rotationInRadians < 3.67)){
  rotationInRadians = Math.round(Math.random() * 360) * Math.PI / 180;
}

let transformedPoint = [
  Math.cos(rotationInRadians) * distance,
  Math.sin(rotationInRadians) * distance
];

const circle = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 11.5,
  dx: transformedPoint[0],
  dy: transformedPoint[1]
};

const p1Paddle = {
  x: 20,
  y: 225,
  width: 15,
  height: 150,
  speed: 8,
  dy: 0
}

const p2Paddle = {
  x: 565,
  y: 225,
  width: 15,
  height: 150,
  speed: 8,
  dy: 0
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

  var p1U = document.getElementById("p1PaddleUpButton");
  p1U.onclick = function(e){
    e.preventDefault
    displaySAKDiv(p1U.id, 4);
  }
  var p1D = document.getElementById("p1PaddleDownButton");
  p1D.onclick = function(e){
    e.preventDefault
    displaySAKDiv(p1D.id, 5);
  }
  var p2U = document.getElementById("p2PaddleUpButton");
  p2U.onclick = function(e){
    e.preventDefault
    displaySAKDiv(p2U.id, 2);
  }
  var p2D = document.getElementById("p2PaddleDownButton");
  p2D.onclick = function(e){
    e.preventDefault
    displaySAKDiv(p2D.id, 3);
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


function drawCircle() {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
}

function drawPaddle(ctx, x, y, width, height){
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, width, height);
}


function updateBallPos() {
  if (!gameOver){
    if (!isPaused){
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawCircle();

      // change position
      circle.x += circle.dx;
      circle.y += circle.dy;

      //Detect paddles
      if (circle.x + circle.size > p2Paddle.x && (circle.y > p2Paddle.y && circle.y < p2Paddle.y + p2Paddle.height)) {
        circle.dx *= -1;
        
        if (circle.dx >= 0){
          circle.dx += 0.35;
        } else {
          circle.dx -= 0.35;
        }
        if (circle.dy >= 0){
          circle.dy += 0.35;
        } else {
          circle.dy -= 0.35;
        }
      }

      if (circle.x - circle.size < p1Paddle.x + p1Paddle.width && (circle.y > p1Paddle.y && circle.y < p1Paddle.y + p1Paddle.height)){
        circle.dx *= -1;
        
        if (circle.dx >= 0){
          circle.dx += 0.35;
        } else {
          circle.dx -= 0.35;
        }
        if (circle.dy >= 0){
          circle.dy += 0.35;
        } else {
          circle.dy -= 0.35;
        }
      }

      // Detect side walls
      if (circle.x + circle.size > canvas.width) {
        updateP1Score();
        resetGameBoard("P1 SCORED!");
      }

      if (circle.x - circle.size < 0){
        updateP2Score();
        resetGameBoard("P2 SCORED!");
      }

      // Detect top and bottom walls
      if (circle.y + circle.size > canvas.height || circle.y - circle.size < 0) {
        circle.dy *= -1;
      }
    }
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function resetGameBoard(str){
  var point = [2, 1]

  var distance = Math.sqrt(point[0] * point[0] + point[1] * point[1]);

  var rotationInRadians = Math.round(Math.random() * 360) * Math.PI / 180;

  var transformedPoint = [
    Math.cos(rotationInRadians) * distance,
    Math.sin(rotationInRadians) * distance
  ];
  circleAnimationRunning = false;
  //updateBallPos();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //circleAnimationRunning = true;
  circle.x = canvas.width / 2;
  circle.y = canvas.height / 2;
  circle.dx = transformedPoint[0];
  circle.dy = transformedPoint[1];
  startCountdown(str);
}

function updateP1Score(){
  document.getElementById("p1-score").innerHTML ="P1: " + (parseInt(document.getElementById("p1-score").innerHTML.substring(document.getElementById("p1-score").innerHTML.indexOf(" ") + 1)) + 1);
}

function updateP1Paddle(v_ctx){
  p1Paddle.y += p1Paddle.dy;
  drawPaddle(v_ctx, p1Paddle.x, p1Paddle.y, p1Paddle.width, p1Paddle.height);
}

function updateP2Score(){
  document.getElementById("p2-score").innerHTML ="P2: " + (parseInt(document.getElementById("p2-score").innerHTML.substring(document.getElementById("p2-score").innerHTML.indexOf(" ") + 1)) + 1);
}

function updateP2Paddle(v_ctx){
  p2Paddle.y += p2Paddle.dy;
  drawPaddle(v_ctx, p2Paddle.x, p2Paddle.y, p2Paddle.width, p2Paddle.height);
}

function update(){
  
  p1_ctx.clearRect(p1Paddle.x, 0, p1Paddle.width, canvas.height);
  p2_ctx.clearRect(p2Paddle.x, 0, p2Paddle.width, canvas.height);

  updateP2Paddle(p2_ctx);
  updateP1Paddle(p1_ctx);
  
  if (p2Paddle.y < 10){
    p2Paddle.y = 10;
  }

  if (p2Paddle.y + p2Paddle.height > 590){
    p2Paddle.y = 590 - p2Paddle.height;
  }

  if (p1Paddle.y < 10){
    p1Paddle.y = 10;
  }

  if (p1Paddle.y + p1Paddle.height > 590){
    p1Paddle.y = 590 - p1Paddle.height;
  }

  if(circleAnimationRunning){
    updateBallPos();
  }

  requestAnimationFrame(update);
}

function startGame(){
  circleAnimationRunning = true;
  update();
}

function moveP1Up(){
  p1Paddle.dy = -p1Paddle.speed;
}

function moveP1Down(){
  p1Paddle.dy = p1Paddle.speed;
}

function moveP2Up(){
  p2Paddle.dy = -p2Paddle.speed;
}

function moveP2Down(){
  p2Paddle.dy = p2Paddle.speed;
}

function startCountdown(str){
  if (str != null){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '72px Audiowide';
    ctx.fillText(str, 240.75, 200, 150);
    setTimeout(function(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '72px Audiowide';
      ctx.fillText(3, 277.5, 200, 150);
      setTimeout(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '72px Audiowide';
        ctx.fillText("2", 274.5, 200, 150);
        setTimeout(function () {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.font = '72px Audiowide';
          ctx.fillText("1", 303, 200, 150);
          setTimeout(function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            circleAnimationRunning = true;
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000)
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '96px Audiowide';
    ctx.fillText("3", 370, 200, 150);
    setTimeout(function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '96px Audiowide';
      ctx.fillText("2", 366, 200, 150);
      setTimeout(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '96px Audiowide';
        ctx.fillText("1", 404, 200, 150);
        setTimeout(function () {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          circleAnimationRunning = true;
        }, 1000);
      }, 1000);
    }, 1000);
  }
  
}

function getKeyPressed(e){
  var toReturn = [e.key, e.keyCode, e.code]
  return toReturn;
}

//controls listener
document.body.addEventListener('keydown', function(e) {
  if (document.getElementById("sakDiv").style.display == "block" || document.getElementById("settingsModal").style.display == "block"){
    return;
  } else {
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
        location.reload();
      } else if (e.key == ctrlsList[2]){
        moveP2Up();
      } else if (e.key == ctrlsList[3]){
        moveP2Down();
      } else if (e.key == ctrlsList[4]){
        moveP1Up();
      } else if (e.key == ctrlsList[5]){
        moveP1Down();
      }
    }
  }
  e.preventDefault();
});

document.body.addEventListener('keyup', function(e) {
  if (!isPaused){
    if (e.key == ctrlsList[2] || e.key == ctrlsList[3]){
      p2Paddle.dy = 0;
    } else if (e.key == ctrlsList[4] || e.key == ctrlsList[5]){
      p1Paddle.dy = 0;
    }
  }
  e.preventDefault();
});

document.getElementById("playButton").addEventListener("click", function() {
  if (document.getElementById("playButton").innerHTML == "PLAY"){
    startGame();
  }
  isPaused = false;
  closeOptionModal();
});

document.getElementById("supportButton").addEventListener("click", function() {
  closeOptionModal();
});

document.getElementById("settingsButton").addEventListener("click", function() {
  closeOptionModal();
  openSettingsModal();
});