const sentences = [
    "Practice typing to improve your speed and accuracy",
    "Flask makes web development simple and powerful",
    "Consistency is the key to mastering any skill"
];

let currentSentence = "";
let startTime = null;
let timerInterval = null;

const sentenceEl = document.getElementById("sentence");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const speedEl = document.getElementById("speed");
const accuracyEl = document.getElementById("accuracy");

/* 🏆 SAVE SCORE */
function saveScore(wpm) {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    scores.push(wpm);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 5);

    localStorage.setItem("scores", JSON.stringify(scores));
}

/* 🏆 DISPLAY LEADERBOARD */
function displayLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    if (!list) return;

    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    list.innerHTML = "";

    scores.forEach((score, index) => {
        const li = document.createElement("li");
        li.textContent = `#${index + 1} - ${score} WPM`;
        list.appendChild(li);
    });
}

/* 🧠 LOAD SENTENCE */
function loadSentence() {
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];

    sentenceEl.innerHTML = currentSentence
        .split("")
        .map(letter => `<span>${letter}</span>`)
        .join("");

    inputEl.value = "";
    timeEl.textContent = 0;
    speedEl.textContent = 0;
    accuracyEl.textContent = 0;

    startTime = null;
    clearInterval(timerInterval);

    setActiveLetter(0);
}

/* 👉 ACTIVE CURSOR */
function setActiveLetter(index) {
    const spans = sentenceEl.querySelectorAll("span");

    spans.forEach(span => span.classList.remove("active"));

    if (spans[index]) {
        spans[index].classList.add("active");
    }
}

/* ⌨️ INPUT HANDLER */
inputEl.addEventListener("input", () => {
    const input = inputEl.value.split("");
    const letters = sentenceEl.querySelectorAll("span");

    let correct = 0;

    letters.forEach((span, index) => {
        const typedChar = input[index];

        if (typedChar == null) {
            span.classList.remove("correct", "wrong");
        } 
        else if (typedChar === span.innerText) {
            span.classList.add("correct");
            span.classList.remove("wrong");
            correct++;
        } 
        else {
            span.classList.add("wrong");
            span.classList.remove("correct");
        }
    });

    // 👉 Move cursor
    setActiveLetter(input.length);

    // ⏱ Start timer once
    if (!startTime && input.length > 0) {
        startTime = new Date();
        timerInterval = setInterval(updateTime, 1000);
    }

    // 🎯 Accuracy
    const accuracy = Math.round((correct / input.length) * 100) || 0;
    accuracyEl.textContent = accuracy;

    // ⚡ WPM
    const timeElapsed = (new Date() - startTime) / 1000 / 60;
    const words = input.length / 5;
    const wpm = Math.round(words / timeElapsed) || 0;
    speedEl.textContent = wpm;

    // ✅ Finished
    if (input.join("") === currentSentence) {
        clearInterval(timerInterval);

        const finalWPM = parseInt(speedEl.textContent);
        saveScore(finalWPM);
        displayLeaderboard();
    }
});

/* ⏱ TIMER */
function updateTime() {
    const time = Math.floor((new Date() - startTime) / 1000);
    timeEl.textContent = time;
}

/* 🔄 RESET */
function resetTest() {
    loadSentence();
}

/* 🚀 INIT */
loadSentence();
displayLeaderboard();