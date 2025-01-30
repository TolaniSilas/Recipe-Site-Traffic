from flask import Flask


app = Flask(__name__, template_folder="templates")


@app.route("/", methods=["GET", "POST"])
def hello_world():
    return "<p>Hello World!</p>"

