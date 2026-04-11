from flask import Flask, render_template, request, redirect
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

# =======================
# 📧 EMAIL CONFIG
# =======================
EMAIL = "maynizam@gmail.com"
PASSWORD = os.environ.get("EMAIL_PASSWORD")

# =======================
# 💰 EXPENSE FILE
# =======================
FILE_NAME = "expenses.txt"

# =======================
# 🏠 HOME PAGE
# =======================
@app.route('/')
def home():
    return render_template('index.html')


# =======================
# 📜 CERT PAGE
# =======================
@app.route('/cert')
def cert():
    return render_template('cert.html')


# =======================
# 📞 CONTACT PAGE
# =======================
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    success = False

    if request.method == 'POST':
        try:
            name = request.form['name']
            user_email = request.form['email']
            message = request.form['message']

            reply_text = "Thank you for contacting PROJECT Z. We will get back to you soon!"

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

            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(EMAIL, PASSWORD)
            server.send_message(msg)

            # auto reply
            reply = MIMEMultipart()
            reply['From'] = EMAIL
            reply['To'] = user_email
            reply['Subject'] = "PROJECT Z - We received your message"
            reply.attach(MIMEText(reply_text, 'plain'))

            server.send_message(reply)
            server.quit()

            success = True

        except Exception as e:
            print("ERROR:", e)

    return render_template('contact.html', success=success)


# =======================
# 💰 EXPENSE PAGE (IMPORTANT FIX)
# =======================
@app.route('/expense')
def expense():
    expenses = []
    total = 0

    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as file:
            for i, line in enumerate(file):
                name, amount = line.strip().split(",")
                amount = float(amount)
                expenses.append((i, name, amount))
                total += amount

    return render_template("expence.html", expenses=expenses, total=total)


# =======================
# ➕ ADD EXPENSE
# =======================
@app.route('/add', methods=['POST'])
def add():
    name = request.form["name"]
    amount = request.form["amount"]

    with open(FILE_NAME, "a") as file:
        file.write(f"{name},{amount}\n")

    return redirect("/expense")


# =======================
# ❌ DELETE EXPENSE
# =======================
@app.route('/delete/<int:index>')
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


# =======================
# 🚀 RUN APP
# =======================
if __name__ == '__main__':
    app.run(debug=True)
