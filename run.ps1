# run.ps1 - Start Ollama + Flask web app with venv auto-activation

# Path to your virtual environment
$venvPath = ".\.venv\Scripts\Activate.ps1"

# Activate venv if it exists
if (Test-Path $venvPath) {
    Write-Host "🟢 Activating virtual environment..."
    & $venvPath
} else {
    Write-Host "⚠️ Virtual environment not found at $venvPath"
}

# Start Ollama server in background if not already running
$ollamaRunning = (Get-Process -Name ollama -ErrorAction SilentlyContinue)
if (-not $ollamaRunning) {
    Write-Host "🚀 Starting Ollama..."
    Start-Process ollama serve
    Start-Sleep -Seconds 3  # wait a few seconds for Ollama to bind
} else {
    Write-Host "✅ Ollama already running."
}

# Start the Flask web app
Write-Host "🌐 Launching CIMA Web Interface..."
python app.py

