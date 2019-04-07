from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/services/{{ service }}/")
def index():
    return jsonify(name="{{ Service }}")
