let squares = [];
let isGameOver = false;
let flags = 0;
let bombAmount = 0;
let fontSize = "";
let header = document.getElementById("ms-header");


function getBombAmount(){
  return bombAmount;
}

async function createBoard(){
  var mineArray;
  var emptyArray;
  var gameArray;
  var shuffledGameArray;
  var difficultyString;
  var height;
  var width;
  var headerWidth;
  var numBombs;
  var pixelWidth;
  var pixelHeight;

  await clearGameBoard();
  const gameBoard = document.getElementById("gameBoard");
  var difficulty = document.getElementById("difficultySelector");
  var value = difficulty.options[difficulty.selectedIndex].value;


  if (value === "easy" || value === "default"){
    difficultyString = "easy";
    headerWidth = 450;
    width = 10;
    height = 8;
    numBombs = 10;
    pixelWidth = 450;
    pixelHeight = 360;
    fontSize = "min(6.667vw, 30px)";
  }else if(value === "medium"){
    difficultyString = "medium";
    headerWidth = 540;
    width = 18;
    height = 14;
    numBombs = 40;
    pixelWidth = 540;
    pixelHeight = 420;
    fontSize = "min(3.333vw, 15px)";
  }else if(value === "hard"){
    difficultyString = "difficult";
    headerWidth = 600;
    height = 20;
    width = 24;
    numBombs = 99;
    pixelWidth = 600;
    pixelHeight = 500;
    fontSize = "min(3.111vw, 14px)";
  }

  bombAmount = numBombs;
  flags = numBombs;
  var returnedVal = await placeMines(numBombs, width*height);
  mineArray = returnedVal[0];
  emptyArray = returnedVal[1];
  gameArray = returnedVal[2];
  shuffledGameArray = returnedVal[3];
  var n = 1;
  for (var i = 0; i < width*height; i++){
    var squareDiv = document.createElement("div");
    squareDiv.setAttribute('id', i);

    if(i % width === 0){
      n++;
    }

    if((i < width * n) && n % 2 === 0){
      if(i % 2){
        squareDiv.classList.add("dark-grey");
      } else {
        squareDiv.classList.add("light-grey");
      }
    } else {
      if(i % 2){
        squareDiv.classList.add("light-grey");
      } else {
        squareDiv.classList.add("dark-grey");
      }
    }

    squareDiv.classList.add(shuffledGameArray[i]);

    squareDiv.oncontextmenu = function(e){
      e.preventDefault();
      onSquareRightClick(this.id);
    }

    squareDiv.addEventListener('click', function(e){
      onSquareClick(this.id, width, width*height);
    })

    gameBoard.appendChild(squareDiv);
    squares.push(squareDiv);
  }
  assignNumbers(width, height);
  gameBoard.className = "game-board-" + difficultyString;
  let vw = 60 / headerWidth * 100;
  header.style = `max-width: ${headerWidth}px; max-height: min(${vw}vw, 60px);`;
  header.parentElement.style = `grid-template-rows: min(${vw}vw, 60px) 1fr;`;
  document.getElementById("flagsLeft").innerHTML = flags;
  document.getElementById("looseModal").style = `width: ${pixelWidth / headerWidth * 100}vw; height: ${(parseInt(pixelHeight) + 60) / headerWidth * 100}vw;`;
  document.getElementById("winModal").style = `width: ${pixelWidth / headerWidth * 100}vw; height: ${(parseInt(pixelHeight) + 60) / headerWidth * 100}vw;`;
  
}

function onSquareRightClick(squareId){
  var square = document.getElementById(squareId);

  if(isGameOver) return;
  if(!square.classList.contains('checked') && (flags > 0)){
    if(!square.classList.contains('flag')){
      square.classList.add('flag');
      var flagImg = document.createElement('img');
      flagImg.src = "src/img/flag.png";
      flagImg.alt = "flagged";
      flagImg.className = "flag__img";
      square.appendChild(flagImg);
      flags--;
      document.getElementById("flagsLeft").innerHTML = flags;
      checkForWin();
    } else {
      square.classList.remove('flag');
      square.removeChild(square.childNodes[0]);
      flags++;
      document.getElementById("flagsLeft").innerHTML = flags;
    }
  }
}

function onSquareClick(squareId, width, numSquares){
  var square = document.getElementById(squareId);

  if (isGameOver) return;
  if(square.classList.contains("checked") || square.classList.contains("checked")) return;
  if (square.classList.contains('mine')){
    gameOver(squareId);
  } else {
    let total = square.getAttribute('data');
    if (total != 0){
      square.classList.add("checked");
      if(square.classList.contains("dark-grey")){
        square.classList.remove("dark-grey");
        square.classList.add("dark-tan");
      } else {
        square.classList.remove("light-grey");
        square.classList.add("light-tan");
      }
      square.style = "color: " + getNumColor(parseInt(total)) + "; font-size: " + fontSize;
      square.innerHTML = total;
      return;
    }
    checkSquare(squareId, width, numSquares);
    square.classList.add("checked")
    if(square.classList.contains("dark-grey")){
      square.classList.remove("dark-grey");
      square.classList.add("dark-tan");
    } else {
      square.classList.remove("light-grey");
      square.classList.add("light-tan");
    }
  }
}

