from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os 
import sqlite3 
import requests

load_dotenv()
ai_key = os.getenv('GROQ_KEY')

headers = {
    "Authorization": "Bearer {}".format(ai_key),
    "Content-Type": "application/json"
}

payload = {
    "model": "llama3-70b-8192",  # or mixtral
    "messages": [
        {"role": "user", "content": "Pretend you're a linux terminal, starting now."}
    ]
}

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Home page!'

@app.route('/data', methods=['GET', 'POST'])
def data():
    if request.method == 'POST':
        data = request.get_json()
        link = data.get('link')
        directions = data.get('directions')
        if not link or not directions:
            return "Missing fields", 400
        try:
            with sqlite3.connect('database.db') as conn:
                conn.execute('INSERT INTO SITES (link, instructions, visited) VALUES (?, ?, 0)', (link, directions))
            return "Site added successfully"
        except sqlite3.IntegrityError:
            return "Link already exists", 409
    else:
        visited = request.args.get('visited', default='0')
        with sqlite3.connect('database.db') as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT link, instructions FROM SITES WHERE visited = ?', (visited,))
            results = [{"link": r[0], "instructions": r[1]} for r in cursor.fetchall()]
        
        print("hehe")
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
        print(response.json()["choices"][0]["message"]["content"])

        return jsonify(results)
    
@app.route('/visit', methods=['POST'])
def mark_visited():
    data = request.get_json()
    link = data.get('link')
    with sqlite3.connect('database.db') as conn:
        conn.execute('UPDATE SITES SET visited = 1 WHERE link = ?', (link,))
    return "Marked as visited"

if __name__ == "__main__":
    with sqlite3.connect('database.db') as conn:
        conn.execute('CREATE TABLE IF NOT EXISTS SITES (link TEXT UNIQUE, instructions TEXT, visited INTEGER)')
    app.run(debug=True)