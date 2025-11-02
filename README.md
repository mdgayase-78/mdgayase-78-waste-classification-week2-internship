

# EcoVision — Waste Classifier +  Eco Chatbot 

## What this package contains
- `index.html`, `app.js`, `style.css` — a browser-based frontend that:
  - loads the included TeachableMachine image model (`model.json`, `metadata.json`, `weights.bin`)
  - lets you use webcam or upload an image for classification
  - includes a simple keyword-based eco chatbot that answers questions and gives tips
- `model.json`, `metadata.json`, `weights.bin` — the Teachable Machine model files (already included)
- `run_server.bat` — Windows helper to run a local server (uses Python 3 `http.server`)
- `README.md` — this file

## How to run (Windows)
1. Make sure you have **Python 3** installed and on PATH.
2. Extract the ZIP to a folder.
3. venv/Scripts/activate/ ## activate the virtual environment
if you dont have venv run this on your commond prompt
python -m venv venv
 venv/Scripts/activate/
            or 
             venv/Scripts/Activate.ps1/
4. Open your browser to `http://localhost:8000` and use the app.


## How to retrain / improve the model
- This package uses a Teachable Machine export. To retrain the model you can:
  1. Recreate or extend the dataset in Teachable Machine (https://teachablemachine.withgoogle.com).
  2. Export a new model and replace the `model.json`, `metadata.json`, and `weights.bin` files here.
  3. Optionally, use the `@teachablemachine/image` library for in-browser transfer learning (advanced).



## Troubleshooting
- If model fails to load: ensure `model.json`, `metadata.json`, and `weights.bin` are in the same folder and you're serving via HTTP (see steps above).
- If webcam doesn't start: allow camera permissions in the browser.


=======
# mdgayase-78-waste-classification-week2-internship
AI-powered Waste Classification Web App using Flask and Machine Learning With google AI chat bot

