from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os 
import sqlite3 
import requests

# load flask appp
app = Flask(__name__)
CORS(app)

# load environment variables
load_dotenv()
ai_key = os.getenv('GROQ_KEY')

# folder to save uploaded files temporarily
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

headers = {
    "Authorization": "Bearer {}".format(ai_key),
    "Content-Type": "application/json"
}

payload = {
    "model": "llama3-70b-8192",  
    "messages": [
        {"role": "user", "content": "Pretend you're a linux terminal, starting now."}
    ]
}

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
    
@app.route('/crawl', methods=['POST'])
def crawl():
    # Get the uploaded file
    resume_file = request.files.get('resume')
    directions = request.form.get('directions')

    if not resume_file:
        return jsonify({"error": "No resume file uploaded"}), 400
    if not directions:
        return jsonify({"error": "Directions field is required"}), 400

    # Save the file temporarily
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], resume_file.filename)
    resume_file.save(file_path)

    # Now you can process the file and directions however you want
    # For example, pass to your crawler or AI service...

    # Dummy response for example:
    response = {
        "message": "Crawl started",
        "filename": resume_file.filename,
        "directions": directions
    }

    # Optionally, remove the file after processing if you don't need to keep it
    # os.remove(file_path)

    return jsonify(response)

if __name__ == "__main__":
    with sqlite3.connect('database.db') as conn:
        conn.execute('CREATE TABLE IF NOT EXISTS SITES (link TEXT UNIQUE, instructions TEXT, visited INTEGER)')
    app.run(debug=True)