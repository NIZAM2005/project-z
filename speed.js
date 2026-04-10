const sentences = [
    "Practice makes perfect",
    "Python is easy to learn",
    "Typing speed improves with time",
    "Stay focused and keep coding",
    "Consistency is the key to success"
];

let startTime = null;
let timer = null;
let isRunning = false;

// pick random sentence
function newSentence() {
    return sentences[Math.floor(Math.random() * sentences.length)];
}

document.getElementById("sentence").innerText = newSentence();

window.onload = function () {
    document.getElementById("input").addEventListener("input", startTest);
};

function startTest() {
    let input = document.getElementById("input").value;
    let sentence = document.getElementById("sentence").innerText;

    if (!isRunning) {
        startTime = new Date();

        timer = setInterval(() => {
            let time = Math.floor((new Date() - startTime) / 1000);
            document.getElementById("time").innerText = time;
        }, 1000);

        isRunning = true;
    }

    calculateResults();

    if (input.trim() === sentence.trim()) {
        clearInterval(timer);
        isRunning = false;
    }
}

function calculateResults() {
    let input = document.getElementById("input").value.trim();
    let sentence = document.getElementById("sentence").innerText.trim();

    let timeElapsed = (new Date() - startTime) / 60000;
    if (!timeElapsed || timeElapsed <= 0) timeElapsed = 1 / 60;

    let words = input.length > 0 ? input.split(/\s+/).length : 0;
    let wpm = Math.round(words / timeElapsed);

    document.getElementById("speed").innerText = wpm;

    let correct = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] === sentence[i]) correct++;
    }

    let accuracy = input.length > 0
        ? Math.round((correct / input.length) * 100)
        : 0;

    document.getElementById("accuracy").innerText = accuracy;
}

function resetTest() {
    clearInterval(timer);
    startTime = null;
    isRunning = false;

    document.getElementById("input").value = "";
    document.getElementById("time").innerText = "0";
    document.getElementById("speed").innerText = "0";
    document.getElementById("accuracy").innerText = "0";

    document.getElementById("sentence").innerText = newSentence();
}