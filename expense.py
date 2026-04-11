from flask import Flask, render_template, request, redirect
import os

app = Flask(__name__)

FILE_NAME = "expenses.txt"

# ✅ HOME
@app.route("/")
def home():
    return render_template("index.html")


# ✅ EXPENSE PAGE
@app.route("/expense")   # ✅ FIXED spelling
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

    return render_template("expense.html", expenses=expenses, total=total)  # ✅ FIXED file name


# ✅ ADD EXPENSE
@app.route("/add", methods=["POST"])
def add():
    name = request.form["name"]
    amount = request.form["amount"]

    with open(FILE_NAME, "a") as file:
        file.write(f"{name},{amount}\n")

    return redirect("/expense")   # ✅ FIXED


# ✅ DELETE EXPENSE
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

    return redirect("/expense")   # ✅ FIXED


if __name__ == "__main__":
    app.run(debug=True)
