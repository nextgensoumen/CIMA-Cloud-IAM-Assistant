# CIMA - Cloud IAM Misconfiguration Auditor

![CIMA Banner](https://img.shields.io/badge/Status-Completed-success) ![Python](https://img.shields.io/badge/Python-3.8%2B-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Ollama](https://img.shields.io/badge/AI-Ollama-orange)

**CIMA** (Cloud IAM Misconfiguration Auditor) is a locally hosted, AI-driven web application designed to audit and analyze **Identity and Access Management (IAM)** policies for AWS, GCP, and Azure. 

This project was developed as a **Final Year Project** for the **Bachelor of Science (Honours) in Advanced Networking and Cyber Security** at **Brainware University**.

---

## 📖 Table of Contents
- [Inspiration & Problem Statement](#-inspiration--problem-statement)
- [How It Works](#-how-it-works)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [MITRE ATT&CK Mapping](#-mitre-attck-mapping)
- [Performance Benchmarks](#-performance-benchmarks)
- [Installation & Usage](#-installation--usage)
- [Technology Stack](#-technology-stack)
- [Authors](#-authors)

---

## � Inspiration & Problem Statement

**The Problem**:
In the age of multi-cloud infrastructure, IAM represents the new perimeter. However, misconfigurations—such as excessive permissions, wildcard usage, and improper role bindings—remain the leading cause of cloud data breaches (Gartner, 2023). 
Manual auditing of JSON/YAML policies across AWS, Azure, and GCP is time-consuming, error-prone, and requires deep expertise in each platform's distinct syntax.

**The Solution**:
CIMA democratizes cloud security by providing a lightweight, AI-powered auditor that runs **offline**. It leverages Large Language Models (LLMs) to understand the *semantics* of a policy, not just the syntax, allowing it to detect complex risks like privilege escalation paths that static tools miss.

---

## 🚀 How It Works

CIMA acts as a chat-based security consultant. You can paste an IAM policy, and CIMA will:
1.  **Analyze**: Parse the JSON structure and identify the Cloud Provider (AWS/GCP/Azure).
2.  **Detect**: Use LLM reasoning to find risks (e.g., `AdministratorAccess`, `iam:PassRole`, Public S3 Buckets).
3.  **Map**: Correlate findings with security standards and MITRE ATT&CK tactics.
4.  **Remediate**: Generate a secure, least-privilege version of the policy.

---

## ✨ Key Features

*   **Multi-Cloud Support**: Analyzes policies from **AWS** (JSON), **GCP** (Bindings), and **Azure** (RBAC).
*   **Privacy-First AI**: Powered by local LLMs (Llama 3.1, Mistral, Gemma) via Ollama. **No data leaves your machine.**
*   **Interactive Chat UI**: A modern, ChatGPT-like interface with Dark/Light mode support.
*   **Structured Analysis**: Returns findings in standard JSON format with Severity ratings (High/Medium/Low).
*   **Export Reports**: Download your audit session for compliance reporting.

---

## 🏗 Architecture

CIMA is architected as a three-tier system:

1.  **Frontend**: A responsive Web UI built with **HTML5, CSS3, and JavaScript**, ensuring a smooth chat experience.
2.  **Backend**: A **Flask (Python)** server that handles request routing, session management, and prompt engineering.
3.  **AI Engine**: **Ollama** running locally, serving open-weight models like **Llama 3.1** to perform high-fidelity inference without API costs.

### 🧩 System Design & Flow

<div align="center">
  <img src="https://github.com/user-attachments/assets/3402c08e-3738-48d7-a021-562e3cbd4edc" alt="System Architecture Diagram" width="800" />
  <p><em>Figure 1: High-Level System Architecture connecting Frontend, Flask API, and Ollama AI Engine.</em></p>
</div>

<br>

<div align="center">
  <img src="https://github.com/user-attachments/assets/1196c53c-8c94-4b42-9d02-b0f10bad4539" alt="Component Workflow" width="700" />
  <p><em>Figure 2: Component Interaction Flow - Detailed Structure.</em></p>
</div>




---
## 📸 UI Preview

### 🔹 Welcome & Dashboard
The modern, dark-themed interface invites users to start auditing immediately.

<img width="800" alt="Detailed Risk View" src="https://github.com/user-attachments/assets/dce8b0ea-8fed-497e-916f-3f7ea969b8f9" />

### 🔹 Chat Interface & Dark Mode
Seamlessly switch between Light and Dark modes for comfortable viewing.

| Light Mode | Dark Mode |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/5cb8e2c3-c701-43ae-86be-eb57132496a7" width="800" /> | <img width="800" alt="Analysis Output" src="https://github.com/user-attachments/assets/d9621b47-36d9-44f6-bca0-bf4b8567e4fc" /> |

### 🔹 Analysis & Remediation
CIMA identifies risks and provides JSON-formatted remediation steps.

<img src="https://github.com/user-attachments/assets/7e45e78e-eb12-4672-b2c6-c96c20d15605" height="300" />










## 🛡 MITRE ATT&CK Mapping

CIMA maps detected misconfigurations to real-world threat tactics:

| Risk Type | MITRE Tactic | ID | Description |
| :--- | :--- | :--- | :--- |
| **Wildcard Permissions** | Privilege Escalation | `T1078` | Overly broad permissions allowing unintended access. |
| **PassRole Abuse** | Lateral Movement | `T1548` | Attackers passing roles to services to escalate privileges. |
| **Public Exposure** | Exfiltration | `T1537` | Misconfigured storage (S3/Blob) accessible to the public. |
| **Unused Keys** | Credential Access | `T1552` | Dormant keys increasing attack surface. |

---

## � Performance Benchmarks

We rigorously tested CIMA against **50 Real-World Scenarios**. 

| Metric | Score | Notes |
| :--- | :--- | :--- |
| **Risk Detection Accuracy** | **92%** | Llama 3.1 consistently flagged high-risk configurations. |
| **Provider Detection** | **100%** | Correctly identified AWS vs GCP vs Azure syntax. |
| **Average Latency** | **< 4s** | On standard hardware using quantized models. |

*(Detailed benchmarks available in the project report)*

---

## ⚙️ Installation & Usage

### Prerequisites
1.  **Python 3.8+**: [Download](https://www.python.org/downloads/)
2.  **Ollama**: [Download](https://ollama.com/download)
    *   *Running the model:* `ollama pull llama3.1`

### Setup
```bash
# 1. Clone the repo
git clone https://github.com/Alpha-Soumen/CIMA-Cloud-IAM-Assistant.git
cd CIMA-Cloud-IAM-Assistant

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the app
python app.py
```
> **Pro Tip**: Windows users can simply run `.\run.ps1` to auto-start everything!

Access the app at: `http://127.0.0.1:5000`

---

## 🛠 Technology Stack

*   **Language**: Python 3.9
*   **Web Framework**: Flask 2.0+
*   **Frontend**: HTML5, Vanilla JS, Jinja2
*   **LLM Runtime**: Ollama (Llama 3.1)
*   **Styling**: Custom CSS (Dark/Light Themes)

---

## 👨‍💻 Authors

**Department of Cyber Science & Technology**  
**Brainware University** (December 2025)

### Project Team

**Soumen Bhunia**

![Role](https://img.shields.io/badge/Role-Project%20Lead-blueviolet?style=for-the-badge)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/soumen-bhunia/)


**Biswajit Pal**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/biswajit-pal-811646284/)


   
**Ananya Dutta**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ananya-dutta-315259285/)
 


---

## ⚖️ License

This project is open-source and available under the **MIT License**.
