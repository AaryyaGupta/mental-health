// Authentication Service
class AuthService {
    constructor() {
        this.supabase = window.supabaseClient;
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Check if user is already logged in
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
            this.currentUser = session.user;
            this.updateUIForLoggedInUser();
        }

        // Listen for auth state changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.currentUser = session.user;
                this.updateUIForLoggedInUser();
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.updateUIForLoggedOutUser();
            }
        });
    }

    // Email/Password Sign Up
    async signUp(email, password, nickname, avatar, year) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        nickname: nickname,
                        avatar: avatar,
                        academic_year: year,
                        display_name: `${avatar} ${nickname}`
                    }
                }
            });

            if (error) throw error;

            // Create user profile in database
            if (data.user) {
                await this.createUserProfile(data.user.id, {
                    nickname,
                    avatar,
                    academic_year: year,
                    email: email
                });
            }

            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    // Email/Password Sign In
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Google OAuth Sign In
    async signInWithGoogle() {
        try {
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/index.html'
                }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Google sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign Out
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            
            // Clear local storage
            localStorage.removeItem('zephyUser');
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // Create user profile in database
    async createUserProfile(userId, profileData) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .insert([
                    {
                        user_id: userId,
                        nickname: profileData.nickname,
                        avatar: profileData.avatar,
                        academic_year: profileData.academic_year,
                        email: profileData.email,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Create profile error:', error);
            throw error;
        }
    }

    // Get user profile
    async getUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Get profile error:', error);
            return null;
        }
    }

    // Update UI for logged in user
    async updateUIForLoggedInUser() {
        if (!this.currentUser) return;

        // Get user profile
        const profile = await this.getUserProfile(this.currentUser.id);
        
        if (profile) {
            // Update all login buttons and user displays
            const userDisplays = document.querySelectorAll('.user-profile');
            const loginBtns = document.querySelectorAll('.btn-login');

            userDisplays.forEach(display => {
                const avatar = display.querySelector('.user-avatar, #userAvatar');
                const nickname = display.querySelector('.user-nickname, #userNickname');
                
                if (avatar) avatar.textContent = profile.avatar;
                if (nickname) nickname.textContent = profile.nickname;
                
                display.style.display = 'flex';
            });

            loginBtns.forEach(btn => {
                btn.innerHTML = `${profile.avatar} ${profile.nickname}`;
                btn.style.background = 'linear-gradient(135deg, #27ae60, #219a52)';
                btn.onclick = () => this.showUserMenu();
            });

            // Store in localStorage for backwards compatibility
            localStorage.setItem('zephyUser', JSON.stringify({
                avatar: profile.avatar,
                nickname: profile.nickname,
                year: profile.academic_year,
                email: profile.email,
                userId: this.currentUser.id
            }));
        }
    }

    // Update UI for logged out user
    updateUIForLoggedOutUser() {
        const userDisplays = document.querySelectorAll('.user-profile');
        const loginBtns = document.querySelectorAll('.btn-login');

        userDisplays.forEach(display => {
            display.style.display = 'none';
        });

        loginBtns.forEach(btn => {
            btn.innerHTML = 'Login';
            btn.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
            btn.onclick = () => this.showLoginModal();
        });

        localStorage.removeItem('zephyUser');
    }

    // Show user menu
    showUserMenu() {
        const menu = document.createElement('div');
        menu.className = 'user-menu-dropdown';
        menu.innerHTML = `
            <div class="user-menu-item" onclick="authService.showProfile()">
                👤 Profile
            </div>
            <div class="user-menu-item" onclick="authService.signOut()">
                🚪 Sign Out
            </div>
        `;
        
        // Position and show menu
        document.body.appendChild(menu);
        
        // Remove menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function removeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', removeMenu);
                }
            });
        }, 100);
    }

    // Show login modal
    showLoginModal() {
        const modal = document.getElementById('loginModal') || document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    // Show profile
    showProfile() {
        alert('Profile page coming soon!');
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }
}

// Initialize auth service
const authService = new AuthService();
window.authService = authService;
