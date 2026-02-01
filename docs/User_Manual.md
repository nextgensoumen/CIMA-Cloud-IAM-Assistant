# 📘 CIMA - User Manual & Run Instructions

Welcome to the official documentation for **CIMA (Cloud IAM Misconfiguration Auditor)**. This guide will help you set up, run, and troubleshoot the application.

---

## 📋 1. System Requirements

Before starting, ensure your system meets these requirements:
*   **OS**: Windows 10/11, macOS, or Linux.
*   **Python**: Version 3.8 or higher. ([Download](https://www.python.org/downloads/))
*   **Ollama**: For the AI backend. ([Download](https://ollama.com/download))
*   **Git**: Version control. ([Download](https://git-scm.com/downloads))
*   **RAM**: Minimum 8GB (16GB recommended for smooth AI inference).

---

## ⚙️ 2. Installation & Setup

### Step 1: Clone the Repository
Open your terminal (PowerShell, Command Prompt, or Terminal) and run:
```bash
git clone https://github.com/nextgensoumen/CIMA-Cloud-IAM-Assistant.git
cd CIMA-Cloud-IAM-Assistant
```

### Step 2: Set Up Python Environment
It is best practice to use a virtual environment to avoid conflicts.
```bash
# Create the virtual environment
python -m venv .venv

# Activate it:
# On Windows:
.\.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure AI Model
CIMA uses **Llama 3.1** by default. You need to pull this model once:
```bash
ollama pull llama3.1
```
*(Note: This download is approx 4.7GB. Ensure you have stable internet.)*

---

## 🚀 3. How to Run CIMA

### Option A: The Easy Way (Windows Only)
We have provided a startup script that handles everything.
1.  Double-click `run.ps1` OR run in PowerShell:
    ```powershell
    .\run.ps1
    ```
2.  This script will:
    *   Activate the Python environment.
    *   Check if Ollama is running (and start it if not).
    *   Launch the CIMA Web Server.

### Option B: The Manual Way (All OS)
1.  **Start Ollama** in a separate terminal window:
    ```bash
    ollama serve
    ```
2.  **Start the App** in your main terminal:
    ```bash
    python app.py
    ```

### Accessing the App
Once running, open your web browser and go to:
👉 **http://127.0.0.1:5000**

---

## 💡 4. How to Use

### Chat Mode vs. Analyze Mode
*   **Chat Mode**: Ask general questions like *"What is the difference between AWS IAM Role and User?"* or *"Give me a secure S3 bucket policy example."*
*   **Analyze Mode**: Paste a raw JSON policy to get a security audit.
    1.  Click the **"Analyze JSON"** button/toggle.
    2.  Paste your JSON (e.g., AWS Policy, GCP Binding).
    3.  CIMA will output: **Cloud Provider**, **Risk Level**, and **Remediation Steps**.

### Features
*   **Export**: Click the "Export" button to save your analysis as PDF, TXT, or JSON.
*   **Theme**: Toggle between Dark/Light mode in the sidebar.
*   **History**: Your past conversations are saved automatically in the sidebar.

---

## 🔧 5. Troubleshooting / Common Errors

### ❌ Error: "Ollama connection refused" or "AI not responding"
*   **Cause**: The Ollama background service is not running.
*   **Fix**: Open a new terminal and run `ollama serve`. Keep this window open.

### ❌ Error: "ModuleNotFoundError: No module named 'flask'"
*   **Cause**: You forgot to activate the virtual environment or install requirements.
*   **Fix**:
    ```bash
    .\.venv\Scripts\activate
    pip install -r requirements.txt
    ```

### ❌ Error: "Port 5000 is already in use"
*   **Cause**: Another instance of CIMA or a different app is using port 5000.
*   **Fix**:
    1.  Find the process ID (PID): `netstat -ano | findstr :5000`
    2.  Kill it: `taskkill /PID <PID> /F`
    3.  Restart CIMA.

### ❌ PDF Export not working
*   **Cause**: This feature runs in the browser.
*   **Fix**: Ensure your browser supports JavaScript and popup blockers are disabled.

---

**still stuck?**
Open an issue on our [GitHub Repository](https://github.com/nextgensoumen/CIMA-Cloud-IAM-Assistant) with a screenshot of the error.
