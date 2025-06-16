let buttons = document.querySelectorAll(".cell");
let start = document.getElementById("start");
let back = document.getElementById("back");
let player = document.getElementById("player");
let ai = document.getElementById("ai");

//audio
let bgMusic = new Audio('audio/battlesound.mp3');
let winSound = new Audio('audio/win.mp3');
let gameOverSound = new Audio('audio/game-over-voice.mp3');
let loseSound = new Audio('audio/game-over-sound.mp3');


let player2 = document.getElementById("player2");

let playerScore = document.querySelectorAll(".score");
let aiScore = document.querySelectorAll(".score2");

let hero = document.getElementById("hero");

let mode = true;
let selection = document.getElementById("selection");
let homepage = document.getElementById("homepage");
let gameboard = document.getElementById("gameboard");
let scoreboard = document.getElementById("scoreboard");
let alertMessage = document.getElementById("alert-message");
let round = document.getElementById("round");
let over = document.getElementById("over");
let continueToNext = document.getElementById("continue");

let lastWinner = "X"; 
let playerScoreCount = -1;
let aiScoreCount = -1;
let board = ["", "", "", "", "", "", "", "", "",];
let flag = true;

player.addEventListener("click", () => {
    vsPlayer();
    mode = true;
    back.style.display = "block";
    selection.style.display = "none";
    gameboard.style.display = "grid";
    scoreboard.style.display = "block";
    player2.textContent = "Player 2";
    hero.style.backgroundImage = "url('media/battlegrounds.jpg')";
    hero.style.height = "120vh";
    back.style.display = "block";
    });
ai.addEventListener("click", () => {
    vsAI();
    mode = false;
    back.style.display = "block";
    selection.style.display = "none";
    player2.textContent = "AI";
    gameboard.style.display = "grid";
    scoreboard.style.display = "block";
    hero.style.backgroundImage = "url('media/battlegrounds.jpg')";
    hero.style.height = "120vh";
    back.style.display = "block";
    });
start.addEventListener("click", () =>{
  homepage.style.display = "none";
  selection.style.display = "flex";
  
});
back.addEventListener("click", () => {
  back.style.display = "none";
  bgMusic.pause();
  bgMusic.currentTime = 0;
  gameboard.style.display = "none";
  selection.style.display = "flex";
  scoreboard.style.display = "none";
  hero.style.backgroundImage = "url('media/background-image.png')";
  hero.style.height = "100vh";
  back.style.display = "none";
  alertMessage.style.display = "none";
  continueToNext.textContent = "Continue to the next battle"
  over.textContent = "Get ready for the next battle.";
  resetAll();
  resetGame();
});
continueToNext.addEventListener("click", () => {
  if(continueToNext.textContent == "Rematch"){
    loseSound.pause();
    loseSound.currentTime = 0;
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
    battleSound();
    rematch();
   
  } else{
    alertMessage.style.display = "none";
    gameboard.style.display = "grid";
  }

})
function vsPlayer(){
  resetAll();
      clearAllEventListeners();
      battleSound();
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const clickedCell = index;

    const symbol = flag ? "X" : "O";

    board[clickedCell] = symbol;
    button.textContent = symbol;
    button.disabled = true;
    flag = !flag; 
    handleWinners();

  });
});
}

function vsAI() {
    resetAll();
        clearAllEventListeners();
        battleSound();
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (board[index] !== "") return;


      const playerSymbol = "X";
      board[index] = playerSymbol;
      button.textContent = playerSymbol;
      button.disabled = true;
      flag = false;
      disableAllButtons();
      handleWinnersVsAI();

 
      setTimeout(() => {
        
        makeSmartAIMove();
      }, 500);
    });
  });
}
function disableAllButtons() {
  buttons.forEach(button => button.disabled = true);
}
function makeSmartAIMove() {
  const aiSymbol = "O";
  const playerSymbol = "X";


  const winMove = findBestMove(aiSymbol);
  if (winMove !== null) return placeAIMove(winMove, aiSymbol);

  const blockMove = findBestMove(playerSymbol);
  if (blockMove !== null) return placeAIMove(blockMove, aiSymbol);

 // Try a random available corner
  const corners = [0, 2, 6, 8].filter(i => board[i] === "");
  if (corners.length > 0) {
    const randomCorner = corners[Math.floor(Math.random() * corners.length)];
    return placeAIMove(randomCorner, aiSymbol);
  }

  // Try a random available side
  const sides = [1, 3, 5, 7].filter(i => board[i] === "");
  if (sides.length > 0) {
    const randomSide = sides[Math.floor(Math.random() * sides.length)];
    return placeAIMove(randomSide, aiSymbol);
  }

  // Fallback: any available move
  const emptyIndices = board
    .map((val, idx) => (val === "" ? idx : null))
    .filter(idx => idx !== null);

  if (emptyIndices.length > 0) {
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    return placeAIMove(randomIndex, aiSymbol);
  }
}

function makeRandomAIMove(){
   const emptyIndices = board
    .map((val, idx) => (val === "" ? idx : null))
    .filter(idx => idx !== null);

  if (emptyIndices.length > 0) {
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    placeAIMove(randomIndex, "O");
  }

}
function findBestMove(symbol) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
  ];

  for (let combo of winCombos) {
    const [a, b, c] = combo;
    const line = [board[a], board[b], board[c]];
    const emptyIndex = [a, b, c].find((i) => board[i] === "");

    if (line.filter(v => v === symbol).length === 2 && emptyIndex !== undefined) {
      return emptyIndex;
    }
  }

  return null;
}