function gameOver(){
  isGameOver = true;

  squares.forEach(elem => {
    if(elem.classList.contains('mine')){
      if(elem.classList.contains('flag')){
        elem.classList.remove('flag');
      elem.removeChild(elem.childNodes[0]);
      }

      var mineImg = document.createElement("img");
      mineImg.src = "src/img/mine.png";
      mineImg.alt = "mine";
      mineImg.className = "mine__img";

      elem.appendChild(mineImg);
    }
  });
  openGameLostModal();
}

function checkForWin(){
  let matches = 0
  let bombs = getBombAmount();

  for (let i = 0; i < squares.length; i++) {
    if (squares[i].classList.contains('flag') && squares[i].classList.contains('mine')) {
      matches++;
    }
    if (matches === bombs) {
      openGameWonModal();
      isGameOver = true
    }
  }
}

function checkSquare(id, width, numSquares){
  const isLeftEdge = id % width === 0;
  const isRightEdge = id % width === width - 1;

  setTimeout(() => {
    if (id > 0 && !isLeftEdge){
      const newId = parseInt(id) - 1;
      onSquareClick(newId, width, numSquares);
    }
    if (id > width - 1 && !isRightEdge){
      const newId = parseInt(id) + 1 - width;
      onSquareClick(newId, width, numSquares);
    }
    if (id > width){
      const newId = parseInt(id) - width;
      onSquareClick(newId, width, numSquares);
    }
    if (id > width + 1 && !isLeftEdge){
      const newId = parseInt(id) - width -1;
      onSquareClick(newId, width, numSquares);
    }
    if (id < numSquares - 1 && !isRightEdge){
      const newId = parseInt(id) + 1;
      onSquareClick(newId, width, numSquares);
    }
    if (id < numSquares - width && !isLeftEdge){
      const newId = parseInt(id) + width -1;
      onSquareClick(newId, width, numSquares);
    }
    if (id < numSquares - width - 2 && !isRightEdge){
      const newId = parseInt(id) + width + 1;
      onSquareClick(newId, width, numSquares);
    }
    if (id < numSquares - width - 1){
      const newId = parseInt(id) + width;
      onSquareClick(newId, width, numSquares);
    }
  }, 10)

}

async function assignNumbers(width, height){
  var numSquares = width * height;
  for (let i = 0; i < squares.length; i++){
    let total = 0;
    const isLeftEdge = i % width === 0;
    const isRightEdge = i % width === width - 1;

    if (squares[i].classList.contains('valid')){
      if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('mine')) total++;
      if (i > width - 1 && !isRightEdge && squares[i + 1 - width].classList.contains('mine')) total++;
      if (i > width && squares[i - width].classList.contains('mine')) total++;
      if (i > width + 1 && !isLeftEdge && squares[i - 1 - width].classList.contains('mine')) total++;
      if (i < numSquares - 1 && !isRightEdge && squares[i + 1].classList.contains('mine')) total++;
      if (i < numSquares - width && !isLeftEdge && squares[i - 1 + width].classList.contains('mine')) total++;
      if (i < numSquares - width - 2 && !isRightEdge && squares[i + 1 + width].classList.contains('mine')) total++;
      if (i < numSquares - width - 1 && squares[i + width].classList.contains('mine')) total++;
      squares[i].setAttribute('data', total);
    }
  }
}

async function placeMines(numMines, numSquares){
  var mineArrayToReturn = Array(numMines).fill('mine');
  var emptyArrayToReturn = Array(numSquares - numMines).fill('valid');
  var gameArrayToReturn = emptyArrayToReturn.concat(mineArrayToReturn)
  var shuffledGameArrayToReturn = await shuffleArray(gameArrayToReturn);
  return [mineArrayToReturn, emptyArrayToReturn, gameArrayToReturn, shuffledGameArrayToReturn];
}

async function clearGameBoard(){
  squares = [];
  var gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";
  gameBoard.classList.remove("game-board-difficult");
  gameBoard.classList.remove("game-board-medium");
  gameBoard.classList.remove("game-board-easy");
}

async function addFlag(){
  document.getElementById("flagsLeft").innerHTML = (document.getElementById("flagsLeft").innerHTML + 1);
}

async function removeFlag(){
  document.getElementById("flagsLeft").innerHTML = (document.getElementById("flagsLeft").innerHTML - 1);
}

async function shuffleArray(array) { 
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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

createBoard();
document.getElementById("difficulty-dropdown-menu").onclick = async () => {
  console.log("ran func");
  await createBoard();
};