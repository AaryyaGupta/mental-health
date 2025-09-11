// Authentication Modal Functions
function showAuthTab(tabName) {
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // Hide loading and success states
    document.getElementById('authLoading').style.display = 'none';
    document.getElementById('authSuccess').style.display = 'none';
    
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected form and tab
    if (tabName === 'login') {
        document.getElementById('loginForm').classList.add('active');
        document.querySelector('.auth-tab[onclick*="login"]').classList.add('active');
    } else if (tabName === 'signup') {
        document.getElementById('signupForm').classList.add('active');
        document.querySelector('.auth-tab[onclick*="signup"]').classList.add('active');
    }
}

function showAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        
        // Reset to login tab
        showAuthTab('login');
        
        // Clear any previous form data
        document.querySelectorAll('.auth-input-form input').forEach(input => {
            input.value = '';
        });
        document.querySelectorAll('.auth-input-form select').forEach(select => {
            select.selectedIndex = 0;
        });
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function showAuthLoading(message = 'Processing...') {
    // Hide forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.style.display = 'none';
    });
    
    // Show loading
    const loading = document.getElementById('authLoading');
    loading.style.display = 'block';
    loading.querySelector('p').textContent = message;
}

function showAuthSuccess(title = 'Success!', message = 'Operation completed successfully.') {
    // Hide everything else
    document.querySelectorAll('.auth-form').forEach(form => {
        form.style.display = 'none';
    });
    document.getElementById('authLoading').style.display = 'none';
    
    // Show success
    const success = document.getElementById('authSuccess');
    success.style.display = 'block';
    success.querySelector('h3').textContent = title;
    success.querySelector('p').textContent = message;
    
    // Auto close after 3 seconds
    setTimeout(() => {
        closeAuthModal();
    }, 3000);
}

function showAuthError(message) {
    alert('Error: ' + message); // Simple error display for now
    
    // Reset forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.style.display = 'block';
    });
    document.getElementById('authLoading').style.display = 'none';
}

// Setup authentication event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Email Login Form
    const emailLoginForm = document.getElementById('emailLoginForm');
    if (emailLoginForm) {
        emailLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            showAuthLoading('Signing in...');
            
            try {
                const result = await authService.signIn(email, password);
                
                if (result.success) {
                    showAuthSuccess('Welcome back!', 'You have been signed in successfully.');
                } else {
                    showAuthError(result.error);
                }
            } catch (error) {
                showAuthError('An unexpected error occurred. Please try again.');
            }
        });
    }
    
    // Email Signup Form
    const emailSignupForm = document.getElementById('emailSignupForm');
    if (emailSignupForm) {
        emailSignupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const nickname = document.getElementById('signupNickname').value;
            const avatar = document.getElementById('signupAvatar').value;
            const year = document.getElementById('signupYear').value;
            
            // Basic validation
            if (!email || !password || !nickname || !avatar || !year) {
                showAuthError('Please fill in all fields.');
                return;
            }
            
            if (password.length < 6) {
                showAuthError('Password must be at least 6 characters long.');
                return;
            }
            
            showAuthLoading('Creating your account...');
            
            try {
                const result = await authService.signUp(email, password, nickname, avatar, year);
                
                if (result.success) {
                    showAuthSuccess('Account created!', 'Please check your email to verify your account.');
                } else {
                    showAuthError(result.error);
                }
            } catch (error) {
                showAuthError('An unexpected error occurred. Please try again.');
            }
        });
    }
    
    // Click outside modal to close
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }
    
    // Update login button click handlers
    document.querySelectorAll('.btn-login').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!authService.isAuthenticated()) {
                showAuthModal();
            }
        });
    });
});

// Make functions globally available
window.showAuthTab = showAuthTab;
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;
