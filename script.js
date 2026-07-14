// Page elements
const playerName = document.getElementById("playerName");
const difficulty = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const hintBtn = document.getElementById("hintBtn");
const restartBtn = document.getElementById("restartBtn");

const rangeText = document.getElementById("rangeText");
const attemptsText = document.getElementById("attemptsText");
const scoreText = document.getElementById("scoreText");
const feedbackText = document.getElementById("feedbackText");
const leaderboardList = document.getElementById("leaderboardList");

// Game variables
let secretNumber;
let maxNumber;
let attemptsLeft;
let score;

// Temporary leaderboard (later we'll save it with Node.js)
let leaderboard = [];

// Start game
startBtn.addEventListener("click", startGame);

function startGame() {
    const level = difficulty.value;

    // Levels
    if (level === "luck") {
        maxNumber = 10;
        attemptsLeft = 1;
        document.querySelector('.subtitle').textContent = "One guess. Numbers 1 to 10. Do you feel lucky?";
    }
    else if (level === "easy") {
        maxNumber = 50;
        attemptsLeft = 15;
        document.querySelector('.subtitle').textContent = "Guess the secret number!"; 
    }
    else if (level === "medium") {
        maxNumber = 100;
        attemptsLeft = 10;
        document.querySelector('.subtitle').textContent = "Guess the secret number!";
    }
    else {
        maxNumber = 200;
        attemptsLeft = 5;
        document.querySelector('.subtitle').textContent = "Guess the secret number!";
    }

    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    
    // Give higher score for a perfect single guess win in luck mode
    score = level === "luck" ? 100 : attemptsLeft * 10;

    rangeText.textContent = `Guess a number between 1 and ${maxNumber}`;
    attemptsText.textContent = `Attempts remaining: ${attemptsLeft}`;
    scoreText.textContent = `Score: ${score}`;
    feedbackText.textContent = "Game started! Make your first guess.";

    guessInput.disabled = false;
    guessBtn.disabled = false;
    
    // Disable hint button for luck
    hintBtn.disabled = level === "luck";

    guessInput.value = "";
    guessInput.focus();

    console.log(secretNumber); // Remove later if you don't want the answer shown
}

// Guess button
guessBtn.addEventListener("click", makeGuess);

function makeGuess() {
    const guess = Number(guessInput.value);

    if (!guess || guess < 1 || guess > maxNumber) {
        feedbackText.textContent = "Enter a valid number.";
        return;
    }

    attemptsLeft--;
    attemptsText.textContent = `Attempts remaining: ${attemptsLeft}`;

    if (guess === secretNumber) {
        if (difficulty.value === "luck") {
            feedbackText.textContent = "ABSOLUTE LEGEND! You guessed it :D";
            score = 100;
        } else {
            feedbackText.textContent = "🎉 Correct! You win!";
            score = attemptsLeft * 10 + 10;
        }
        
        scoreText.textContent = `Score: ${score}`;
        saveScore();

        guessBtn.disabled = true;
        hintBtn.disabled = true;
        return;
    }

    // Too low/high
    if (attemptsLeft > 0) {
        if (guess < secretNumber) {
            feedbackText.textContent = "Too low!";
        } else {
            feedbackText.textContent = "Too high!";
        }
        score = Math.max(0, score - 10);
    } 
    // Out of moves 
    else {
        if (difficulty.value === "luck") {
            feedbackText.textContent = `Unlucky! The number was ${secretNumber}. Try again!`;
        } else {
            feedbackText.textContent = `Game Over! The number was ${secretNumber}.`;
        }
        score = 0;
        guessBtn.disabled = true;
        hintBtn.disabled = true;
    }

    scoreText.textContent = `Score: ${score}`;
    guessInput.value = "";
    guessInput.focus();
}

// Hint button
hintBtn.addEventListener("click", function () {
    if (difficulty.value === "luck") return;

    if (secretNumber % 2 === 0) {
        feedbackText.textContent = "Hint: The number is EVEN.";
    }
    else {
        feedbackText.textContent = "Hint: The number is ODD.";
    }
});

// Restart
restartBtn.addEventListener("click", startGame);

// Save score (temporary)
function saveScore() {
    const name = playerName.value.trim() || "Anonymous";

    leaderboard.push({
        name: name,
        score: score
    });

    leaderboard.sort((a, b) => b.score - a.score);
    updateLeaderboard();
}

// Display leaderboard
function updateLeaderboard() {
    leaderboardList.innerHTML = "";

    leaderboard.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.name} - ${player.score}`;
        leaderboardList.appendChild(li);
    });
}