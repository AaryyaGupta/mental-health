const form = document.getElementById('traitsForm');
const chatBox = document.getElementById('chatBox');
const chatSection = document.getElementById('chatSection');
const userMessageInput = document.getElementById('userMessage');
const sendBtn = document.getElementById('sendBtn');
const startButton = document.querySelector('.zen-start-button');
const currentMoodSpan = document.getElementById('currentMood');
const currentStressSpan = document.getElementById('currentStress');

let userTraits = { mood: null, stress: null };
let selectedMood = null;
let selectedStress = null;

// Mood and stress card selection
const moodCards = document.querySelectorAll('.mood-card');
const stressCards = document.querySelectorAll('.stress-card');

// Mood selection
moodCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove previous selection
        moodCards.forEach(c => c.classList.remove('selected'));
        // Add selection to clicked card
        card.classList.add('selected');
        
        selectedMood = card.dataset.mood;
        userTraits.mood = selectedMood;
        
        // Update mood indicator
        const moodEmoji = card.querySelector('.mood-emoji').textContent;
        
        // Check if both mood and stress are selected
        checkFormCompletion();
    });
});

// Stress selection
stressCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove previous selection
        stressCards.forEach(c => c.classList.remove('selected'));
        // Add selection to clicked card
        card.classList.add('selected');
        
        selectedStress = card.dataset.stress;
        userTraits.stress = selectedStress;
        
        // Check if both mood and stress are selected
        checkFormCompletion();
    });
});

function checkFormCompletion() {
    if (selectedMood && selectedStress) {
        startButton.disabled = false;
        startButton.style.opacity = '1';
        startButton.style.transform = 'scale(1.02)';
        
        // Add gentle pulse animation
        startButton.style.animation = 'heartbeat 2s ease-in-out infinite';
    } else {
        startButton.disabled = true;
        startButton.style.opacity = '0.5';
        startButton.style.transform = 'scale(1)';
        startButton.style.animation = 'none';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!selectedMood || !selectedStress) {
        showGentleReminder();
        return;
    }
    
    // Update mood indicators
    const selectedMoodCard = document.querySelector(`.mood-card[data-mood="${selectedMood}"]`);
    const selectedStressCard = document.querySelector(`.stress-card[data-stress="${selectedStress}"]`);
    
    const moodEmoji = selectedMoodCard.querySelector('.mood-emoji').textContent;
    const stressEmoji = selectedStressCard.querySelector('.stress-emoji').textContent;
    
    currentMoodSpan.textContent = moodEmoji;
    currentStressSpan.textContent = stressEmoji;
    
    // Hide form and show chat with animation
    form.style.opacity = '0';
    form.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        form.style.display = 'none';
        chatSection.style.display = 'block';
        chatSection.style.opacity = '0';
        chatSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            chatSection.style.transition = 'all 0.6s ease-out';
            chatSection.style.opacity = '1';
            chatSection.style.transform = 'translateY(0)';
        }, 50);
        
        // Show welcome message
        showWelcomeMessage();
        
        userMessageInput.focus();
    }, 300);
});

function showGentleReminder() {
    const reminder = document.createElement('div');
    reminder.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFE5D4, #F8EDEB);
        padding: 2rem;
        border-radius: 30px;
        box-shadow: 0 8px 24px rgba(255, 185, 151, 0.2);
        border: 3px solid #FFB997;
        text-align: center;
        z-index: 1000;
        animation: fadeInUp 0.5s ease-out;
    `;
    
    reminder.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 1rem;">🌸</div>
        <h3 style="color: #6A0572; margin-bottom: 1rem; font-family: 'Quicksand', sans-serif;">Gentle reminder</h3>
        <p style="color: #6B4C4A; margin-bottom: 1.5rem;">Please select both your mood and stress level so I can better understand how to support you today.</p>
        <button onclick="this.parentElement.remove()" style="
            background: linear-gradient(135deg, #FFB997, #6A0572);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
        ">Okay, I'll choose 💝</button>
    `;
    
    document.body.appendChild(reminder);
    
    setTimeout(() => {
        if (reminder.parentElement) {
            reminder.remove();
        }
    }, 5000);
}

function showWelcomeMessage() {
    const welcomeMessages = [
        "Welcome to your gentle space 🌿 I'm here to listen with an open heart.",
        "Thank you for sharing your feelings with me 💝 You're brave for being here.", 
        "This is your safe harbor 🌊 Let's explore what's in your heart together.",
        "I see you, and your feelings matter ✨ What would you like to share today?"
    ];
    
    const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    
    setTimeout(() => {
        chatBox.innerHTML += `<div class="message system-message">
            <div class="message-content">
                <div style="text-align: center; margin-bottom: 1rem;">
                    <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🪷</span>
                </div>
                ${randomWelcome}
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 185, 151, 0.3); font-size: 0.9rem; font-style: italic; opacity: 0.8;">
                    💡 <strong>Gentle tip:</strong> Share as much or as little as feels comfortable. Take your time.
                </div>
            </div>
        </div>`;
        
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // Show a gentle micro-surprise after welcome
        setTimeout(() => {
            showMicroSurprise();
        }, 3000);
    }, 800);
}

