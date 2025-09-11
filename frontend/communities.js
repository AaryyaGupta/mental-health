// Communities JavaScript
class CommunitiesApp {
    constructor() {
        this.posts = [];
        this.currentCommunity = 'all';
        this.userProfile = this.loadUserProfile();
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupEventListeners();
        this.loadUserInfo();
        this.loadPosts();
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
        // Community tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const community = e.target.dataset.community;
                this.switchCommunity(community);
            });
        });

        // Post creation
        const postContent = document.getElementById('postContent');
        const createPostBtn = document.getElementById('createPostBtn');
        const charCount = document.querySelector('.char-count');

        postContent.addEventListener('input', (e) => {
            const length = e.target.value.length;
            charCount.textContent = `${length}/500`;
            createPostBtn.disabled = length === 0 || length > 500;
        });

        createPostBtn.addEventListener('click', () => {
            this.createPost();
        });

        // Load more posts
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
            this.loadMorePosts();
        });
    }

    switchCommunity(community) {
        this.currentCommunity = community;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.community === community);
        });

        // Filter and display posts
        this.filterPosts();
    }

    createPost() {
        const content = document.getElementById('postContent').value.trim();
        const community = document.getElementById('postCommunity').value;

        if (!content) return;

        const post = {
            id: Date.now() + Math.random(),
            content: content,
            community: community,
            author: {
                nickname: this.userProfile.nickname,
                avatar: this.userProfile.avatar
            },
            timestamp: new Date(),
            polls: {
                support: 0,
                relate: 0,
                helpful: 0
            },
            userVotes: new Set(),
            replies: []
        };

        this.posts.unshift(post);
        this.savePosts();
        this.renderPosts();

        // Clear form
        document.getElementById('postContent').value = '';
        document.querySelector('.char-count').textContent = '0/500';
        document.getElementById('createPostBtn').disabled = true;

        // Show success message
        this.showNotification('Post shared anonymously! 📝');
    }

    loadPosts() {
        // Load from localStorage or create sample posts
        const stored = localStorage.getItem('zephyPosts');
        if (stored) {
            this.posts = JSON.parse(stored);
            // Convert timestamp strings back to Date objects
            this.posts.forEach(post => {
                post.timestamp = new Date(post.timestamp);
                post.userVotes = new Set(post.userVotes || []);
                if (post.replies) {
                    post.replies.forEach(reply => {
                        reply.timestamp = new Date(reply.timestamp);
                    });
                }
            });
        } else {
            this.createSamplePosts();
        }
        this.renderPosts();
    }

    createSamplePosts() {
        const samplePosts = [
            {
                id: 1,
                content: "How do you handle exam stress? I feel like I'm drowning in assignments and can barely sleep. Any tips?",
                community: "exam-stress",
                author: { nickname: "StressedStudent", avatar: "😅" },
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                polls: { support: 12, relate: 8, helpful: 3 },
                userVotes: new Set(),
                replies: [
                    {
                        id: 1,
                        content: "Try the 25-5 rule! Study for 25 mins, break for 5. It really helps me focus.",
                        author: { nickname: "StudyBuddy", avatar: "📚" },
                        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                        support: 5
                    }
                ]
            },
            {
                id: 2,
                content: "Missing home so much... Anyone else feeling homesick? How do you cope?",
                community: "homesick",
                author: { nickname: "FreshStart", avatar: "🌱" },
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                polls: { support: 15, relate: 20, helpful: 2 },
                userVotes: new Set(),
                replies: []
            },
            {
                id: 3,
                content: "Final year anxiety is real. Job applications, thesis, everything feels overwhelming. How are you all managing?",
                community: "final-year",
                author: { nickname: "AlmostGrad", avatar: "🎓" },
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                polls: { support: 8, relate: 12, helpful: 5 },
                userVotes: new Set(),
                replies: []
            }
        ];
        this.posts = samplePosts;
        this.savePosts();
    }

    filterPosts() {
        if (this.currentCommunity === 'all') {
            this.renderPosts();
        } else {
            const filtered = this.posts.filter(post => post.community === this.currentCommunity);
            this.renderPosts(filtered);
        }
    }

    renderPosts(postsToRender = null) {
        const posts = postsToRender || this.posts;
        const container = document.getElementById('postsContainer');
        container.innerHTML = '';

        if (posts.length === 0) {
            container.innerHTML = `
                <div class="no-posts">
                    <h3>🌱 No posts yet in this community</h3>
                    <p>Be the first to share something!</p>
                </div>
            `;
            return;
        }

        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            container.appendChild(postElement);
        });
    }

    createPostElement(post) {
        const template = document.getElementById('postTemplate');
        const postEl = template.content.cloneNode(true);

        // Fill in post data
        postEl.querySelector('.author-avatar').textContent = post.author.avatar;
        postEl.querySelector('.author-name').textContent = post.author.nickname;
        postEl.querySelector('.post-time').textContent = this.formatTime(post.timestamp);
        postEl.querySelector('.post-text').textContent = post.content;
        postEl.querySelector('.post-community-tag').textContent = this.getCommunityName(post.community);
        postEl.querySelector('.reply-count').textContent = post.replies.length;

        // Fill in poll data
        const pollBtns = postEl.querySelectorAll('.poll-btn');
        pollBtns.forEach(btn => {
            const pollType = btn.dataset.poll;
            const count = post.polls[pollType];
            btn.querySelector('.poll-count').textContent = count;
            
            // Check if user has voted
            if (post.userVotes.has(pollType)) {
                btn.classList.add('voted');
            }

            btn.addEventListener('click', () => {
                this.handlePollVote(post.id, pollType, btn);
            });
        });

        // Reply functionality
        const replyBtn = postEl.querySelector('.reply-btn');
        const repliesSection = postEl.querySelector('.replies-section');
        
        replyBtn.addEventListener('click', () => {
            const isVisible = repliesSection.style.display !== 'none';
            repliesSection.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                this.renderReplies(post, repliesSection.querySelector('.replies-container'));
            }
        });

        // Reply form
        const replyForm = postEl.querySelector('.reply-form');
        const replyTextarea = replyForm.querySelector('textarea');
        const replyCharCount = replyForm.querySelector('.reply-char-count');
        const submitReplyBtn = replyForm.querySelector('.submit-reply-btn');

        replyTextarea.addEventListener('input', (e) => {
            const length = e.target.value.length;
            replyCharCount.textContent = `${length}/300`;
        });

        submitReplyBtn.addEventListener('click', () => {
            this.addReply(post.id, replyTextarea.value.trim(), replyForm);
        });

        return postEl;
    }

    renderReplies(post, container) {
        container.innerHTML = '';
        post.replies.forEach(reply => {
            const replyEl = this.createReplyElement(reply);
            container.appendChild(replyEl);
        });
    }

    createReplyElement(reply) {
        const template = document.getElementById('replyTemplate');
        const replyEl = template.content.cloneNode(true);

        replyEl.querySelector('.reply-avatar').textContent = reply.author.avatar;
        replyEl.querySelector('.reply-author').textContent = reply.author.nickname;
        replyEl.querySelector('.reply-time').textContent = this.formatTime(reply.timestamp);
        replyEl.querySelector('.reply-text').textContent = reply.content;
        replyEl.querySelector('.support-count').textContent = reply.support || 0;

        return replyEl;
    }

    handlePollVote(postId, pollType, btnElement) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const hasVoted = post.userVotes.has(pollType);
        
        if (hasVoted) {
            // Remove vote
            post.polls[pollType]--;
            post.userVotes.delete(pollType);
            btnElement.classList.remove('voted');
        } else {
            // Add vote
            post.polls[pollType]++;
            post.userVotes.add(pollType);
            btnElement.classList.add('voted');
        }

        btnElement.querySelector('.poll-count').textContent = post.polls[pollType];
        this.savePosts();
    }

    addReply(postId, content, formElement) {
        if (!content) return;

        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const reply = {
            id: Date.now() + Math.random(),
            content: content,
            author: {
                nickname: this.userProfile.nickname,
                avatar: this.userProfile.avatar
            },
            timestamp: new Date(),
            support: 0
        };

        post.replies.push(reply);
        this.savePosts();

        // Clear form
        formElement.querySelector('textarea').value = '';
        formElement.querySelector('.reply-char-count').textContent = '0/300';

        // Re-render replies
        const container = formElement.parentNode.querySelector('.replies-container');
        this.renderReplies(post, container);

        // Update reply count
        const replyCountEl = formElement.closest('.post-card').querySelector('.reply-count');
        replyCountEl.textContent = post.replies.length;

        this.showNotification('Reply added! 💬');
    }

    loadMorePosts() {
        // Simulate loading more posts
        this.showNotification('No more posts to load 📝');
    }

    getCommunityName(community) {
        const names = {
            'all': '🌍 General',
            'exam-stress': '📚 Exam Stress',
            'homesick': '🏠 Homesick',
            'final-year': '🎓 Final Year',
            'social': '🤝 Social',
            'academic': '📝 Academic'
        };
        return names[community] || '🌍 General';
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

    savePosts() {
        // Convert Sets to arrays for storage
        const postsToSave = this.posts.map(post => ({
            ...post,
            userVotes: Array.from(post.userVotes)
        }));
        localStorage.setItem('zephyPosts', JSON.stringify(postsToSave));
    }

    showNotification(message) {
        // Create notification element
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

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
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
    new CommunitiesApp();
});
