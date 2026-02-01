// Global variables
let currentMode = 'chat';
let isTyping = false;

// DOM elements
const welcomeScreen = document.getElementById('welcome-screen');
const app = document.getElementById('app');
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const themeToggle = document.getElementById('theme-toggle');
const newChatBtn = document.getElementById('new-chat-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const conversationList = document.getElementById('conversation-list');
const exportModal = document.getElementById('export-modal');
const closeModal = document.getElementById('close-modal');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const deleteModal = document.getElementById('delete-modal');
const deleteModalOverlay = document.getElementById('delete-modal-overlay');
const confirmDelete = document.getElementById('confirm-delete');
const cancelDelete = document.getElementById('cancel-delete');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Show welcome screen for 5 seconds
    setTimeout(() => {
        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            app.classList.remove('hidden');
            setTimeout(() => app.classList.add('show'), 100);
            loadHistory();
            addInitialGreeting();
        }, 500);
    }, 5000);

    // Event listeners
    messageInput.addEventListener('input', handleInputChange);
    messageInput.addEventListener('keydown', handleKeyDown);
    sendBtn.addEventListener('click', sendMessage);
    modeBtns.forEach(btn => btn.addEventListener('click', toggleMode));
    themeToggle.addEventListener('click', toggleTheme);
    newChatBtn.addEventListener('click', startNewChat);
    clearHistoryBtn.addEventListener('click', showDeleteModal);
    closeModal.addEventListener('click', () => exportModal.classList.add('hidden'));
    sidebarToggle.addEventListener('click', toggleSidebar);
    deleteModalOverlay.addEventListener('click', hideDeleteModal);
    cancelDelete.addEventListener('click', hideDeleteModal);
    confirmDelete.addEventListener('click', confirmClearHistory);

    // Export buttons
    document.getElementById('export-pdf').addEventListener('click', () => exportConversation('pdf'));
    document.getElementById('export-txt').addEventListener('click', () => exportConversation('txt'));
    document.getElementById('export-md').addEventListener('click', () => exportConversation('md'));
    document.getElementById('export-json').addEventListener('click', () => exportConversation('json'));
});

// Handle input changes
function handleInputChange() {
    const value = messageInput.value.trim();
    sendBtn.disabled = !value;
    adjustTextareaHeight();
}

// Handle key down events
function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) {
            sendMessage();
        }
    }
}

// Adjust textarea height
function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// Toggle mode
function toggleMode(e) {
    modeBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentMode = e.target.dataset.mode;
    messageInput.placeholder = currentMode === 'chat'
        ? 'Ask about IAM policies or paste JSON to analyze...'
        : 'Paste your IAM policy JSON here...';
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark')) {
        icon.className = 'fas fa-sun';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

// Load theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
}

// Send message
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isTyping) return;

    // Remove welcome message on first user message
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    // Add user message
    addMessage(message, 'user');
    messageInput.value = '';
    handleInputChange();

    // Show typing indicator
    showTypingIndicator();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                mode: currentMode
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Keep typing indicator visible for a minimum time to feel realistic
            const minThinkingTime = 1000; // 1 second minimum
            const startTime = Date.now();

            setTimeout(() => {
                hideTypingIndicator();
                addMessageWithTypewriter(data.reply, 'assistant');
                loadHistory();
            }, Math.max(0, minThinkingTime - (Date.now() - startTime)));
        } else {
            hideTypingIndicator();
            addMessage(`Error: ${data.error}`, 'assistant');
        }
    } catch (error) {
        hideTypingIndicator();
        addMessage(`Error: ${error.message}`, 'assistant');
    }

    // Scroll to bottom
    scrollToBottom();
}

// Add message to chat
function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (type === 'assistant') {
        // Parse markdown for assistant messages
        contentDiv.innerHTML = marked.parse(content);

        // Add copy buttons to code blocks
        contentDiv.querySelectorAll('pre').forEach(pre => {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.onclick = () => copyToClipboard(pre.textContent);
            pre.style.position = 'relative';
            pre.appendChild(copyBtn);
        });

        // Apply theme-aware styling to markdown elements
        applyThemeStyling(contentDiv);
    } else {
        contentDiv.textContent = content;
    }

    bubbleDiv.appendChild(contentDiv);
    messageDiv.appendChild(bubbleDiv);
    chatContainer.appendChild(messageDiv);

    scrollToBottom();
}

