/** 
 * Code Overview:
 * This code implements the logic for a Tic-Tac-Toe game, allowing two players to take turns and play 
 * until a winner is determined or the game ends in a tie. It includes functionality for board creation, 
 * turn management, winner checking, game resetting, and updating user achievements.
 */

const board = document.getElementById("board");
const status = document.getElementById("status");
const startButton = document.getElementById("startButton");
const winnerMessage = document.getElementById("winnerMessage");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
const users = JSON.parse(localStorage.getItem("users"));
const currentUser = sessionStorage.getItem("currentUser");

/** 
 * checkWinner
 * Checks whether there is a winner based on predefined winning combinations on the game board. 
 * It returns the winning player ('X' or 'O') or "Tie" if no one has won, or null if the game is ongoing.
 */
function checkWinner() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return gameState[a];
    }
  }

  if (!gameState.includes("")) return "Tie";

  return null;
}

/** 
 * handleClick
 * Handles the player’s click on a board cell, updating the game state and checking for a winner or a tie. 
 * It updates the display, switches players, and stores the results in localStorage when the game ends.
 */
function handleClick(event) {
  const cell = event.target;
  const index = cell.dataset.index;

  if (!gameActive || gameState[index]) return;

  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  const winner = checkWinner();
  if (winner) {
    gameActive = false;
    setTimeout(() => {
      winnerMessage.textContent = winner === "Tie" ? "It's a tie!" : `Player ${winner} wins!`;
      winnerMessage.style.display = "block";
      setTimeout(() => winnerMessage.style.display = "none", 2000); 
      startButton.style.display = "inline-block"; 

      const userIndex = users.findIndex(u => u.username === currentUser);
      const achievements = users[userIndex].achievements; 

      let updatedAchievements;

      if (winner === 'X') {
        updatedAchievements = {
          ...achievements,
          tic_tac_toe: {
            sumGames: achievements.tic_tac_toe.sumGames + 1,
            wins: achievements.tic_tac_toe.wins + 1
          }
        };
      } 
      else {
        updatedAchievements = {
          ...achievements,
          tic_tac_toe: {
            sumGames: achievements.tic_tac_toe.sumGames + 1,
            wins: achievements.tic_tac_toe.wins
          }
        };
      }

      users[userIndex] = {
        ...users[userIndex],
        achievements: updatedAchievements
      };
      
      localStorage.setItem("users", JSON.stringify(users)); 
    }, 300);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Player ${currentPlayer}'s turn`;
  }
}

/** 
 * createBoard
 * Creates the Tic-Tac-Toe game board dynamically, initializing the game state and hiding the start button. 
 * It also sets the status message to indicate which player's turn it is.
 */
function createBoard() {
  board.innerHTML = "";
  gameState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = false;
  startButton.style.display = "none"; 

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
  status.textContent = `Player ${currentPlayer}'s turn`; 
}

/** 
 * Event Listeners
 * 1. "click" event listener for the start button to begin a new game.
 * 2. "click" event listeners for each cell in the Tic-Tac-Toe board to handle player actions during the game.
 */
startButton.addEventListener("click", () => {
  createBoard();
  gameActive = true;
});

createBoard();

startButton.style.display = "inline-block"; 

console.log(users);
console.log(sessionStorage);