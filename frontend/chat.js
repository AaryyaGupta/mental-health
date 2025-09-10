const form = document.getElementById('traitsForm');
const chatBox = document.getElementById('chatBox');
const chatSection = document.getElementById('chatSection');
const userMessageInput = document.getElementById('userMessage');
const sendBtn = document.getElementById('sendBtn');

let userTraits = {};

// Update range input display
const moodInput = document.getElementById('mood');
const stressInput = document.getElementById('stress');

moodInput.addEventListener('input', (e) => {
    const value = e.target.value;
    const label = ['😢', '😕', '😐', '🙂', '😊'][value - 1];
    e.target.nextElementSibling.querySelector('span:last-child').textContent = label;
});

stressInput.addEventListener('input', (e) => {
    const value = e.target.value;
    const label = ['😌', '😊', '😐', '😰', '😫'][value - 1];
    e.target.nextElementSibling.querySelector('span:last-child').textContent = label;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    userTraits = Object.fromEntries(formData.entries());
    
    // Hide form and show chat
    form.style.display = 'none';
    chatSection.style.display = 'block';
    
    // Welcome message
    chatBox.innerHTML += `<div class="message system-message">
        <div class="message-content">
            <strong>System:</strong> Chat started! I'm here to listen and support you. 
            How are you feeling right now?
        </div>
    </div>`;
    
    userMessageInput.focus();
});

sendBtn.addEventListener('click', sendMessage);
userMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = userMessageInput.value.trim();
    if (!message) {
        userMessageInput.style.borderColor = '#ff6b6b';
        setTimeout(() => {
            userMessageInput.style.borderColor = '';
        }, 2000);
        return;
    }

    // Disable send button and show loading state
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    
    // Add user message
    chatBox.innerHTML += `<div class="message user-message">
        <div class="message-content">${message}</div>
    </div>`;
    
    userMessageInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, traits: userTraits }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Network error occurred' }));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.reply) {
            throw new Error('No response received from AI');
        }

        // Add AI message with typing animation
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'message ai-message';
        aiMessageDiv.innerHTML = `<div class="message-content typing">AI is typing...</div>`;
        chatBox.appendChild(aiMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Simulate typing delay
        setTimeout(() => {
            aiMessageDiv.innerHTML = `<div class="message-content">${data.reply}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000);
        
    } catch (error) {
        console.error('Chat error:', error);
        
        let errorMessage = 'Sorry, I encountered an error. ';
        if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
            errorMessage += 'Please check your internet connection and try again.';
        } else if (error.message.includes('Too many requests')) {
            errorMessage += 'Please wait a moment before sending another message.';
        } else if (error.message.includes('authentication')) {
            errorMessage += 'There\'s a configuration issue. Please contact support.';
        } else {
            errorMessage += 'Please try again in a moment.';
        }
        
        chatBox.innerHTML += `<div class="message error-message">
            <div class="message-content">${errorMessage}</div>
        </div>`;
        
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}