function placeAIMove(index, symbol) {
  setTimeout(() => {
    board[index] = symbol;
  buttons[index].textContent = symbol;
  buttons[index].disabled = true;
  flag = true;
  enableAllButtons();
  handleWinnersVsAI()
        }, 500);
  
}





function handleWinners() {
       const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]           
  ];

  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      const winner = board[a];
      if (winner === "X") {
        setTimeout(() => {
            gameboard.style.display = "none";
            alertMessage.style.display = "flex";
            round.textContent = "PLAYER 1 WIN THIS ROUND";
            round.style.color = "green";
             lastWinner = winner;
             playerScoreCount++;
             playerScore[playerScoreCount].style.backgroundColor = "green";
             if(playerScoreCount == 2 || aiScoreCount == 2){
              round.textContent = "PLAYER 1 IS PRO";
              over.textContent = "Nice Game Player 2 Noob";
              continueToNext.textContent = "Rematch";
              playWinSound();
             }
            resetGame();
            }, 700);
            lastWinner = winner;
      } else if (winner === "O") {
        setTimeout(() => {
            gameboard.style.display = "none";
            alertMessage.style.display = "flex";
            round.textContent = "PLAYER 2 WIN THIS ROUND";
            round.style.color = "green";
             lastWinner = winner;
              aiScoreCount++;
             aiScore[aiScoreCount].style.backgroundColor = "green";
             if(playerScoreCount == 2 || aiScoreCount == 2){
                round.textContent = "PLAYER 2 IS PRO";
              over.textContent = "Nice Game Player 1 Noob";
        continueToNext.textContent = "Rematch";
        playWinSound();
             }
            resetGame();
            }, 700);
           
      }
      return;
    }
  }

  if (!board.includes("")) {
    setTimeout(() => {
        gameboard.style.display = "none";
            alertMessage.style.display = "flex";
            round.textContent = "IT'S DRAW THIS ROUND";
            round.style.color = "yellow";
        resetGame();
        }, 700);
 
  }
}

function handleWinnersVsAI() {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]           
  ];

  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      const winner = board[a];
      if (winner === "X") {
        setTimeout(() => {
                    gameboard.style.display = "none";
            alertMessage.style.display = "flex";
            round.textContent = "YOU WIN THIS ROUND";
            round.style.color = "green";
             lastWinner = winner;
             playerScoreCount++;
             playerScore[playerScoreCount].style.backgroundColor = "green";
             if(playerScoreCount == 2 || aiScoreCount == 2){
              round.textContent = "YOU WIN PRO!";
              over.textContent = "Nice Game!";
        continueToNext.textContent = "Rematch";
        playWinSound();
        }

            resetGame();
            }, 400);
            lastWinner = winner;
      } else if (winner === "O") {
        setTimeout(() => {
      
                  gameboard.style.display = "none";
            alertMessage.style.display = "flex";
            round.textContent = "YOU LOSE THIS ROUND";
             round.style.color = "#ff004d";
             lastWinner = winner;
             aiScoreCount++;
             aiScore[aiScoreCount].style.backgroundColor = "green";
             if(playerScoreCount == 2 || aiScoreCount == 2){
              round.textContent = "YOU LOSE NOOB!";
              over.textContent = "Game over!.";
              continueToNext.textContent = "Rematch";
              playLoseSound();
      } 


            resetGame();
            }, 400);
           
      }
      
      return;
    }
  }

  if (!board.includes("")) {
    setTimeout(() => {
        gameboard.style.display = "none";
            alertMessage.style.display = "flex";
            round.textContent = "IT'S DRAW THIS ROUND";
            round.style.color = "yellow";
        resetGame();
        }, 400);
 
  }
}

function disableAllButtons() {
  buttons.forEach(button => button.disabled = true);
}
function enableAllButtons() {
  buttons.forEach(button => button.disabled = false);
}
function resetAll(){
    board = ["", "", "", "", "", "", "", "", ""];
    playerScoreCount = -1;
    aiScoreCount = -1; 
    flag = true;
    alertMessage.style.display = "none";
    
    continueToNext.textContent = "Continue to the next battle"
    over.textContent = "Get ready for the next battle.";
    playerScore.forEach(score => score.style.backgroundColor = "red");
    aiScore.forEach(score => score.style.backgroundColor = "red");
}
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  flag = (lastWinner === "X");

  buttons.forEach(button => {
    button.textContent = "";
    button.disabled = false;
  });


  if (!flag && currentMode === "O") {
    setTimeout(() => {
      makeRandomAIMove();
    }, 1000);
  }
}
function clearAllEventListeners() {
  const parent = buttons[0].parentNode;

  buttons.forEach(button => {
    const newButton = button.cloneNode(true);
    parent.replaceChild(newButton, button);
  });

  buttons = document.querySelectorAll(".cell");
}

function rematch(){
    gameboard.style.display = "grid";
    resetAll();
    resetGame();
    battleSound();
   
    if (mode) {
      vsPlayer();
    } else{
        vsAI();
    }
  
}
function battleSound() {
loseSound.pause();
loseSound.currentTime = 0;
gameOverSound.pause(); 
gameOverSound.currentTime = 0;
winSound.pause();
winSound.currentTime = 0;
bgMusic.loop = true;
bgMusic.volume = 0.5; 
bgMusic.play();
}
function playWinSound() {
   bgMusic.pause();
  bgMusic.currentTime = 0;
  winSound.play();
}

function playLoseSound() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
  gameOverSound.play();
  loseSound.play();
}


