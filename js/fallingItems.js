/** 
 * Code Overview:
 * This code handles the logic for a falling items game where the player controls a catcher to 
 * catch falling items. It includes difficulty selection, game start, item creation, score tracking, 
 * life management, and updating user achievements when the game ends.
 */

const gameContainer = document.getElementById("game-container");
const catcher = document.getElementById("catcher");
const scoreboard = document.getElementById("scoreboard");
const lives = document.getElementById("lives").children;
const startButton = document.getElementById("start-button");
const gameOverMessage = document.getElementById("game-over");
const difficultyButtons = document.querySelectorAll(".difficulty-button");

let score = 0;
let gameSpeed = 2000;
let missCount = 0;
let gameInterval;
let baseGameSpeed = 2000; 
let fallIntervals = []; 

const users = JSON.parse(localStorage.getItem("users"));
const currentUser = sessionStorage.getItem("currentUser");

/** 
 * Difficulty Selection
 * When a difficulty button is clicked, it sets the game speed accordingly and displays the start button 
 * while hiding the difficulty selection buttons.
 */
difficultyButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (button.id === "easy-button") {
      baseGameSpeed = 3000; 
    } else if (button.id === "medium-button") {
      baseGameSpeed = 2000;
    } else if (button.id === "hard-button") {
      baseGameSpeed = 1500; 
    }

    document.getElementById("difficulty-buttons").style.display = "none";
    startButton.style.display = "block";
  });
});


/** 
 * startGame
 * Starts a new game by resetting the score, missed items, and lives, and begins the process of creating 
 * falling items. The game speed is gradually increased as the game progresses.
 */
function startGame() {
  score = 0;
  missCount = 0;
  gameSpeed = baseGameSpeed;

  scoreboard.textContent = `Score: ${score}`;
  for (let heart of lives) {
    heart.style.visibility = "visible";
  }

  startButton.style.display = "none";
  gameOverMessage.style.display = "none";

  if (gameInterval) {
    clearInterval(gameInterval);
  }

  fallIntervals.forEach(interval => clearInterval(interval));
  fallIntervals = [];

  gameInterval = setInterval(() => {
    createItem();
    gameSpeed *= 0.95;
  }, gameSpeed);
}


/** 
 * createItem
 * Creates a new item that falls from a random position at the top of the screen. It checks for collisions 
 * with the catcher and updates the score if an item is caught. If an item reaches the bottom without being 
 * caught, it is missed, and a life is lost.
 */
function createItem() {
  if (missCount === 3) {
    return;
  }

  const item = document.createElement("div");
  item.classList.add("item");
  item.style.left = `${Math.random() * (window.innerWidth - 20)}px`;
  gameContainer.appendChild(item);

  let fallInterval = setInterval(() => {
    const itemRect = item.getBoundingClientRect();
    const catcherRect = catcher.getBoundingClientRect();

    item.style.top = `${item.offsetTop + 5}px`;

    if (
      itemRect.bottom >= catcherRect.top &&
      itemRect.left < catcherRect.right &&
      itemRect.right > catcherRect.left
    ) {
      gameContainer.removeChild(item);
      score++;
      scoreboard.textContent = `Score: ${score}`;
      clearInterval(fallInterval);
    } 
    else if (itemRect.bottom > window.innerHeight) {
      gameContainer.removeChild(item);
      missCount++;

      if (missCount <= lives.length) {
        lives[missCount - 1].style.visibility = "hidden";
      } else {
        console.warn("Miss count exceeded available lives, ignoring further updates.");
      }

      clearInterval(fallInterval);

      if (missCount === 3) {
        endGame();
      }
    }
  }, 20);

  fallIntervals.push(fallInterval);
}


/** 
 * endGame
 * Ends the game when the player misses 3 items, displays the game over message, and updates the user’s 
 * achievements (including the high score) in localStorage.
 */
function endGame() {
  gameOverMessage.style.display = "block";
  document.getElementById("difficulty-buttons").style.display = "flex";

  clearInterval(gameInterval);

  const items = document.querySelectorAll(".item");
  items.forEach(item => gameContainer.removeChild(item));

  const userIndex = users.findIndex(u => u.username === currentUser);

  const currentAchievements = users[userIndex].achievements.fallingItems;

  const updatedAchievements = {
    ...currentAchievements,
    sumGames: currentAchievements.sumGames + 1,
    HighScore: Math.max(currentAchievements.HighScore, score) // עדכון השיא
  };

  users[userIndex] = {
    ...users[userIndex],
    achievements: {
      ...users[userIndex].achievements,
      fallingItems: updatedAchievements
    }
  };

  localStorage.setItem("users", JSON.stringify(users)); 
}

/** 
 * moveCatcher
 * Moves the catcher left or right based on the player's keyboard input (ArrowLeft or ArrowRight). The catcher 
 * is constrained within the width of the game window.
 */
function moveCatcher(event) {
  const catcherRect = catcher.getBoundingClientRect();
  if (event.key === "ArrowLeft" && catcherRect.left > 0) {
    catcher.style.left = `${catcher.offsetLeft - 20}px`;
  }
  if (event.key === "ArrowRight" && catcherRect.right < window.innerWidth) {
    catcher.style.left = `${catcher.offsetLeft + 20}px`;
  }
}

/** 
 * Event Listeners
 * 1. "keydown" event to move the catcher based on user input.
 * 2. "click" event on the start button to begin the game.
 */
document.addEventListener("keydown", moveCatcher);
startButton.addEventListener("click", startGame);

console.log(users);
