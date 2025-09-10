// Theme Switcher Functionality
class ThemeSwitcher {
    constructor() {
        this.currentTheme = 'pink'; // default theme
        this.isDarkMode = false;
        this.init();
    }

    init() {
        this.createDarkModeToggle();
        this.addThemeSwitchListener();
        this.applyTheme();
        console.log('🎨 Theme switcher initialized!');
    }

    createDarkModeToggle() {
        // Create dark mode toggle button
        const darkModeToggle = document.createElement('button');
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.title = 'Toggle Dark Mode';
        darkModeToggle.onclick = () => this.toggleDarkMode();
        
        // Add to header
        const header = document.querySelector('.header');
        if (header) {
            header.appendChild(darkModeToggle);
        }
    }

    addThemeSwitchListener() {
        // Add click listener to "Take a deep breath" text
        const breatheText = document.querySelector('.brand-welcome');
        if (breatheText) {
            breatheText.style.cursor = 'pointer';
            breatheText.style.transition = 'all 0.3s ease';
            breatheText.onclick = () => this.switchToBlueTheme();
            
            breatheText.addEventListener('mouseenter', () => {
                breatheText.style.transform = 'scale(1.05)';
                breatheText.style.color = 'var(--accent-blue)';
            });
            
            breatheText.addEventListener('mouseleave', () => {
                breatheText.style.transform = 'scale(1)';
                breatheText.style.color = '';
            });
        }
    }

    switchToBlueTheme() {
        this.currentTheme = 'blue';
        this.applyTheme();
        this.animateThemeTransition();
        console.log('💙 Switched to blue theme!');
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        this.animateThemeTransition();
        console.log(`🌙 Dark mode: ${this.isDarkMode ? 'ON' : 'OFF'}`);
    }

    applyTheme() {
        const root = document.documentElement;
        
        if (this.isDarkMode) {
            // Dark theme
            root.style.setProperty('--primary', 'var(--accent-dark)');
            root.style.setProperty('--secondary', 'var(--highlight-dark)');
            root.style.setProperty('--background', 'var(--pure-black)');
            root.style.setProperty('--background-soft', 'var(--primary-dark)');
            root.style.setProperty('--card-bg', 'var(--accent-dark)');
            root.style.setProperty('--text-primary', 'var(--text-dark)');
            root.style.setProperty('--text-secondary', '#CCCCCC');
            root.style.setProperty('--border-light', 'var(--highlight-dark)');
        } else if (this.currentTheme === 'blue') {
            // Blue theme
            root.style.setProperty('--primary', 'var(--accent-blue)');
            root.style.setProperty('--secondary', 'var(--highlight-blue)');
            root.style.setProperty('--background', 'var(--pure-white)');
            root.style.setProperty('--background-soft', 'var(--primary-blue)');
            root.style.setProperty('--card-bg', 'var(--pure-white)');
            root.style.setProperty('--text-primary', 'var(--text-blue)');
            root.style.setProperty('--text-secondary', '#1976D2');
            root.style.setProperty('--border-light', 'var(--primary-blue)');
        } else {
            // Pink theme (default)
            root.style.setProperty('--primary', 'var(--accent-pink)');
            root.style.setProperty('--secondary', 'var(--highlight-pink)');
            root.style.setProperty('--background', 'var(--pure-white)');
            root.style.setProperty('--background-soft', 'var(--primary-pink)');
            root.style.setProperty('--card-bg', 'var(--pure-white)');
            root.style.setProperty('--text-primary', 'var(--dark-gray)');
            root.style.setProperty('--text-secondary', 'var(--medium-gray)');
            root.style.setProperty('--border-light', 'var(--light-gray)');
        }

        // Update dark mode toggle
        const toggle = document.querySelector('.dark-mode-toggle');
        if (toggle) {
            toggle.innerHTML = this.isDarkMode ? '☀️' : '🌙';
        }
    }

    animateThemeTransition() {
        // Add transition animation
        document.body.style.transition = 'all 0.5s ease';
        document.querySelectorAll('*').forEach(el => {
            el.style.transition = 'all 0.3s ease';
        });

        // Remove transition after animation
        setTimeout(() => {
            document.body.style.transition = '';
            document.querySelectorAll('*').forEach(el => {
                el.style.transition = '';
            });
        }, 500);
    }
}

// Initialize theme switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeSwitcher();
});