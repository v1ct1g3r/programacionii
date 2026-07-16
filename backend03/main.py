from flask import Flask
import json

app = Flask(__name__)

@app.route('/')
def index():
    return "Welcome to the Flask API"

@app.route('/suma')
def suma():
    r = 9 + 9
    return str(r)

if __name__ == '__main__':
    app.run(debug=True)