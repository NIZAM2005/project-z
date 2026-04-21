let originalTextGlobal = "";

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("fileInput").addEventListener("change", function () {
        let file = this.files[0];

        if (!file) return;

        let formData = new FormData();
        formData.append("file", file);

        document.getElementById("output").innerText = "⏳ Processing...";

        fetch("/upload", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => displayResult(data.summary))
        .catch(err => {
            console.error(err);
            document.getElementById("output").innerText = "❌ Upload error";
        });
    });

});

function summarizeText() {
    let text = document.getElementById("inputText").value;

    if (!text.trim()) {
        alert("Enter text!");
        return;
    }

    originalTextGlobal = text;

    document.getElementById("output").innerText = "⏳ Summarizing...";

    fetch("/summarize", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text: text })
    })
    .then(res => res.json())
    .then(data => displayResult(data.summary))
    .catch(err => {
        console.error(err);
        document.getElementById("output").innerText = "❌ Error occurred";
    });
}

function triggerFile() {
    document.getElementById("fileInput").click();
}

function displayResult(summary) {
    document.getElementById("output").innerText = summary || "No summary generated";

    let originalWords = originalTextGlobal.trim()
        ? originalTextGlobal.split(/\s+/).length
        : 0;

    let summaryWords = summary && summary.trim()
        ? summary.split(/\s+/).length
        : 0;

    let reduction = originalWords > 0
        ? ((originalWords - summaryWords) / originalWords * 100).toFixed(1)
        : 0;

    document.getElementById("stats").innerText =
        `Original: ${originalWords} | Summary: ${summaryWords} | Reduced: ${reduction}%`;
}

function copyText() {
    let text = document.getElementById("output").innerText;
    navigator.clipboard.writeText(text);
    alert("Copied!");
}