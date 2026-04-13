from flask import Flask, render_template, request
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

app = Flask(__name__)

# 📧 EMAIL CONFIG
EMAIL = "maynizam15@gmail.com"
PASSWORD = os.environ.get("EMAIL_PASSWORD")  # 🔐 Set in CMD

# ✅ HOME PAGE
@app.route('/')
def home():
    return render_template('index.html')


# ✅ CERTIFICATE PAGE
@app.route('/cert')
def cert():
    return render_template('cert.html')


# ✅ CONTACT PAGE
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    success = False
    error = None

    if request.method == 'POST':
        try:
            name = request.form.get('name')
            user_email = request.form.get('email')
            message = request.form.get('message')

            # 🛑 VALIDATION
            if not name or not user_email or not message:
                error = "All fields are required!"
                return render_template('contact.html', success=success, error=error)

            if not PASSWORD:
                error = "Email password not set in environment variables!"
                return render_template('contact.html', success=success, error=error)

            # 📧 MESSAGE TO YOU
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

            # 📧 AUTO REPLY MESSAGE
            reply = MIMEMultipart()
            reply['From'] = EMAIL
            reply['To'] = user_email
            reply['Subject'] = "PROJECT Z - Message Received"

            reply_text = "Thank you for contacting PROJECT Z. We will get back to you soon!"
            reply.attach(MIMEText(reply_text, 'plain'))

            # 🔌 CONNECT TO SMTP
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(EMAIL, PASSWORD)

            # SEND BOTH EMAILS
            server.send_message(msg)
            server.send_message(reply)

            server.quit()

            success = True

        except Exception as e:
            print("ERROR:", e)
            error = "Failed to send message. Please try again later."

    return render_template('contact.html', success=success, error=error)


# ✅ RUN APP
if __name__ == '__main__':
    app.run(debug=True)
