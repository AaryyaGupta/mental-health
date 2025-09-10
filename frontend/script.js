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
    const message = userMessageInput.value;
    if (!message) return;
    chatBox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    userMessageInput.value = '';

    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, traits: userTraits }),
    });

    const data = await response.json();
    chatBox.innerHTML += `<p><strong>AI:</strong> ${data.reply}</p>`;
});
