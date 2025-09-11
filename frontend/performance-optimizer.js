// Performance optimization and inline style cleanup
document.addEventListener('DOMContentLoaded', function() {
  // Fix modal z-index issues
  const authModal = document.querySelector('.auth-modal');
  if (authModal) {
    // Ensure modal is always on top
    authModal.style.zIndex = '99999';
    
    // Watch for modal state changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target.classList.contains('active')) {
            // Modal opened
            document.body.classList.add('modal-open');
            target.style.zIndex = '99999';
            target.style.display = 'flex';
            target.style.position = 'fixed';
            target.style.top = '0';
            target.style.left = '0';
            target.style.width = '100vw';
            target.style.height = '100vh';
          } else if (mutation.oldValue && mutation.oldValue.includes('active')) {
            // Modal closed
            document.body.classList.remove('modal-open');
          }
        }
      });
    });
    
    observer.observe(authModal, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['class']
    });
  }
  
  // Remove all inline styles and replace with classes
  const elementsWithInlineStyles = document.querySelectorAll('[style]');
  
  elementsWithInlineStyles.forEach(element => {
    const inlineStyle = element.getAttribute('style');
    
    // Handle common inline styles
    if (inlineStyle.includes('display: none')) {
      element.classList.add('hidden');
      element.removeAttribute('style');
    }
    
    // Handle character count styling
    if (element.classList.contains('char-count')) {
      element.removeAttribute('style');
    }
  });
  
  // Optimize images for lazy loading
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.dataset.src && img.src) {
      // Only lazy load images that are not in the initial viewport
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        img.dataset.src = img.src;
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        img.loading = 'lazy';
      }
    }
  });
  
  // Optimize form interactions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    // Prevent multiple submissions
    form.addEventListener('submit', function(e) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.classList.contains('submitting')) {
        e.preventDefault();
        return false;
      }
      
      if (submitBtn) {
        submitBtn.classList.add('submitting');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        
        // Reset after 3 seconds if no response
        setTimeout(() => {
          submitBtn.classList.remove('submitting');
          submitBtn.textContent = originalText;
        }, 3000);
      }
    });
  });
  
  // Optimize scroll performance
  let ticking = false;
  
  function updateScrollElements() {
    // Add/remove classes based on scroll position
    const scrollY = window.scrollY;
    const header = document.querySelector('.modern-header');
    
    if (header) {
      if (scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateScrollElements);
      ticking = true;
    }
  });
  
  // Optimize button interactions
  const buttons = document.querySelectorAll('.modern-btn, button');
  buttons.forEach(button => {
    // Add touch feedback
    button.addEventListener('touchstart', function() {
      this.classList.add('touched');
    });
    
    button.addEventListener('touchend', function() {
      setTimeout(() => this.classList.remove('touched'), 150);
    });
    
    // Prevent double clicks
    button.addEventListener('click', function(e) {
      if (this.classList.contains('clicked')) {
        e.preventDefault();
        return false;
      }
      
      this.classList.add('clicked');
      setTimeout(() => this.classList.remove('clicked'), 1000);
    });
  });
  
  // Initialize intersection observer for animations
  if ('IntersectionObserver' in window) {
    const animateElements = document.querySelectorAll('.modern-card, .modern-section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => observer.observe(el));
  }
  
  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', function() {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData && perfData.loadEventEnd > 2000) {
          console.warn('Page load time is slow:', perfData.loadEventEnd + 'ms');
        }
      }, 0);
    });
  }
  
  // Memory optimization
  let cleanupInterval = setInterval(() => {
    // Clean up unused event listeners and observers
    const hiddenElements = document.querySelectorAll('.hidden, [style*="display: none"]');
    hiddenElements.forEach(el => {
      // Remove event listeners from hidden elements
      const clone = el.cloneNode(true);
      if (el.parentNode && el.parentNode.contains(el)) {
        // Only replace if element is still in DOM
        el.parentNode.replaceChild(clone, el);
      }
    });
  }, 60000); // Every minute
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(cleanupInterval);
  });
});

// Additional CSS for performance optimizations
const performanceCSS = `
  .submitting {
    opacity: 0.7;
    pointer-events: none;
  }
  
  .clicked {
    transform: scale(0.98);
    opacity: 0.8;
  }
  
  .touched {
    transform: scale(0.98);
    opacity: 0.8;
  }
  
  /* Optimize expensive properties - exclude modals and sections */
  .modern-card:not(.feature-card),
  .post-card,
  .poll-card {
    contain: layout style paint;
    will-change: transform;
  }
  
  /* Exclude zen-hero and features sections from containment */
  .zen-hero,
  .zen-hero *,
  .features-overview,
  .features-overview *,
  .feature-card,
  .feature-cards {
    contain: none !important;
  }
  
  /* Ensure modals are never contained */
  .auth-modal,
  .auth-modal *,
  [class*="modal"] {
    contain: none !important;
    will-change: auto;
  }
  
  /* Reduce motion for better performance */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

// Inject performance CSS
const perfStyle = document.createElement('style');
perfStyle.textContent = performanceCSS;
document.head.appendChild(perfStyle);
