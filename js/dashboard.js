/** 
 * Code Overview:
 * This code manages user data and achievements for a gaming platform. It retrieves user data from 
 * localStorage and sessionStorage, updates personalized and global achievements on the webpage, 
 * and handles dynamic content updates when the page loads.
 */


const users = JSON.parse(localStorage.getItem("users"));

/** 
 * getUserData
 * Retrieves the currently logged-in user's data from sessionStorage and matches it with the users 
 * stored in localStorage. Alerts the user if no current user is logged in or if the user is not found.
 * @returns {Object|null} The user object or null if no user is found.
 */
function getUserData() {
    const currentUser = sessionStorage.getItem("currentUser");
    if (!currentUser) {
      alert("No user is currently logged in!");
      return null;
    }

    const user = users.find((u) => u.username === currentUser);

    if (!user) {
      alert("User not found in localStorage!");
      return null;
    }
  
    return user;
  }
  
  /** 
   * updateAchievements
   * Updates the webpage with the current user's achievements. This includes displaying a greeting 
   * with the user's name and their performance in two games: "Falling Stars" and "Tic Tac Toe."
   */
  function updateAchievements() {
    const user = getUserData();
    if (!user) return;

    const helloUserElement = document.getElementById("hello-user");
    helloUserElement.textContent = `Hello, ${user.username}! Welcome to your personal area! Here, you can view your achievements and those of others.`;

    const { fallingItems, tic_tac_toe } = user.achievements;

    document.getElementById("Falling-Stars-total").textContent = `Total Games Played: ${fallingItems.sumGames}`;
    document.getElementById("Falling-Stars-high-score").textContent = `High Score: ${fallingItems.HighScore}`;
  
    document.getElementById("Tic-Tac-Toe-total").textContent = `Total Games Played: ${tic_tac_toe.sumGames}`;
    document.getElementById("Tic-Tac-Toe-wins").textContent = `Wins: ${tic_tac_toe.wins}`;
  }

    /** 
   * updateGlobalAchievements
   * Updates the webpage with global achievements across all users. Finds and displays the top player 
   * and highest scores for "Falling Stars" and "Tic Tac Toe" games. Displays default messages if no 
   * data is available.
   */
  function updateGlobalAchievements(){
      let topFallingStarsUser = null;
      let topFallingStarsScore = 0;

      users.forEach((user) => {
        const { fallingItems } = user.achievements || {};
        if (fallingItems && fallingItems.HighScore >= topFallingStarsScore) {
          topFallingStarsUser = user.username;
          topFallingStarsScore = fallingItems.HighScore;
        }
      });

      if (topFallingStarsUser) {
        document.getElementById("Falling-Stars-name").textContent = `Top Player: ${topFallingStarsUser}`;
        document.getElementById("Falling-Stars-high-score-global").innerHTML = `High Score: ${topFallingStarsScore}`;
      }

      let topTicTacToeUser = null;
      let topTicTacToeWins = 0;

      users.forEach((user) => {
        const { tic_tac_toe } = user.achievements || {};
        if (tic_tac_toe && tic_tac_toe.wins >= topTicTacToeWins) {
          topTicTacToeUser = user.username;
          topTicTacToeWins = tic_tac_toe.wins;
        }
      });

      if (topTicTacToeUser) {
        document.getElementById("Tic-Tac-Toe-name").textContent = `Top Player: ${topTicTacToeUser}`;
        document.getElementById("Tic-Tac-Toe-wins-global").innerHTML = `Wins: ${topTicTacToeWins}`;
      } else {
        document.getElementById("Tic-Tac-Toe-name").textContent = "Top Player: N/A";
        document.getElementById("Tic-Tac-Toe-wins-global").textContent = "Wins: N/A";
      }

  }
  
  /** 
 * Event: DOMContentLoaded
 * Triggers the `updateAchievements` and `updateGlobalAchievements` functions once the webpage 
 * has fully loaded, ensuring that the user and global achievement data are displayed correctly.
 */
  document.addEventListener("DOMContentLoaded", updateAchievements);
  document.addEventListener("DOMContentLoaded", updateGlobalAchievements);
  
console.log(users);
console.log(sessionStorage);