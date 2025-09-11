// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
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
    
    // Smooth scrolling for navigation links
    const allNavLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .stat-card, .step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Mobile menu toggle (if needed)
    const nav = document.querySelector('.nav');
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '☰';
    navToggle.style.display = 'none';
    navToggle.style.background = 'none';
    navToggle.style.border = 'none';
    navToggle.style.fontSize = '1.5rem';
    navToggle.style.cursor = 'pointer';
    navToggle.style.color = 'var(--gray-600)';
    
    // Insert toggle button before nav
    nav.parentNode.insertBefore(navToggle, nav);
    
    // Mobile menu functionality
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            navToggle.style.display = 'block';
            nav.style.display = 'none';
        } else {
            navToggle.style.display = 'none';
            nav.style.display = 'flex';
        }
    }
    
    navToggle.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
    });
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
    
    // Add typing animation to hero tagline
    const tagline = document.querySelector('.hero-tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    tagline.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            typeWriter();
        }, 1000);
    }
    
    // Add floating animation to hero circles
    const circles = document.querySelectorAll('.floating-circle');
    circles.forEach((circle, index) => {
        circle.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        circle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Form validation for contact form (if exists)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add your form submission logic here
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = 'var(--success)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    this.reset();
                }, 2000);
            }, 1000);
        });
    }
    
    // Add loading state to Get Started button
    const getStartedBtn = document.querySelector('.btn-primary[href="chat.html"]');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            this.innerHTML = '<span>Starting...</span>';
            this.style.opacity = '0.8';
        });
    }
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-visual');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Add counter animation for features (if we had numbers)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const counter = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(counter);
            }
        }, 16);
    }
    
    // Initialize tooltips or additional interactive elements
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    console.log('🌙 Zephy landing page loaded successfully!');
});
    document.addEventListener('DOMContentLoaded', function() {
      const loginBtn = document.querySelector('.btn-login');
      const closeBtn = document.querySelector('.close-btn');
      const modal = document.getElementById('loginModal');
      const form = document.getElementById('modalForm');
      const successMessage = document.getElementById('successMessage');

      // Open modal on click
      loginBtn.addEventListener('click', function(e){
        e.preventDefault();
        modal.style.display = 'flex';
        form.style.display = 'block';
        successMessage.style.display = 'none';
      });

      // Close modal
      closeBtn.addEventListener('click', function(){
        modal.style.display = 'none';
      });

      // Handle anonymous profile creation
      form.addEventListener('submit', function(e){
        e.preventDefault();
        const data = new FormData(form);
        const userData = {
          nickname: data.get('nickname'),
          avatar: data.get('avatar'),
          year: data.get('year')
        };
        
        // Store user profile locally for anonymous use
        localStorage.setItem('zephyUser', JSON.stringify(userData));
        console.log('Anonymous profile created:', userData);

        form.style.display = 'none';
        successMessage.style.display = 'block';

        // Update login button to show user is logged in
        setTimeout(() => { 
          modal.style.display = 'none';
          loginBtn.innerHTML = `${userData.avatar} ${userData.nickname}`;
          loginBtn.style.background = 'linear-gradient(135deg, #27ae60, #219a52)';
        }, 2500);
      });
      
      // Check if user is already logged in
      const existingUser = localStorage.getItem('zephyUser');
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        loginBtn.innerHTML = `${userData.avatar} ${userData.nickname}`;
        loginBtn.style.background = 'linear-gradient(135deg, #27ae60, #219a52)';
      }
    });
    
}); // Close DOMContentLoaded event listener