let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const statusText = document.getElementById("status");
const grid = document.getElementById("grid");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const playAgainBtn = document.getElementById("playAgainBtn");
const resetBtn = document.getElementById("resetBtn");

// =======================
// Confetti Setup
// =======================
const confettiCanvas = document.createElement("canvas");
confettiCanvas.id = "confetti-canvas";
document.body.appendChild(confettiCanvas);
const ctx = confettiCanvas.getContext("2d");

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let confettiParticles = [];

// =======================
// Board Functions
// =======================
function createBoard() {
    grid.innerHTML = "";
    board.forEach((cell, index) => {
        const btn = document.createElement("button");
        btn.classList.add("cell");
        btn.innerText = cell;
        btn.addEventListener("click", () => makeMove(index));
        grid.appendChild(btn);
    });
}

function makeMove(index) {
    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    createBoard();

    if (checkWinner()) {
        showPopup(`${currentPlayer} Wins! 🎉`, true);
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        showPopup("It's a Draw! 🤝", false);
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = "Turn: " + currentPlayer;
}

function checkWinner() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return wins.some(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.innerText = "Turn: X";
    createBoard();
}

// =======================
// Popup Functions
// =======================
function showPopup(message, confetti=false) {
    popupMessage.innerText = message;
    popup.classList.add("show");
    popup.classList.remove("hidden");

    if(confetti) startConfetti(3000);
}

function closePopup() {
    popup.classList.remove("show");
    resetGame();
}

// =======================
// Confetti Functions
// =======================
function createConfetti() {
    confettiParticles = [];
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 30 + 10,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
}

function drawConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
    });
    updateConfetti();
}

function updateConfetti() {
    confettiParticles.forEach(p => {
        p.tiltAngle += p.tiltAngleIncrement;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle) * 15;
    });
}

function startConfetti(duration=3000) {
    createConfetti();
    const confettiInterval = setInterval(drawConfetti, 16);
    setTimeout(() => {
        clearInterval(confettiInterval);
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }, duration);
}

// =======================
// Event Listeners
// =======================
playAgainBtn.addEventListener("click", closePopup);
resetBtn.addEventListener("click", resetGame);

// =======================
// Init
// =======================
createBoard();