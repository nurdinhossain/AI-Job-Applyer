from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3 

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