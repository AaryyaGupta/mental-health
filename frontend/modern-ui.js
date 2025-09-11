/* ===== MODERN PERFORMANCE-OPTIMIZED UI INTERACTIONS ===== */

class ModernUI {
  constructor() {
    this.init();
    this.setupPerformanceOptimizations();
    this.setupSmoothAnimations();
    this.setupLazyLoading();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.setupSmoothScrolling();
    this.setupCardAnimations();
    this.setupFormEnhancement();
    this.setupNavigationEffects();
    this.setupMobileOptimizations();
  }

  setupPerformanceOptimizations() {
    // Prevent layout thrashing
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      
      .loading {
        pointer-events: none;
      }
      
      .optimized {
        will-change: transform, opacity;
        contain: layout style paint;
      }
    `;
    document.head.appendChild(style);
  }

  setupSmoothAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.modern-card, .modern-section').forEach(el => {
      observer.observe(el);
    });
  }

  setupSmoothScrolling() {
    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  setupCardAnimations() {
    // Enhanced card hover effects with performance optimization
    document.querySelectorAll('.modern-card').forEach(card => {
      let isAnimating = false;

      card.addEventListener('mouseenter', () => {
        if (!isAnimating) {
          isAnimating = true;
          card.classList.add('optimized');
          
          requestAnimationFrame(() => {
            card.style.transform = 'translateY(-4px) scale(1.02)';
            card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.16)';
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          card.style.transform = 'translateY(0) scale(1)';
          card.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
          
          setTimeout(() => {
            card.classList.remove('optimized');
            isAnimating = false;
          }, 300);
        });
      });
    });
  }

  setupFormEnhancement() {
    // Enhanced form interactions
    document.querySelectorAll('.modern-form-input, .modern-form-textarea').forEach(input => {
      // Focus effects
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
        input.style.transform = 'scale(1.02)';
      });

      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
        input.style.transform = 'scale(1)';
      });

      // Real-time validation feedback
      input.addEventListener('input', this.debounce(() => {
        this.validateField(input);
      }, 300));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type || field.tagName.toLowerCase();
    
    let isValid = true;
    
    switch(type) {
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'password':
        isValid = value.length >= 6;
        break;
      default:
        isValid = value.length > 0;
    }
    
    field.classList.toggle('valid', isValid && value.length > 0);
    field.classList.toggle('invalid', !isValid && value.length > 0);
  }

  setupNavigationEffects() {
    // Enhanced navigation with smooth transitions
    document.querySelectorAll('.modern-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        // Add loading state
        if (!link.classList.contains('active')) {
          link.classList.add('loading');
          
          // Simulate page transition
          setTimeout(() => {
            link.classList.remove('loading');
          }, 300);
        }
      });
    });

    // Header scroll effect
    let lastScrollY = 0;
    const header = document.querySelector('.modern-header');
    
    if (header) {
      window.addEventListener('scroll', this.throttle(() => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
      }, 16)); // 60FPS
    }
  }

  setupMobileOptimizations() {
    // Touch-friendly interactions
    if ('ontouchstart' in window) {
      document.body.classList.add('touch-device');
      
      // Enhanced touch feedback
      document.querySelectorAll('.modern-btn, .modern-nav-link').forEach(el => {
        el.addEventListener('touchstart', () => {
          el.classList.add('touched');
        });
        
        el.addEventListener('touchend', () => {
          setTimeout(() => el.classList.remove('touched'), 150);
        });
      });
    }

    // Viewport height fix for mobile
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', this.debounce(setVH, 100));
  }

  setupLazyLoading() {
    // Lazy load images for better performance
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Utility functions for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Public API for manual animations
  animateElement(element, animation) {
    return new Promise((resolve) => {
      element.classList.add('optimized');
      element.classList.add(animation);
      
      element.addEventListener('animationend', () => {
        element.classList.remove('optimized');
        element.classList.remove(animation);
        resolve();
      }, { once: true });
    });
  }

  // Loading states
  showLoading(element) {
    element.classList.add('loading');
    element.style.pointerEvents = 'none';
  }

  hideLoading(element) {
    element.classList.remove('loading');
    element.style.pointerEvents = 'auto';
  }

  // Smooth page transitions
  pageTransition(url) {
    return new Promise((resolve) => {
      document.body.classList.add('page-transitioning');
      
      setTimeout(() => {
        window.location.href = url;
        resolve();
      }, 300);
    });
  }
}

// Initialize Modern UI when DOM is ready
const modernUI = new ModernUI();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModernUI;
} else {
  window.ModernUI = ModernUI;
}

// Additional CSS for animations and states
const additionalStyles = `
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }
  
  .loading {
    opacity: 0.7;
    pointer-events: none;
    position: relative;
  }
  
  .loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid transparent;
    border-top: 2px solid var(--soul-lavender);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .scrolled {
    background: rgba(255, 255, 255, 0.95) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12) !important;
  }
  
  .touched {
    transform: scale(0.98);
    opacity: 0.8;
  }
  
  .valid {
    border-color: var(--success-mint) !important;
    box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1) !important;
  }
  
  .invalid {
    border-color: var(--danger-rose) !important;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
  }
  
  .focused {
    transform: scale(1.01);
  }
  
  .page-transitioning {
    opacity: 0.9;
    transform: scale(0.99);
    transition: all 0.3s ease;
  }
  
  img.loaded {
    opacity: 1;
    transition: opacity 0.3s ease;
  }
  
  img[data-src] {
    opacity: 0;
  }
  
  .touch-device .modern-btn,
  .touch-device .modern-nav-link {
    -webkit-tap-highlight-color: transparent;
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
