from flask import Flask, render_template, request
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

# 📧 YOUR EMAIL CONFIG
EMAIL = "maynizam15@gmail.com"
PASSWORD = "uctdlfyzmbajyfjy"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/cert')
def cert():
    return render_template('cert.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    success = False

    if request.method == 'POST':
        try:
            name = request.form['name']
            user_email = request.form['email']
            message = request.form['message']

            # ✅ STATIC REPLY (NO API)
            reply_text = "Thank you for contacting PROJECT Z. We will get back to you soon!"

            # 📧 EMAIL TO YOU
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

            # 📧 AUTO REPLY
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

if __name__ == '__main__':
    app.run(debug=True)
