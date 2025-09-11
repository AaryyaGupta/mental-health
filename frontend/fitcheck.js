// Wellness Fit Check JavaScript
class WellnessFitCheck {
    constructor() {
        this.assessmentData = {
            stress: null,
            sleep: null,
            mood: null,
            academic: null
        };
        this.userProfile = this.loadUserProfile();
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.loadUserInfo();
        this.setupEventListeners();
        this.loadUserHistory();
    }

    setupMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav');
        
        if (mobileMenuToggle && nav) {
            mobileMenuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                nav.classList.toggle('mobile-active');
            });
            
            // Close mobile menu when clicking on a link
            const navLinks = nav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenuToggle.classList.remove('active');
                    nav.classList.remove('mobile-active');
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenuToggle.contains(e.target) && !nav.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    nav.classList.remove('mobile-active');
                }
            });
        }
    }

    loadUserProfile() {
        const stored = localStorage.getItem('zephyUser');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            nickname: 'Anonymous' + Math.floor(Math.random() * 1000),
            avatar: '🦋',
            year: 'Student'
        };
    }

    loadUserInfo() {
        document.getElementById('userAvatar').textContent = this.userProfile.avatar;
        document.getElementById('userNickname').textContent = this.userProfile.nickname;
    }

    setupEventListeners() {
        // Assessment form
        document.getElementById('wellnessForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processAssessment();
        });

        // Option selection handlers
        this.setupOptionHandlers('.stress-option', 'stress');
        this.setupOptionHandlers('.sleep-option', 'sleep');
        this.setupOptionHandlers('.mood-option', 'mood');
        this.setupOptionHandlers('.academic-option', 'academic');
    }

    setupOptionHandlers(selector, category) {
        const options = document.querySelectorAll(selector);
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from siblings
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Store the value
                this.assessmentData[category] = parseInt(option.dataset.value);
                
                // Check if all questions are answered
                this.updateSubmitButton();
            });
        });
    }

    updateSubmitButton() {
        const submitBtn = document.querySelector('.submit-assessment-btn');
        const allAnswered = Object.values(this.assessmentData).every(value => value !== null);
        submitBtn.disabled = !allAnswered;
    }

    processAssessment() {
        const score = this.calculateWellnessScore();
        const category = this.getWellnessCategory(score);
        
        // Store assessment result
        this.saveAssessmentResult(score, category);
        
        // Show results
        this.displayResults(score, category);
        
        // Update streak
        this.updateStreak();
        
        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    calculateWellnessScore() {
        const { stress, sleep, mood, academic } = this.assessmentData;
        
        // Convert to positive scale (higher = better)
        const stressScore = 6 - stress; // Invert stress (lower stress = higher score)
        const sleepScore = sleep;        // Higher sleep quality = higher score
        const moodScore = mood;          // Higher mood = higher score
        const academicScore = 6 - academic; // Invert academic pressure
        
        // Weight the scores (stress and mood more important)
        const weightedScore = (
            stressScore * 0.3 +
            sleepScore * 0.25 +
            moodScore * 0.3 +
            academicScore * 0.15
        );
        
        // Convert to 0-100 scale
        return Math.round((weightedScore / 5) * 100);
    }

    getWellnessCategory(score) {
        if (score >= 80) {
            return {
                name: 'Excellent Wellness',
                icon: '✨',
                description: 'You\'re thriving! Keep up the great work.',
                color: '#27ae60'
            };
        } else if (score >= 60) {
            return {
                name: 'Good Wellness',
                icon: '🌿',
                description: 'You\'re doing well with some areas to improve.',
                color: '#3498db'
            };
        } else if (score >= 40) {
            return {
                name: 'Moderate Wellness',
                icon: '🌤️',
                description: 'There\'s room for improvement in your wellness.',
                color: '#f39c12'
            };
        } else {
            return {
                name: 'Needs Attention',
                icon: '🆘',
                description: 'Your wellness needs some immediate care and attention.',
                color: '#e74c3c'
            };
        }
    }

    displayResults(score, category) {
        // Hide assessment section
        document.getElementById('assessmentSection').style.display = 'none';
        
        // Show results section
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.remove('hidden');
        resultsSection.style.display = 'block';
        
        // Update score display
        document.querySelector('.score-number').textContent = score;
        document.querySelector('.score-circle').style.background = 
            `linear-gradient(135deg, ${category.color}, ${this.darkenColor(category.color, 20)})`;
        
        // Update category display
        document.querySelector('.category-icon').textContent = category.icon;
        document.querySelector('.category-name').textContent = category.name;
        document.querySelector('.category-desc').textContent = category.description;
        
        // Generate personalized recommendations
        this.generateRecommendations(score, category);
        
        // Update badges
        this.updateBadges();
    }

    generateRecommendations(score, category) {
        const tasks = this.getPersonalizedTasks(score);
        const tips = this.getQuickTips();
        
        // Display tasks
        const tasksContainer = document.getElementById('personalizedTasks');
        tasksContainer.innerHTML = tasks.map(task => `
            <div class="task-item">
                <span class="task-icon">${task.icon}</span>
                <span class="task-text">${task.text}</span>
            </div>
        `).join('');
        
        // Display tips
        const tipsContainer = document.getElementById('quickTips');
        tipsContainer.innerHTML = tips.map(tip => `
            <div class="tip-item">${tip}</div>
        `).join('');
    }

    getPersonalizedTasks(score) {
        const { stress, sleep, mood, academic } = this.assessmentData;
        const tasks = [];
        
        if (stress >= 4) {
            tasks.push({
                icon: '🧘‍♀️',
                text: 'Try a 5-minute breathing exercise'
            });
            tasks.push({
                icon: '🚶‍♀️',
                text: 'Take a 10-minute walk outside'
            });
        }
        
        if (sleep <= 2) {
            tasks.push({
                icon: '😴',
                text: 'Set a consistent bedtime routine'
            });
            tasks.push({
                icon: '📱',
                text: 'Avoid screens 1 hour before bed'
            });
        }
        
        if (mood <= 2) {
            tasks.push({
                icon: '📝',
                text: 'Write 3 things you\'re grateful for'
            });
            tasks.push({
                icon: '🎵',
                text: 'Listen to your favorite uplifting music'
            });
        }
        
        if (academic >= 4) {
            tasks.push({
                icon: '📅',
                text: 'Break big tasks into smaller chunks'
            });
            tasks.push({
                icon: '⏰',
                text: 'Use the Pomodoro technique (25 min focus)'
            });
        }
        
        // Default tasks if all is well
        if (tasks.length === 0) {
            tasks.push(
                { icon: '🌱', text: 'Keep a daily wellness journal' },
                { icon: '💪', text: 'Maintain your healthy habits' },
                { icon: '🤝', text: 'Connect with friends and family' }
            );
        }
        
        return tasks.slice(0, 4); // Limit to 4 tasks
    }

    getQuickTips() {
        const tips = [
            '💧 Stay hydrated - aim for 8 glasses of water daily',
            '🌱 Practice the 5-4-3-2-1 grounding technique when anxious',
            '📚 Study in 25-minute focused blocks with 5-minute breaks',
            '🤝 Reach out to friends when you need support',
            '🌙 Keep a consistent sleep schedule, even on weekends',
            '🍎 Eat regular, nutritious meals to maintain energy',
            '🧘‍♀️ Try box breathing: 4 counts in, hold 4, out 4, hold 4'
        ];
        
        // Return 3 random tips
        const shuffled = tips.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }

    updateStreak() {
        const today = new Date().toDateString();
        let streakData = JSON.parse(localStorage.getItem('wellnessStreak') || '{"count": 0, "lastDate": null}');
        
        if (streakData.lastDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (streakData.lastDate === yesterday.toDateString()) {
                // Continue streak
                streakData.count++;
            } else {
                // Reset streak
                streakData.count = 1;
            }
            
            streakData.lastDate = today;
            localStorage.setItem('wellnessStreak', JSON.stringify(streakData));
        }
        
        document.getElementById('streakCount').textContent = streakData.count;
    }

    updateBadges() {
        const streakData = JSON.parse(localStorage.getItem('wellnessStreak') || '{"count": 0}');
        const assessmentHistory = JSON.parse(localStorage.getItem('wellnessHistory') || '[]');
        
        const badges = [];
        
        // First check badge
        if (assessmentHistory.length >= 1) {
            badges.push({ icon: '🎯', name: 'First Check' });
        }
        
        // Streak badges
        if (streakData.count >= 3) {
            badges.push({ icon: '🔥', name: '3-Day Streak' });
        }
        if (streakData.count >= 7) {
            badges.push({ icon: '⭐', name: 'Week Warrior' });
        }
        
        // Consistency badge
        if (assessmentHistory.length >= 5) {
            badges.push({ icon: '💪', name: 'Consistent' });
        }
        
        // Helper badge (if user has posted in communities)
        const posts = JSON.parse(localStorage.getItem('zephyPosts') || '[]');
        const userPosts = posts.filter(post => post.author.nickname === this.userProfile.nickname);
        if (userPosts.length >= 3) {
            badges.push({ icon: '🤝', name: 'Helper' });
        }
        
        // Display badges
        const badgesContainer = document.getElementById('badgesContainer');
        badgesContainer.innerHTML = badges.map(badge => `
            <div class="badge">
                <span class="badge-icon">${badge.icon}</span>
                <span class="badge-name">${badge.name}</span>
            </div>
        `).join('');
    }

    saveAssessmentResult(score, category) {
        const result = {
            date: new Date().toISOString(),
            score: score,
            category: category.name,
            responses: { ...this.assessmentData }
        };
        
        const history = JSON.parse(localStorage.getItem('wellnessHistory') || '[]');
        history.push(result);
        
        // Keep only last 30 results
        if (history.length > 30) {
            history.splice(0, history.length - 30);
        }
        
        localStorage.setItem('wellnessHistory', JSON.stringify(history));
    }

    loadUserHistory() {
        const history = JSON.parse(localStorage.getItem('wellnessHistory') || '[]');
        
        if (history.length > 0) {
            this.displayHistorySummary(history);
        }
    }

    displayHistorySummary(history) {
        const chartContainer = document.getElementById('historyChart');
        const summaryContainer = document.getElementById('historySummary');
        
        if (history.length === 0) {
            chartContainer.innerHTML = '<p>No previous assessments found. Take your first wellness check!</p>';
            summaryContainer.innerHTML = '';
            return;
        }
        
        // Simple chart representation
        const recent = history.slice(-7); // Last 7 assessments
        chartContainer.innerHTML = `
            <h4>Your Recent Wellness Scores</h4>
            <div style="display: flex; align-items: end; gap: 0.5rem; justify-content: center; height: 100px; margin: 1rem 0;">
                ${recent.map((assessment, index) => `
                    <div style="background: #3498db; width: 30px; height: ${assessment.score}%; border-radius: 3px 3px 0 0; display: flex; align-items: end; justify-content: center; color: white; font-size: 0.7rem; padding: 2px;">
                        ${assessment.score}
                    </div>
                `).join('')}
            </div>
            <p style="font-size: 0.8rem; color: #7f8c8d;">Last ${recent.length} check-ins</p>
        `;
        
        // Summary stats
        const avgScore = Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length);
        const bestScore = Math.max(...history.map(h => h.score));
        const totalCheckins = history.length;
        
        summaryContainer.innerHTML = `
            <div class="summary-stats">
                <div class="stat-item">
                    <div class="stat-number">${avgScore}</div>
                    <div class="stat-label">Average Score</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${bestScore}</div>
                    <div class="stat-label">Best Score</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${totalCheckins}</div>
                    <div class="stat-label">Total Check-ins</div>
                </div>
            </div>
        `;
    }

    darkenColor(color, percent) {
        // Simple color darkening function
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
}

// Global functions for button handlers
function retakeAssessment() {
    document.getElementById('assessmentSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    
    // Reset form
    document.querySelectorAll('.stress-option, .sleep-option, .mood-option, .academic-option')
        .forEach(option => option.classList.remove('selected'));
    
    // Reset assessment data
    const app = window.wellnessApp;
    app.assessmentData = {
        stress: null,
        sleep: null,
        mood: null,
        academic: null
    };
    app.updateSubmitButton();
    
    // Scroll to top
    document.getElementById('assessmentSection').scrollIntoView({ behavior: 'smooth' });
}

function shareToChat() {
    // Redirect to chat with wellness context
    const score = document.querySelector('.score-number').textContent;
    const category = document.querySelector('.category-name').textContent;
    
    const message = `I just completed my wellness check and got a score of ${score} (${category}). I'd like some personalized support and advice.`;
    
    // Store message for chat page
    sessionStorage.setItem('chatMessage', message);
    sessionStorage.setItem('wellnessScore', score);
    sessionStorage.setItem('wellnessCategory', category);
    
    // Redirect to chat
    window.location.href = 'chat.html';
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wellnessApp = new WellnessFitCheck();
});
