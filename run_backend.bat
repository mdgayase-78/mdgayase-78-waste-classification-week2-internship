@echo off
REM Start Flask backend (assumes Python 3 on PATH)
REM 1) Install dependencies: pip install -r requirements.txt
REM 2) Set your OpenAI API key:
REM    setx OPENAI_API_KEY "sk-XXXXXXXXXXXXXXXX"   (then restart terminal)
REM Or for current session:
REM    set OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXX
python server.py
