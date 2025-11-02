
# EcoVision — Waste Classifier with LLM-powered Chatbot (OpenAI proxy)

This version adds a Flask backend that proxies chatbot queries to OpenAI. The frontend remains client-side for image classification.

## Setup (Windows)

1. Install Python 3 and make sure `python` and `pip` are on PATH.
2. Extract the ZIP to a folder.
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Configure your OpenAI API key as an environment variable:
   - Temporary (current CMD session):
     ```
     set OPENAI_API_KEY=sk-...
     ```
   - Permanent (Windows):
     ```
     setx OPENAI_API_KEY "sk-..."
     ```
     Then open a new terminal.

5. Start the backend (from the project folder):
   ```
   run_backend.bat
   ```
   The backend serves the static frontend and listens on `http://localhost:7860`.

6. In another terminal, start the static server for direct file serving if preferred:
   ```
   run_server.bat
   ```
   Or open the site directly at `http://localhost:7860` (Flask serves static files).

## How it works

- The frontend loads the included Teachable Machine model (`model.json`, `metadata.json`, `weights.bin`) and can classify images.
- The chatbot sends user messages to `POST /api/chat` which forwards them to OpenAI and returns the reply.
- The backend requires an internet connection and a valid OpenAI API key.

## Security & costs

- Your OpenAI API key should be kept secret. Do not share it.
- Using the OpenAI API may incur usage costs. Monitor your OpenAI account.

## Troubleshooting

- If you see `OPENAI_API_KEY not set` in the app, ensure the environment variable is set and the backend restarted.
- If the model fails to load, ensure you started a local static server.


