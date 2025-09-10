// Login page interactions and animations
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌸 Zephy login page loaded with orbital emotions!');
    
    // Add hover effects to emotion words
    const emotionWords = document.querySelectorAll('.emotion-word');
    
    emotionWords.forEach(word => {
        word.addEventListener('mouseenter', function() {
            this.style.transform = `scale(1.2) rotate(${Math.random() * 10 - 5}deg)`;
            this.style.color = 'var(--heart-pink)';
            this.style.textShadow = '0 0 20px var(--heart-coral)';
        });
        
        word.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.color = '';
            this.style.textShadow = '';
        });
    });

    // Add click interaction to emotion words
    emotionWords.forEach(word => {
        word.addEventListener('click', function() {
            const emotion = this.dataset.emotion;
            console.log(`💭 Emotion selected: ${emotion}`);
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'emotion-ripple';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Show emotion message
            showEmotionMessage(emotion);
        });
    });

    // Random emotion highlighting animation
    function animateEmotionHighlights() {
        emotionWords.forEach((word, index) => {
            setTimeout(() => {
                word.classList.toggle('highlighted');
                word.classList.toggle('faded');
            }, index * 200);
        });
    }

    // Cycle emotion highlights every 4 seconds
    setInterval(animateEmotionHighlights, 4000);

    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
        element.style.animationDuration = `${3 + Math.random() * 2}s`;
    });
});

function showEmotionMessage(emotion) {
    const messages = {
        happiness: "Your joy lights up the world! 🌟",
        sadness: "It's okay to feel blue sometimes 💙",
        anger: "Your feelings are valid and heard 🔥",
        fear: "You're braver than you believe 🦋",
        love: "Love always finds a way 💕",
        empathy: "Your caring heart makes a difference 🤗",
        guilt: "Self-compassion is the first step 🌿",
        shame: "You are worthy of love and acceptance 🌸",
        hope: "Tomorrow holds new possibilities ✨",
        resilience: "You've overcome challenges before 💪"
    };

    const message = messages[emotion] || "Every emotion is a teacher 🌱";
    
    // Create temporary message display
    const messageDiv = document.createElement('div');
    messageDiv.className = 'emotion-message';
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 2000);
}