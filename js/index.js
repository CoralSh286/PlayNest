/** @format */

/** 
 * This script implements a user authentication system with the following features:
 * - Dynamic rendering of login and signup forms.
 * - User data management using localStorage and sessionStorage.
 * - Real-time alerts for user feedback.
 * - Password validation and a lockout mechanism after three failed login attempts.
 * 
 * The script provides a seamless interface for user registration and login,
 * including transition handling between forms and navigation to a different page upon success.
 */

const Utils = {

    /** 
   * Utils.ElementCreator
   * This function dynamically creates an HTML element, sets its attributes and text, 
   * and appends it to a specified parent element. It simplifies the creation and customization 
   * of HTML elements within the DOM.
   */
  ElementCreator: function ({ id = null, tag, text = "", father, attr = {} }) {
    const elem = document.createElement(tag);
    id ? (elem.id = id) : null;
    elem.innerText = text;
    if (typeof father == "string") {
      document.getElementById(father).appendChild(elem);
    } else {
      father.appendChild(elem);
    }

    for (let k in attr) {
      elem[k] = attr[k];
    }
    return elem;
  },

    /** 
   * Utils.Alert
   * This function creates and displays a temporary alert message over the page. 
   * The alert can automatically disappear after a specified timeout or be manually removed.
   */
  Alert: function ({ text = "", setTimeOut = false }) {
    const body = document.body;
    const cover = Utils.ElementCreator({
      tag: "div",
      father: body,
      attr: {
        className: "coverPage",
        innerHTML: `<div class="alert-message-container">
        ${text}</div>`,
      },
    });
    if (setTimeOut) {
      setTimeout(() => cover.remove(), setTimeOut);
    }
    return () => cover.remove();
  },

};

const wrapper = document.getElementById("wrapper");
const pattern = !true ? `pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$"` : "";

const login = `<form id="loginForm">
            <h1>Login</h1>
            <div class="input-box">
              <input id="loginUsername" type="text" placeholder="Username" required />
              <i class="bx bxs-user"></i>
            </div>
            <div class="input-box">
              <input id="loginPassword" type="password" placeholder="Password"
              required 
               ${pattern}
              title="The password must contain at least one uppercase letter, one lowercase letter, and one number" />
              <i class="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" class="btn">Login</button>
            <div class="register-link">
              <p>
                don't have an account?
                <a id="to-signUp">Sign up</a>
              </p>
            </div>
          </form>`;

const signup = `<form id="signupForm">
            <h1>Sign Up</h1>
            <div class="input-box">
              <input id="signupUsername" type="text" placeholder="Username" required />
              <i class="bx bxs-user"></i>
            </div>
            <div class="input-box">
              <input id="signupEmail" type="text" placeholder="Email" required />
              <i class='bx bxl-gmail'></i>
            </div>
            <div class="input-box">
              <input id="signupPassword" type="password" placeholder="Password"
               required
                 ${pattern}
               title="The password must contain at least one uppercase letter, one lowercase letter, and one number" />
              <i class="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" class="btn">Sign Up</button>
            <div class="register-link">
              <p>
                already have an account?
                <a id="to-login">Login</a>
              </p>
            </div>
          </form>`;

wrapper.innerHTML = login;

/** 
 * Event: Click Listener
 * This event listener switches between the login and signup forms when the respective links 
 * ("Sign up" or "Login") are clicked by the user.
 */
document.addEventListener("click", (e) => {
  if (e.target.id == "to-signUp") {
    wrapper.innerHTML = signup;
  }
  if (e.target.id == "to-login") {
    wrapper.innerHTML = login;
  }
});


const users = JSON.parse(localStorage.getItem("users")) || [];
let loginAttempts = 0;


/** 
 * Event: Submit Listener (Signup)
 * This event listener handles user registration. It checks if the username already exists, 
 * saves new user data to localStorage, sets the current user in sessionStorage, and provides 
 * feedback through alerts. If successful, it redirects the user to a games page.
 */
document.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.id === "signupForm") {
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    let achievements = {
      fallingItems: { sumGames: 0, HighScore: 0 },
      tic_tac_toe: { sumGames: 0, wins: 0 },
    };

    if (users.some((user) => user.username === username)) {
      Utils.Alert({ text: "User already exist!", setTimeOut: 3000 });
    } else {
      users.push({ username, email, password, achievements});
      localStorage.setItem("users", JSON.stringify(users)); 
      sessionStorage.setItem("currentUser", username);
      Utils.Alert({ text: "User registered successfully!"});
      setTimeout(() => {
        window.location.href = "html/games.html";
      }, 2000);
    }
  }
});
  

/** 
 * Event: Submit Listener (Login)
 * This event listener handles user login by validating the entered credentials against stored 
 * user data in localStorage. It provides feedback for success or failure and blocks the user 
 * for 5 minutes after three failed login attempts.
 */
document.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.id === "loginForm") {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    if (document.cookie.includes("blocked=true")) {
      Utils.Alert({ text: "Too many failed login attempts. Please try again later." ,setTimeOut: 3000 });
      return;
    }

    const user = users.find(
      (user) => user.username === username && user.password === password);
    if (user) {
      sessionStorage.setItem("currentUser", username);
      const remove = Utils.Alert({ text: "Login successful!" });
      setTimeout(() => {
        remove();
        window.location.href = "html/games.html";
      }, 2000);
      loginAttempts = 0; 
    } else {
      loginAttempts++;
      Utils.Alert({ text: `Incorrect username or password. Attempt ${loginAttempts}/3` ,setTimeOut: 3000 });

      if (loginAttempts >= 3) {
        document.cookie = "blocked=true; max-age=300"; 
        Utils.Alert({ text: "Too many failed attempts. You are blocked for 5 minutes." ,setTimeOut: 3000 });
      }
    }
  }
});

// localStorage.clear();
console.log(users);
console.log(sessionStorage);