function showMicroSurprise() {
    const surprises = [
        "Take a deep breath 🌿 You're exactly where you need to be.",
        "Remember: you're doing your best, and that's enough ☕",
        "Your feelings are valid and welcomed here 🌸",
        "You have so much strength within you ✨"
    ];
    
    const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
    
    const surpriseDiv = document.createElement('div');
    surpriseDiv.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #FFF1E6, #FFE5D4);
        padding: 0.75rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        color: #6B4C4A;
        box-shadow: 0 4px 16px rgba(106, 5, 114, 0.12);
        border: 2px solid rgba(255, 185, 151, 0.3);
        animation: fadeInUp 0.6s ease-out;
        max-width: 200px;
        z-index: 100;
        font-style: italic;
    `;
    
    surpriseDiv.textContent = randomSurprise;
    chatBox.style.position = 'relative';
    chatBox.appendChild(surpriseDiv);
    
    setTimeout(() => {
        surpriseDiv.style.opacity = '0';
        surpriseDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (surpriseDiv.parentElement) {
                surpriseDiv.remove();
            }
        }, 500);
    }, 4000);
}

sendBtn.addEventListener('click', sendMessage);
userMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-resize textarea
userMessageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Add gentle focus effects
userMessageInput.addEventListener('focus', function() {
    this.style.transform = 'scale(1.02)';
    this.style.boxShadow = '0 0 0 4px rgba(255, 185, 151, 0.2)';
});

userMessageInput.addEventListener('blur', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '';
});

// Morning affirmations (show occasionally)
setInterval(() => {
    if (Math.random() < 0.1 && chatBox.children.length > 3) {
        showMorningAffirmation();
    }
}, 60000); // Every minute, 10% chance

function showMorningAffirmation() {
    const affirmations = [
        "🌅 Remember: You are enough, exactly as you are right now.",
        "🍵 Take a moment to appreciate how far you've come today.",
        "🌸 Your presence in this world makes a difference.",
        "✨ You have the strength to handle whatever comes your way.",
        "🌿 It's okay to take things one moment at a time."
    ];
    
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    
    const affirmationDiv = document.createElement('div');
    affirmationDiv.className = 'message system-message';
    affirmationDiv.innerHTML = `
        <div class="message-content" style="background: linear-gradient(135deg, #F0F9F0, #F3E8FF); border: 2px solid rgba(255, 185, 151, 0.3);">
            <div style="text-align: center;">
                <p style="margin: 0; font-style: italic; font-weight: 500;">${randomAffirmation}</p>
                <div style="margin-top: 0.75rem; font-size: 0.8rem; opacity: 0.7;">
                    A gentle reminder from your space of peace
                </div>
            </div>
        </div>
    `;
    
    affirmationDiv.style.opacity = '0';
    affirmationDiv.style.transform = 'translateY(20px)';
    chatBox.appendChild(affirmationDiv);
    
    setTimeout(() => {
        affirmationDiv.style.transition = 'all 0.6s ease-out';
        affirmationDiv.style.opacity = '1';
        affirmationDiv.style.transform = 'translateY(0)';
    }, 50);
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = userMessageInput.value.trim();
    if (!message) {
        // Gentle reminder for empty message
        userMessageInput.style.borderColor = '#FFB997';
        userMessageInput.style.boxShadow = '0 0 0 4px rgba(255, 185, 151, 0.3)';
        
        const gentleShake = userMessageInput.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], {
            duration: 400,
            easing: 'ease-in-out'
        });
        
        setTimeout(() => {
            userMessageInput.style.borderColor = '';
            userMessageInput.style.boxShadow = '';
        }, 2000);
        return;
    }

    // Disable send button and show loading state
    sendBtn.disabled = true;
    const originalText = sendBtn.querySelector('.send-text').textContent;
    sendBtn.querySelector('.send-text').textContent = 'Sending with care...';
    sendBtn.style.opacity = '0.7';
    
    // Add user message with gentle animation
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    userMessageDiv.style.opacity = '0';
    userMessageDiv.style.transform = 'translateY(20px)';
    
    chatBox.appendChild(userMessageDiv);
    
    // Animate user message in
    setTimeout(() => {
        userMessageDiv.style.transition = 'all 0.4s ease-out';
        userMessageDiv.style.opacity = '1';
        userMessageDiv.style.transform = 'translateY(0)';
    }, 50);
    
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

        // Add AI message with zen typing animation
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'message ai-message';
        aiMessageDiv.innerHTML = `<div class="message-content typing">
            <span style="font-size: 1.2rem; margin-right: 0.5rem;">🤍</span>
            I'm listening and preparing a gentle response...
        </div>`;
        aiMessageDiv.style.opacity = '0';
        aiMessageDiv.style.transform = 'translateY(20px)';
        
        chatBox.appendChild(aiMessageDiv);
        
        // Animate typing message in
        setTimeout(() => {
            aiMessageDiv.style.transition = 'all 0.4s ease-out';
            aiMessageDiv.style.opacity = '1';
            aiMessageDiv.style.transform = 'translateY(0)';
        }, 50);
        
        chatBox.scrollTop = chatBox.scrollHeight;

        // Simulate thoughtful typing delay
        setTimeout(() => {
            aiMessageDiv.innerHTML = `<div class="message-content">
                ${data.reply}
                <div class="message-reactions">
                    <button class="reaction-btn" onclick="reactToMessage(this, 'helpful')">
                        <span style="margin-right: 4px;">🌿</span> Helpful
                    </button>
                    <button class="reaction-btn" onclick="reactToMessage(this, 'comforting')">
                        <span style="margin-right: 4px;">☕</span> Comforting
                    </button>
                    <button class="reaction-btn" onclick="reactToMessage(this, 'love')">
                        <span style="margin-right: 4px;">✨</span> Love this
                    </button>
                </div>
            </div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
            
            // Randomly show a poll after some AI responses
            if (Math.random() < 0.3) {
                setTimeout(() => {
                    showHelpfulnessPoll();
                }, 2000);
            }
        }, 1500);
        
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
        
        // Gentle error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message error-message';
        errorDiv.innerHTML = `
            <div class="message-content">
                <div style="text-align: center; margin-bottom: 0.75rem;">
                    <span style="font-size: 1.5rem;">🌸</span>
                </div>
                <div style="text-align: center;">
                    <p style="margin-bottom: 0.75rem;">${errorMessage}</p>
                    <div style="font-size: 0.85rem; opacity: 0.8; font-style: italic;">
                        Take a deep breath - we'll try again when you're ready 💝
                    </div>
                </div>
            </div>
        `;
        
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateY(20px)';
        chatBox.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.transition = 'all 0.4s ease-out';
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateY(0)';
        }, 50);
        
        chatBox.scrollTop = chatBox.scrollHeight;
        
    } finally {
        sendBtn.disabled = false;
        sendBtn.querySelector('.send-text').textContent = originalText;
        sendBtn.style.opacity = '1';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Reaction system
function reactToMessage(button, reaction) {
    // Remove previous selections in this reaction group
    const reactionGroup = button.parentElement;
    reactionGroup.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    button.classList.add('selected');
    
    // Show gentle acknowledgment
    const thankYou = document.createElement('div');
    thankYou.style.cssText = `
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: #6A0572;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 15px;
        font-size: 0.8rem;
        z-index: 100;
        animation: fadeInUp 0.3s ease-out;
    `;
    thankYou.textContent = 'Thank you for sharing 💝';
    
    button.style.position = 'relative';
    button.appendChild(thankYou);
    
    setTimeout(() => {
        thankYou.style.opacity = '0';
        thankYou.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(() => thankYou.remove(), 300);
    }, 2000);
}

// Helpfulness poll
function showHelpfulnessPoll() {
    const pollDiv = document.createElement('div');
    pollDiv.className = 'message system-message';
    pollDiv.innerHTML = `
        <div class="message-content" style="text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 0.75rem;">🌸</div>
            <p style="margin-bottom: 1rem;"><strong>Quick check-in:</strong> How are you feeling about our conversation so far?</p>
            <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
                <button onclick="answerPoll(this, 'amazing')" style="
                    background: linear-gradient(135deg, #FFB997, #6A0572);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 15px;
                    cursor: pointer;
                    font-size: 0.9rem;
                ">✨ Amazing</button>
                <button onclick="answerPoll(this, 'helpful')" style="
                    background: linear-gradient(135deg, #FFB997, #6A0572);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 15px;
                    cursor: pointer;
                    font-size: 0.9rem;
                ">🌿 Helpful</button>
                <button onclick="answerPoll(this, 'okay')" style="
                    background: linear-gradient(135deg, #FFB997, #6A0572);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 15px;
                    cursor: pointer;
                    font-size: 0.9rem;
                ">😊 It's okay</button>
            </div>
        </div>
    `;
    
    pollDiv.style.opacity = '0';
    pollDiv.style.transform = 'translateY(20px)';
    chatBox.appendChild(pollDiv);
    
    setTimeout(() => {
        pollDiv.style.transition = 'all 0.4s ease-out';
        pollDiv.style.opacity = '1';
        pollDiv.style.transform = 'translateY(0)';
    }, 50);
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

function answerPoll(button, answer) {
    const pollMessage = button.closest('.message-content');
    
    const responses = {
        'amazing': "I'm so glad to hear that! Your joy brightens this space 🌟",
        'helpful': "That means the world to me. I'm here to support you always 🌿",
        'okay': "Thank you for your honesty. Let me know how I can better support you 💝"
    };
    
    pollMessage.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 0.75rem;">💖</div>
        <p>${responses[answer]}</p>
    `;
}

// Mood picker function (for refresh button)
function showMoodPicker() {
    // Hide chat and show form again with current selections
    chatSection.style.opacity = '0';
    chatSection.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        chatSection.style.display = 'none';
        form.style.display = 'block';
        form.style.opacity = '0';
        form.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            form.style.transition = 'all 0.6s ease-out';
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
}