const form = document.getElementById('traitsForm');
const chatBox = document.getElementById('chatBox');
const userMessageInput = document.getElementById('userMessage');
const sendBtn = document.getElementById('sendBtn');

let userTraits = {};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    userTraits = Object.fromEntries(formData.entries());
    chatBox.innerHTML += `<p><strong>System:</strong> Chat started!</p>`;
});

sendBtn.addEventListener('click', async () => {
    const message = userMessageInput.value.trim();
    if (!message) {
        alert('Please enter a message before sending.');
        return;
    }

    // Disable send button and show loading state
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    
    chatBox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    userMessageInput.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, traits: userTraits }),
        });

        if (!response.ok) {
            // Handle HTTP errors
            const errorData = await response.json().catch(() => ({ error: 'Network error occurred' }));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.reply) {
            throw new Error('No response received from AI');
        }

        chatBox.innerHTML += `<p><strong>AI:</strong> ${data.reply}</p>`;
        
    } catch (error) {
        console.error('Chat error:', error);
        
        // Show user-friendly error message
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
        
        chatBox.innerHTML += `<p><strong>Error:</strong> <em>${errorMessage}</em></p>`;
        
    } finally {
        // Re-enable send button
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
        
        // Auto-scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