// Add message with typewriter effect
function addMessageWithTypewriter(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    bubbleDiv.appendChild(contentDiv);
    messageDiv.appendChild(bubbleDiv);
    chatContainer.appendChild(messageDiv);

    if (type === 'assistant') {
        // Typewriter effect for assistant messages
        let index = 0;
        const typeSpeed = 20; // milliseconds per character

        function typeWriter() {
            if (index < content.length) {
                contentDiv.innerHTML = marked.parse(content.substring(0, index + 1));
                index++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Add copy buttons after typing is complete
                contentDiv.querySelectorAll('pre').forEach(pre => {
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'copy-btn';
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.onclick = () => copyToClipboard(pre.textContent);
                    pre.style.position = 'relative';
                    pre.appendChild(copyBtn);
                });

                // Apply theme-aware styling after typing is complete
                applyThemeStyling(contentDiv);
            }
        }

        typeWriter();
    } else {
        contentDiv.textContent = content;
    }

    scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typing-indicator';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble typing-indicator-msg';

    bubbleDiv.innerHTML = `<span class="thinking-text">Thinking…</span>`;

    typingDiv.appendChild(bubbleDiv);
    chatContainer.appendChild(typingDiv);
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Add initial greeting
function addInitialGreeting() {
    // Remove any existing welcome message
    const existingWelcome = document.getElementById('welcome-message');
    if (existingWelcome) {
        existingWelcome.remove();
    }

    const welcomeDiv = document.createElement('div');
    welcomeDiv.id = 'welcome-message';
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
        <div class="welcome-content">
            <p>CIMA, your Multi-Cloud IAM Assistant. I can help you analyze IAM policies for AWS, GCP, and Azure, or answer questions about cloud security best practices. How can I assist you today?</p>
        </div>
    `;
    chatContainer.appendChild(welcomeDiv);
}

// Load conversation history
async function loadHistory() {
    try {
        const response = await fetch('/history');
        const data = await response.json();
        updateConversationList(data.history);
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// Update conversation list
function updateConversationList(history) {
    conversationList.innerHTML = '';
    if (history.length === 0) {
        conversationList.innerHTML = '<div class="conversation-item">No conversations yet</div>';
        return;
    }

    history.slice(-10).reverse().forEach((conv, index) => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        item.textContent = conv.user.length > 50 ? conv.user.substring(0, 47) + '...' : conv.user;
        item.onclick = () => loadConversation(conv);
        conversationList.appendChild(item);
    });
}

// Load specific conversation
function loadConversation(conv) {
    chatContainer.innerHTML = '';
    addMessage(conv.user, 'user');
    addMessage(conv.assistant, 'assistant');
}

// Start new chat
function startNewChat() {
    chatContainer.innerHTML = '';
    addInitialGreeting();
}

// Show delete modal
function showDeleteModal() {
    deleteModal.classList.remove('hidden');
}

// Hide delete modal
function hideDeleteModal() {
    deleteModal.classList.add('hidden');
}

// Confirm clear history
async function confirmClearHistory() {
    try {
        await fetch('/clear_history', { method: 'POST' });
        conversationList.innerHTML = '<div class="conversation-item">No conversations yet</div>';
        startNewChat();
        hideDeleteModal();
    } catch (error) {
        console.error('Error clearing history:', error);
    }
}

// Scroll to bottom
function scrollToBottom() {
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary feedback
        const notification = document.createElement('div');
        notification.textContent = 'Copied to clipboard!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    });
}

// Export conversation
function exportConversation(format) {
    const messages = Array.from(chatContainer.querySelectorAll('.message')).map(msg => {
        const type = msg.classList.contains('user') ? 'User' : 'Assistant';
        const content = msg.querySelector('.message-content').textContent;
        return `${type}: ${content}`;
    }).join('\n\n');

    let content, filename, mimeType;

    switch (format) {
        case 'txt':
            content = messages;
            filename = 'conversation.txt';
            mimeType = 'text/plain';
            break;
        case 'md':
            content = messages.replace(/User: /g, '## User\n').replace(/Assistant: /g, '## Assistant\n');
            filename = 'conversation.md';
            mimeType = 'text/markdown';
            break;
        case 'json':
            content = JSON.stringify({ conversation: messages.split('\n\n').map(line => {
                const [type, ...msg] = line.split(': ');
                return { role: type.toLowerCase(), content: msg.join(': ') };
            })}, null, 2);
            filename = 'conversation.json';
            mimeType = 'application/json';
            break;
        case 'pdf':
            // For PDF, we'd need a library like jsPDF
            alert('PDF export not implemented yet. Please use another format.');
            return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    exportModal.classList.add('hidden');
}

// Apply theme-aware styling to markdown elements
function applyThemeStyling(contentDiv) {
    // Apply classes to severity/risk/remediation labels
    const text = contentDiv.textContent.toLowerCase();
    if (text.includes('severity: high') || text.includes('high severity')) {
        contentDiv.innerHTML = contentDiv.innerHTML.replace(
            /(severity:\s*high|high severity)/gi,
            '<span class="severity severity-high">$1</span>'
        );
    }
    if (text.includes('severity: medium') || text.includes('medium severity')) {
        contentDiv.innerHTML = contentDiv.innerHTML.replace(
            /(severity:\s*medium|medium severity)/gi,
            '<span class="severity severity-medium">$1</span>'
        );
    }
    if (text.includes('severity: low') || text.includes('low severity')) {
        contentDiv.innerHTML = contentDiv.innerHTML.replace(
            /(severity:\s*low|low severity)/gi,
            '<span class="severity severity-low">$1</span>'
        );
    }

    // Apply classes to risk labels
    if (text.includes('risk: high') || text.includes('high risk')) {
        contentDiv.innerHTML = contentDiv.innerHTML.replace(
            /(risk:\s*high|high risk)/gi,
            '<span class="risk severity-high">$1</span>'
        );
    }
    if (text.includes('risk: medium') || text.includes('medium risk')) {
        contentDiv.innerHTML = contentDiv.innerHTML.replace(
            /(risk:\s*medium|medium risk)/gi,
            '<span class="risk severity-medium">$1</span>'
        );
    }
    if (text.includes('risk: low') || text.includes('low risk')) {
        contentDiv.innerHTML = contentDiv.innerHTML.replace(
            /(risk:\s*low|low risk)/gi,
            '<span class="risk severity-low">$1</span>'
        );
    }

    // Apply classes to remediation labels
    if (text.includes('remediation:')) {
        contentDiv.innerHTML = contentDiv.innerHTML.replace(
            /(remediation:)/gi,
            '<span class="remediation">$1</span>'
        );
    }
}

// Mobile sidebar toggle (if needed)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
}
