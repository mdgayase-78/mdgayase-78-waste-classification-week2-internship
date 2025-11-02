from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai

app = Flask(__name__, static_folder='.', static_url_path='/')
CORS(app)
# Load environment variables
load_dotenv()


# 1️⃣  Paste your real Gemini key here (or load from environment variable)
GEMINI_KEY = os.getenv("GEMINI_API_KEY") 

# 2️⃣  Configure the Gemini client
genai.configure(api_key=GEMINI_KEY)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json or {}
        user_msg = data.get('message', '')
        if not user_msg:
            return jsonify({'reply': 'Please type a message.'})

        # Use Gemini 2.0 Flash Experimental model
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content(user_msg)

        reply = response.text.strip() if response and response.text else "No response."
        return jsonify({'reply': reply})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860)
