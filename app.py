```python
from flask import Flask, render_template, request, jsonify, session
import httpx, os, json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = 'cima_secret_key'  # For session management

# Configuration
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/chat")
MODEL = "llama3.1" # Default model, can be changed via UI or env


# -------------------- Multi-cloud SYSTEM PROMPT --------------------
SYSTEM_PROMPT = (
    "You are a multi-cloud IAM policy assistant for AWS, GCP, and Azure.\n"
    "You can analyze IAM/permissions for:\n"
    "- AWS IAM Policies (JSON format with \"Statement\")\n"
    "- GCP IAM Bindings / policies (bindings, role + members)\n"
    "- Azure RBAC role assignments (ARM or roleDefinition + principalId)\n\n"
    "When given a policy JSON or role definition, RETURN valid JSON ONLY with keys:\n"
    "- provider: one of [\"aws\",\"gcp\",\"azure\"] if you can detect, else \"unknown\"\n"
    "- risks: list of short risk strings\n"
    "- explanations: list of short explanation strings\n"
    "- remediation: list of short remediation steps\n"
    "- examples: optional list of example policy snippets\n\n"
    "When asked in plain English, answer with clear steps and (if relevant) provide example policy snippets\n"
    "for the requested cloud(s). Always prefer least privilege. Mention scope (resource vs project vs subscription)\n"
    "and include severity (High/Medium/Low) for each risk if possible."
)

# -------------------- Helper: call Ollama --------------------
def ask_ollama(messages, force_json=False):
    payload = {"model": MODEL, "messages": messages, "stream": False}
    if force_json:
        payload["format"] = "json"
    with httpx.Client(timeout=120) as client:
        r = client.post(OLLAMA_URL, json=payload)
        r.raise_for_status()
        return r.json()["message"]["content"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '').strip()
    mode = data.get('mode', 'chat')  # 'chat' or 'analyze'

    if not user_message:
        return jsonify({'error': 'Message is required'}), 400

    if 'history' not in session:
        session['history'] = []

    if mode == 'chat':
        messages = [{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_message}]
        force_json = False
    else:  # analyze
        try:
            obj = json.loads(user_message)
            user_msg = f"Analyze this IAM policy or role JSON:\n{json.dumps(obj)}"
            messages = [{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_msg}]
            force_json = True
        except json.JSONDecodeError:
            return jsonify({'error': 'Invalid JSON for analysis'}), 400

    try:
        reply = ask_ollama(messages, force_json=force_json)
        if force_json:
            try:
                parsed = json.loads(reply)
                reply = json.dumps(parsed)
            except:
                pass
    except Exception as e:
        reply = f"Error: {str(e)}"

    # Append to history
    session['history'].append({'user': user_message, 'assistant': reply})
    session.modified = True

    return jsonify({'reply': reply})

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify({'history': session.get('history', [])})

@app.route('/clear_history', methods=['POST'])
def clear_history():
    session['history'] = []
    return jsonify({'status': 'cleared'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
