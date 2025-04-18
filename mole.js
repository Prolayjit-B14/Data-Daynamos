let score = 0;
let timeLeft = 30;  // Game timer in seconds
let gameActive = false;
let moles = ["smiling", "frowning"];
let currentMole = null;
let holes = document.querySelectorAll(".hole");
let scoreDisplay = document.getElementById("score");
let timerDisplay = document.getElementById("timer");
let startButton = document.getElementById("start-button");

function randomHole() {
    return holes[Math.floor(Math.random() * holes.length)];
}

function randomMole() {
    return moles[Math.floor(Math.random() * moles.length)];
}

function createMole() {
    let hole = randomHole();
    let moleType = randomMole();
    let mole = document.createElement("span");

    mole.textContent = moleType === "smiling" 
        ? "😊" 
        : "😞"; // Use emoji for smiling and frowning faces
    
    mole.classList.add("mole");
    hole.appendChild(mole);

    // Animation for popping out
    mole.style.animation = "popUp 0.5s ease-in-out forwards";

    mole.addEventListener("click", function () {
        if (moleType === "smiling") {
            score++;
            scoreDisplay.textContent = score;
        } else {
            score--;
            scoreDisplay.textContent = score;
        }

        mole.style.animation = "popOut 0.5s ease-in-out forwards"; // Mole disappears

        // Remove the mole after animation
        setTimeout(() => {
            mole.remove();
        }, 500);
    });

    // Hide mole after 1 second if not clicked
    setTimeout(() => {
        mole.style.animation = "popOut 0.5s ease-in-out forwards";
        setTimeout(() => mole.remove(), 500);
    }, 1000);
}

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    timeLeft = 30;
    timerDisplay.textContent = timeLeft;
    gameActive = true;

    let gameInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(gameInterval);
            alert("Game Over! Your final score is: " + score);
        } else {
            createMole();
        }
    }, 1500); // Mole appears every 1.5 seconds

    let timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameActive = false;
            alert("Game Over! Your final score is: " + score);
        } else {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
        }
    }, 1000); // Timer countdown every second
}

startButton.addEventListener("click", function () {
    if (!gameActive) {
        startGame();
        startButton.textContent = "Stop Game";
    } else {
        gameActive = false;
        startButton.textContent = "Start Game";
    }
});
