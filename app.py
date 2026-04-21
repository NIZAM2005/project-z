from flask import Flask, render_template, request, redirect, url_for, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# ✅ SUMMARIZER IMPORTS
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
import heapq
import PyPDF2
import docx

app = Flask(__name__)

# 📧 EMAIL CONFIG
EMAIL = "maynizam15@gmail.com"
PASSWORD = os.environ.get("EMAIL_PASSWORD")

# 💰 EXPENSE FILE
FILE_NAME = "expenses.txt"

# 🔥 SETUP NLTK
def setup_nltk():
    try:
        nltk.data.find('tokenizers/punkt')
    except:
        nltk.download('punkt')

    try:
        nltk.data.find('corpora/stopwords')
    except:
        nltk.download('stopwords')

setup_nltk()

# 🧠 SUMMARIZER FUNCTION
def summarize_text(text):
    if not text.strip():
        return "Enter text."

    stop_words = set(stopwords.words("english"))

    words = word_tokenize(text.lower())
    freq = {}

    for word in words:
        if word.isalnum() and word not in stop_words:
            freq[word] = freq.get(word, 0) + 1

    sentences = sent_tokenize(text)
    scores = {}

    for sent in sentences:
        for word in word_tokenize(sent.lower()):
            if word in freq:
                scores[sent] = scores.get(sent, 0) + freq[word]

    top_sentences = heapq.nlargest(min(3, len(sentences)), scores, key=scores.get)

    if not top_sentences:
        return "Not enough content to summarize."

    return " ".join(top_sentences)

# 🏠 HOME PAGE
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")

# ❌ REMOVED GAME → ✅ SUMMARIZER PAGE
@app.route("/summarizer")
def summarizer_page():
    return render_template("summarizer.html")

@app.route("/speed")
def speed():
    return render_template("speed.html")

@app.route("/front")
def front():
    return render_template("front.html")

@app.route("/login")
def login():
    return render_template("login.html")

# 📜 CERTIFICATE PAGE
@app.route("/cert")
def cert():
    return render_template("cert.html")

# 📩 CONTACT PAGE
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    success = False
    error = None

    if request.method == 'POST':
        try:
            name = request.form.get('name')
            user_email = request.form.get('email')
            message = request.form.get('message')

            if not name or not user_email or not message:
                error = "All fields are required!"
                return render_template('contact.html', success=success, error=error)

            if not PASSWORD:
                error = "Email password not set!"
                return render_template('contact.html', success=success, error=error)

            msg = MIMEMultipart()
            msg['From'] = EMAIL
            msg['To'] = EMAIL
            msg['Subject'] = f"New Message from {name}"

            body = f"""
Name: {name}
Email: {user_email}

Message:
{message}
"""
            msg.attach(MIMEText(body, 'plain'))

            reply = MIMEMultipart()
            reply['From'] = EMAIL
            reply['To'] = user_email
            reply['Subject'] = "PROJECT Z - Message Received"

            reply_text = "Thank you for contacting PROJECT Z. We will get back to you soon!"
            reply.attach(MIMEText(reply_text, 'plain'))

            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(EMAIL, PASSWORD)

            server.send_message(msg)
            server.send_message(reply)

            server.quit()

            success = True

        except Exception as e:
            print("ERROR:", e)
            error = "Failed to send message."

    return render_template('contact.html', success=success, error=error)

# 💰 EXPENSE PAGE
@app.route("/expense")
def expense():
    expenses = []
    total = 0
    category_totals = {}

    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as file:
            for i, line in enumerate(file):
                parts = line.strip().split(",")

                if len(parts) == 2:
                    name, amount = parts
                    category = "Other"
                    date = "N/A"
                elif len(parts) == 3:
                    name, amount, category = parts
                    date = "N/A"
                else:
                    name, amount, category, date = parts

                try:
                    amount = float(amount)
                except:
                    amount = 0

                expenses.append((i, name, amount, category, date))
                total += amount

                if category in category_totals:
                    category_totals[category] += amount
                else:
                    category_totals[category] = amount

    return render_template(
        "expense.html",
        expenses=expenses,
        total=total,
        category_data=category_totals
    )

# ➕ ADD EXPENSE
@app.route("/add", methods=["POST"])
def add():
    name = request.form.get("name")
    amount = request.form.get("amount")
    category = request.form.get("category", "Other")
    date = request.form.get("date")

    if not name or not amount:
        return redirect("/expense")

    with open(FILE_NAME, "a") as file:
        file.write(f"{name},{amount},{category},{date}\n")

    return redirect("/expense")

# ❌ DELETE EXPENSE
@app.route("/delete/<int:index>")
def delete(index):
    if not os.path.exists(FILE_NAME):
        return redirect("/expense")

    with open(FILE_NAME, "r") as file:
        lines = file.readlines()

    if 0 <= index < len(lines):
        lines.pop(index)

    with open(FILE_NAME, "w") as file:
        file.writelines(lines)

    return redirect("/expense")

# 🔥 TEXT SUMMARIZE API
@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        data = request.get_json()
        text = data.get("text", "")

        summary = summarize_text(text)
        return jsonify({"summary": summary})

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"summary": f"Error: {str(e)}"})

# 📂 FILE UPLOAD SUMMARY
@app.route("/upload", methods=["POST"])
def upload():
    try:
        file = request.files["file"]
        text = ""

        if file.filename.endswith(".pdf"):
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() or ""

        elif file.filename.endswith(".docx"):
            doc = docx.Document(file)
            for para in doc.paragraphs:
                text += para.text

        summary = summarize_text(text)
        return jsonify({"summary": summary})

    except Exception as e:
        print("❌ UPLOAD ERROR:", e)
        return jsonify({"summary": f"Error: {str(e)}"})

# 🚀 RUN APP
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
