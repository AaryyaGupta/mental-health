// Polls JavaScript
class PollsApp {
    constructor() {
        this.polls = [];
        this.userProfile = this.loadUserProfile();
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.loadUserInfo();
        this.setupEventListeners();
        this.loadPolls();
        this.renderActivePolls();
        this.renderRecentResults();
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
        // Create poll form
        const createPollForm = document.getElementById('createPollForm');
        const pollQuestion = document.getElementById('pollQuestion');
        const pollType = document.getElementById('pollType');
        const createPollBtn = document.querySelector('.create-poll-btn');

        // Character count for question
        pollQuestion.addEventListener('input', (e) => {
            const length = e.target.value.length;
            const charCount = e.target.nextElementSibling;
            charCount.textContent = `${length}/200`;
            this.updateCreatePollButton();
        });

        // Poll type change
        pollType.addEventListener('change', (e) => {
            this.handlePollTypeChange(e.target.value);
            this.updateCreatePollButton();
        });

        // Form submission
        createPollForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPoll();
        });

        // Results modal
        document.getElementById('closeResultsModal').addEventListener('click', () => {
            document.getElementById('resultsModal').classList.remove('show');
        });
    }

    handlePollTypeChange(type) {
        const container = document.getElementById('pollOptionsContainer');
        container.innerHTML = '';
        
        if (!type) {
            container.classList.remove('visible');
            return;
        }

        container.classList.add('visible');

        switch (type) {
            case 'emoji':
                this.renderEmojiOptions(container);
                break;
            case 'multiple':
                this.renderMultipleChoiceOptions(container);
                break;
            case 'scale':
                this.renderScaleOptions(container);
                break;
            case 'yesno':
                // No additional options needed for yes/no
                container.classList.remove('visible');
                break;
        }
    }

    renderEmojiOptions(container) {
        container.innerHTML = `
            <h4>Select Emoji Options</h4>
            <div class="emoji-presets">
                <button type="button" class="preset-btn" data-preset="readiness">
                    Exam Readiness: ✅ Ready, 😅 Somewhat, 😭 Not ready
                </button>
                <button type="button" class="preset-btn" data-preset="stress">
                    Stress Level: 😌 Calm, 😐 Okay, 😰 Stressed, 🤯 Overwhelmed
                </button>
                <button type="button" class="preset-btn" data-preset="mood">
                    Mood: 😢 Sad, 😐 Neutral, 😊 Good, 😄 Great
                </button>
            </div>
            <div class="selected-emojis" id="selectedEmojis">
                <p>Selected: ✅ Ready, 😅 Somewhat, 😭 Not ready</p>
            </div>
        `;

        // Add preset button handlers
        container.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                const text = e.target.textContent;
                document.getElementById('selectedEmojis').innerHTML = `<p>Selected: ${text.split(': ')[1]}</p>`;
                
                // Store the selected preset
                container.dataset.selectedPreset = preset;
            });
        });

        // Set default
        container.dataset.selectedPreset = 'readiness';
    }

    renderMultipleChoiceOptions(container) {
        container.innerHTML = `
            <h4>Multiple Choice Options</h4>
            <div class="options-input" id="multipleOptions">
                <div class="option-input-group">
                    <input type="text" class="option-input" placeholder="Option 1" value="Very satisfied">
                    <button type="button" class="remove-option-btn">×</button>
                </div>
                <div class="option-input-group">
                    <input type="text" class="option-input" placeholder="Option 2" value="Somewhat satisfied">
                    <button type="button" class="remove-option-btn">×</button>
                </div>
                <div class="option-input-group">
                    <input type="text" class="option-input" placeholder="Option 3" value="Not satisfied">
                    <button type="button" class="remove-option-btn">×</button>
                </div>
            </div>
            <button type="button" class="add-option-btn">+ Add Option</button>
        `;

        // Add option handlers
        this.setupMultipleChoiceHandlers(container);
    }

    renderScaleOptions(container) {
        container.innerHTML = `
            <h4>Scale Settings</h4>
            <div class="scale-settings">
                <div class="form-group">
                    <label>Start Label:</label>
                    <input type="text" id="scaleStart" value="Strongly Disagree">
                </div>
                <div class="form-group">
                    <label>End Label:</label>
                    <input type="text" id="scaleEnd" value="Strongly Agree">
                </div>
                <div class="form-group">
                    <label>Scale Range:</label>
                    <select id="scaleRange">
                        <option value="5">1-5 Scale</option>
                        <option value="7">1-7 Scale</option>
                        <option value="10">1-10 Scale</option>
                    </select>
                </div>
            </div>
        `;
    }

    setupMultipleChoiceHandlers(container) {
        const optionsContainer = container.querySelector('#multipleOptions');
        const addBtn = container.querySelector('.add-option-btn');

        // Remove option handlers
        optionsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-option-btn')) {
                const groups = optionsContainer.querySelectorAll('.option-input-group');
                if (groups.length > 2) { // Keep at least 2 options
                    e.target.parentElement.remove();
                }
            }
        });

        // Add option handler
        addBtn.addEventListener('click', () => {
            const groups = optionsContainer.querySelectorAll('.option-input-group');
            if (groups.length < 6) { // Max 6 options
                const newGroup = document.createElement('div');
                newGroup.className = 'option-input-group';
                newGroup.innerHTML = `
                    <input type="text" class="option-input" placeholder="Option ${groups.length + 1}">
                    <button type="button" class="remove-option-btn">×</button>
                `;
                optionsContainer.appendChild(newGroup);
            }
        });
    }

    updateCreatePollButton() {
        const question = document.getElementById('pollQuestion').value.trim();
        const type = document.getElementById('pollType').value;
        const category = document.getElementById('pollCategory').value;
        const btn = document.querySelector('.create-poll-btn');

        btn.disabled = !question || !type || !category;
    }

    createPoll() {
        const question = document.getElementById('pollQuestion').value.trim();
        const type = document.getElementById('pollType').value;
        const category = document.getElementById('pollCategory').value;

        const poll = {
            id: Date.now() + Math.random(),
            question: question,
            type: type,
            category: category,
            author: {
                nickname: this.userProfile.nickname,
                avatar: this.userProfile.avatar
            },
            timestamp: new Date(),
            votes: {},
            totalVotes: 0,
            status: 'active'
        };

        // Add type-specific data
        switch (type) {
            case 'emoji':
                poll.options = this.getEmojiOptions();
                break;
            case 'multiple':
                poll.options = this.getMultipleChoiceOptions();
                break;
            case 'scale':
                poll.scale = this.getScaleOptions();
                break;
            case 'yesno':
                poll.options = [
                    { id: 'yes', text: 'Yes', emoji: '✅' },
                    { id: 'no', text: 'No', emoji: '❌' }
                ];
                break;
        }

        // Initialize vote counts
        if (poll.options) {
            poll.options.forEach(option => {
                poll.votes[option.id] = 0;
            });
        } else if (poll.scale) {
            for (let i = 1; i <= poll.scale.range; i++) {
                poll.votes[i] = 0;
            }
        }

        this.polls.unshift(poll);
        this.savePolls();
        this.renderActivePolls();

        // Clear form
        this.resetCreatePollForm();

        this.showNotification('Poll created successfully! 🗳️');
    }

    getEmojiOptions() {
        const container = document.getElementById('pollOptionsContainer');
        const preset = container.dataset.selectedPreset || 'readiness';

        const presets = {
            readiness: [
                { id: 'ready', text: 'Ready', emoji: '✅' },
                { id: 'somewhat', text: 'Somewhat', emoji: '😅' },
                { id: 'not-ready', text: 'Not ready', emoji: '😭' }
            ],
            stress: [
                { id: 'calm', text: 'Calm', emoji: '😌' },
                { id: 'okay', text: 'Okay', emoji: '😐' },
                { id: 'stressed', text: 'Stressed', emoji: '😰' },
                { id: 'overwhelmed', text: 'Overwhelmed', emoji: '🤯' }
            ],
            mood: [
                { id: 'sad', text: 'Sad', emoji: '😢' },
                { id: 'neutral', text: 'Neutral', emoji: '😐' },
                { id: 'good', text: 'Good', emoji: '😊' },
                { id: 'great', text: 'Great', emoji: '😄' }
            ]
        };

        return presets[preset] || presets.readiness;
    }

    getMultipleChoiceOptions() {
        const inputs = document.querySelectorAll('#multipleOptions .option-input');
        const options = [];
        
        inputs.forEach((input, index) => {
            const text = input.value.trim();
            if (text) {
                options.push({
                    id: `option-${index}`,
                    text: text
                });
            }
        });

        return options;
    }

    getScaleOptions() {
        return {
            start: document.getElementById('scaleStart').value,
            end: document.getElementById('scaleEnd').value,
            range: parseInt(document.getElementById('scaleRange').value)
        };
    }

    resetCreatePollForm() {
        document.getElementById('createPollForm').reset();
        document.querySelector('.char-count').textContent = '0/200';
        document.getElementById('pollOptionsContainer').classList.remove('visible');
        document.querySelector('.create-poll-btn').disabled = true;
    }

    loadPolls() {
        const stored = localStorage.getItem('zephyPolls');
        if (stored) {
            this.polls = JSON.parse(stored);
            // Convert timestamp strings back to Date objects
            this.polls.forEach(poll => {
                poll.timestamp = new Date(poll.timestamp);
            });
        } else {
            this.createSamplePolls();
        }
    }

    createSamplePolls() {
        const samplePolls = [
            {
                id: 1,
                question: "How ready are you for midterm exams?",
                type: "emoji",
                category: "academic",
                author: { nickname: "StudyBuddy", avatar: "📚" },
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                options: [
                    { id: 'ready', text: 'Ready', emoji: '✅' },
                    { id: 'somewhat', text: 'Somewhat', emoji: '😅' },
                    { id: 'not-ready', text: 'Not ready', emoji: '😭' }
                ],
                votes: { ready: 12, somewhat: 25, 'not-ready': 18 },
                totalVotes: 55,
                status: 'active'
            },
            {
                id: 2,
                question: "How satisfied are you with campus mental health resources?",
                type: "scale",
                category: "wellness",
                author: { nickname: "WellnessAdvocate", avatar: "🌱" },
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                scale: { start: "Very Unsatisfied", end: "Very Satisfied", range: 5 },
                votes: { 1: 5, 2: 8, 3: 15, 4: 12, 5: 7 },
                totalVotes: 47,
                status: 'active'
            },
            {
                id: 3,
                question: "Should the library extend its hours during finals week?",
                type: "yesno",
                category: "campus",
                author: { nickname: "NightOwl", avatar: "🦉" },
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                options: [
                    { id: 'yes', text: 'Yes', emoji: '✅' },
                    { id: 'no', text: 'No', emoji: '❌' }
                ],
                votes: { yes: 89, no: 11 },
                totalVotes: 100,
                status: 'active'
            }
        ];

        this.polls = samplePolls;
        this.savePolls();
    }

    renderActivePolls() {
        const container = document.getElementById('activePollsContainer');
        const activePolls = this.polls.filter(poll => poll.status === 'active');

        if (activePolls.length === 0) {
            container.innerHTML = `
                <div class="no-polls">
                    <h3>🗳️ No active polls</h3>
                    <p>Be the first to create a poll!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = activePolls.map(poll => this.createPollHTML(poll)).join('');

        // Add event listeners for voting
        this.setupVotingHandlers();
    }

    createPollHTML(poll) {
        const timeAgo = this.formatTime(poll.timestamp);
        const categoryName = this.getCategoryName(poll.category);

        return `
            <div class="poll-card" data-poll-id="${poll.id}">
                <div class="poll-header">
                    <div class="poll-category">${categoryName}</div>
                    <div class="poll-time">${timeAgo}</div>
                </div>
                
                <div class="poll-content">
                    <h3 class="poll-question">${poll.question}</h3>
                    <div class="poll-options">
                        ${this.renderPollOptions(poll)}
                    </div>
                </div>
                
                <div class="poll-stats">
                    <span class="poll-votes">${poll.totalVotes} votes</span>
                    <span class="poll-status">Active</span>
                </div>
            </div>
        `;
    }

    renderPollOptions(poll) {
        switch (poll.type) {
            case 'emoji':
            case 'multiple':
            case 'yesno':
                return poll.options.map(option => {
                    const percentage = poll.totalVotes > 0 ? Math.round((poll.votes[option.id] / poll.totalVotes) * 100) : 0;
                    const emoji = option.emoji ? `<span class="emoji">${option.emoji}</span>` : '';
                    
                    return `
                        <button class="poll-option" data-option-id="${option.id}">
                            ${emoji}
                            <span class="option-text">${option.text}</span>
                            <div class="option-bar">
                                <div class="option-fill" style="width: ${percentage}%"></div>
                            </div>
                            <span class="option-count">${poll.votes[option.id]}</span>
                        </button>
                    `;
                }).join('');

            case 'scale':
                return `
                    <div class="scale-container">
                        <div class="scale-labels">
                            <span class="scale-label-start">${poll.scale.start}</span>
                            <span class="scale-label-end">${poll.scale.end}</span>
                        </div>
                        <div class="scale-options">
                            ${Array.from({ length: poll.scale.range }, (_, i) => {
                                const value = i + 1;
                                const count = poll.votes[value] || 0;
                                const percentage = poll.totalVotes > 0 ? Math.round((count / poll.totalVotes) * 100) : 0;
                                
                                return `
                                    <button class="scale-option" data-option-id="${value}" title="${count} votes (${percentage}%)">
                                        ${value}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;

            default:
                return '<p>Unknown poll type</p>';
        }
    }

    setupVotingHandlers() {
        document.querySelectorAll('.poll-card').forEach(card => {
            const pollId = parseInt(card.dataset.pollId);
            const options = card.querySelectorAll('.poll-option, .scale-option');
            
            options.forEach(option => {
                option.addEventListener('click', () => {
                    this.handleVote(pollId, option.dataset.optionId, card);
                });
            });
        });
    }

    handleVote(pollId, optionId, cardElement) {
        const poll = this.polls.find(p => p.id === pollId);
        if (!poll) return;

        // Check if user has already voted (simple check using localStorage)
        const voteKey = `poll_vote_${pollId}`;
        const hasVoted = localStorage.getItem(voteKey);

        if (hasVoted) {
            this.showNotification('You have already voted on this poll! 🗳️');
            return;
        }

        // Record the vote
        poll.votes[optionId]++;
        poll.totalVotes++;

        // Mark as voted
        localStorage.setItem(voteKey, optionId);

        // Save polls
        this.savePolls();

        // Update the display
        const pollContent = cardElement.querySelector('.poll-content');
        pollContent.innerHTML = `
            <h3 class="poll-question">${poll.question}</h3>
            <div class="poll-options">
                ${this.renderPollOptions(poll)}
            </div>
        `;

        // Update vote count
        cardElement.querySelector('.poll-votes').textContent = `${poll.totalVotes} votes`;

        // Show voted state
        cardElement.classList.add('voted');

        this.showNotification('Vote recorded! 🗳️');
    }

    renderRecentResults() {
        const container = document.getElementById('recentResultsContainer');
        const recentPolls = this.polls
            .filter(poll => poll.totalVotes > 0)
            .slice(0, 6);

        if (recentPolls.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>📈 No poll results yet</h3>
                    <p>Create and vote on polls to see results!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentPolls.map(poll => {
            const topResult = this.getTopPollResult(poll);
            return `
                <div class="result-card">
                    <h4 class="poll-question">${poll.question}</h4>
                    <div class="result-summary">
                        <div class="result-item">
                            <span class="result-label">Top Choice:</span>
                            <span class="result-percentage">${topResult.text} (${topResult.percentage}%)</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Total Votes:</span>
                            <span class="result-percentage">${poll.totalVotes}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getTopPollResult(poll) {
        let topOption = { id: null, count: 0, text: '', percentage: 0 };

        if (poll.options) {
            poll.options.forEach(option => {
                const count = poll.votes[option.id] || 0;
                if (count > topOption.count) {
                    topOption = {
                        id: option.id,
                        count: count,
                        text: option.text,
                        percentage: Math.round((count / poll.totalVotes) * 100)
                    };
                }
            });
        } else if (poll.scale) {
            Object.entries(poll.votes).forEach(([value, count]) => {
                if (count > topOption.count) {
                    topOption = {
                        id: value,
                        count: count,
                        text: `${value}/${poll.scale.range}`,
                        percentage: Math.round((count / poll.totalVotes) * 100)
                    };
                }
            });
        }

        return topOption;
    }

    getCategoryName(category) {
        const names = {
            'academic': '📚 Academic',
            'wellness': '🧠 Wellness',
            'social': '🤝 Social',
            'campus': '🏫 Campus',
            'career': '💼 Career'
        };
        return names[category] || '📊 General';
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    savePolls() {
        localStorage.setItem('zephyPolls', JSON.stringify(this.polls));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 1000;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PollsApp();
});
