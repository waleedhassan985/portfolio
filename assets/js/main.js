/**
 * Main JavaScript
 * Vanilla JS for portfolio interactions
 * No frameworks, performance-optimized
 */

(function() {
    'use strict';
    
    // ============================================
    // Mobile Navigation Toggle
    // ============================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Trap focus in mobile menu when open
            if (!isExpanded) {
                const firstFocusable = navMenu.querySelector('a');
                if (firstFocusable) firstFocusable.focus();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
            const isMenuOpen = navMenu.classList.contains('active');
            
            if (!isClickInsideNav && isMenuOpen) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                navToggle.focus();
            }
        });
        
        // Close menu when nav link is clicked
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                }
            });
        });
    }
    
    // ============================================
    // Smooth Scroll (with reduced motion support)
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                if (prefersReducedMotion) {
                    targetElement.scrollIntoView();
                } else {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Update focus for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });
    
    // ============================================
    // Project Filter (for Projects page)
    // ============================================
    const filterPills = document.querySelectorAll('.filter-pill');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterPills.length > 0 && projectCards.length > 0) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active state
                filterPills.forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const cardTags = card.getAttribute('data-tags');
                    
                    if (filterValue === 'all' || !cardTags) {
                        card.style.display = '';
                        card.style.animation = prefersReducedMotion ? 'none' : 'fadeIn 0.3s ease-in';
                    } else if (cardTags.includes(filterValue)) {
                        card.style.display = '';
                        card.style.animation = prefersReducedMotion ? 'none' : 'fadeIn 0.3s ease-in';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
            
            // Keyboard support
            pill.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // ============================================
    // Copy to Clipboard
    // ============================================
    const copyButtons = document.querySelectorAll('[data-copy]');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const textToCopy = this.getAttribute('data-copy');
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // Visual feedback
                const originalText = this.textContent;
                this.textContent = '✓ Copied!';
                this.style.color = 'var(--accent)';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    this.textContent = '✓ Copied!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                } catch (err2) {
                    console.error('Fallback copy failed:', err2);
                }
                
                document.body.removeChild(textArea);
            }
        });
    });
    
    // ============================================
    // Form Validation (Contact page)
    // ============================================
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form fields
            const name = this.querySelector('#name');
            const email = this.querySelector('#email');
            const message = this.querySelector('#message');
            const submitButton = this.querySelector('button[type="submit"]');
            const successBox = document.querySelector('#contact-form-success');
            const fallbackBox = document.querySelector('#contact-form-fallback');
            
            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('.form-error').forEach(el => el.remove());
            document.querySelectorAll('.form-input, .form-textarea').forEach(el => {
                el.style.borderColor = '';
            });
            
            // Validate name
            if (!name.value.trim()) {
                showError(name, 'Name is required');
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            }
            
            // Validate message
            if (!message.value.trim()) {
                showError(message, 'Message is required');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError(message, 'Message must be at least 10 characters');
                isValid = false;
            }
            
            // Stop if validation fails
            if (!isValid) {
                return;
            }

            // Submit to Netlify in the background and keep user on the same page
            const formData = new FormData(this);
            const encodedData = new URLSearchParams(formData).toString();

            const originalButtonText = submitButton ? submitButton.textContent : '';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: encodedData
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                this.style.display = 'none';
                if (fallbackBox) {
                    fallbackBox.style.display = 'none';
                }
                if (successBox) {
                    successBox.style.display = 'block';
                    successBox.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
                }
            } catch (error) {
                const formTop = this.querySelector('.form-group');
                if (formTop) {
                    const errorEl = document.createElement('div');
                    errorEl.className = 'form-error';
                    errorEl.style.marginBottom = 'var(--space-2)';
                    errorEl.textContent = 'Unable to send right now. Please try again or email directly.';
                    this.insertBefore(errorEl, formTop);
                }
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
        
        function showError(field, message) {
            field.style.borderColor = 'var(--danger)';
            
            const errorEl = document.createElement('span');
            errorEl.className = 'form-error form-helper';
            errorEl.textContent = message;
            
            field.parentElement.appendChild(errorEl);
            field.focus();
        }
    }
    
    // ============================================
    // Intersection Observer for Animations
    // ============================================
    
    // Make sure project cards are visible on projects page
    if (window.location.pathname.includes('/projects/')) {
        const projectsSection = document.querySelector('.projects-section');

        if (projectsSection) {
            projectsSection.style.opacity = '1';
            projectsSection.style.visibility = 'visible';
            projectsSection.style.transform = 'none';
            projectsSection.classList.add('visible');
        }

        // Force all project cards to be visible immediately on projects page
        document.querySelectorAll('.project-card').forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
    }
    
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Reveal element and add a nice fade-in-up
                    entry.target.style.opacity = '1';
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe common animated sections across all pages
        document.querySelectorAll('.fade-in, .slide-in-left, .scale-in').forEach(el => {
            // Base styles for these are defined in CSS (opacity 0), so just observe
            observer.observe(el);
        });

        // Observe specific cards (kept from previous implementation)
        document.querySelectorAll('.service-card, .testimonial-card, .metric-card').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });

        // Only animate project cards on pages other than the Projects listing
        if (!window.location.pathname.includes('/projects/')) {
            document.querySelectorAll('.project-card').forEach(el => {
                el.style.opacity = '0';
                observer.observe(el);
            });
        }
    } else {
        // Fallback: ensure animated elements are visible if reduced motion is preferred or IO not supported
        document.querySelectorAll('.fade-in, .slide-in-left, .scale-in').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
    
    // ============================================
    // Active Navigation Link Highlight
    // ============================================
    const currentPath = window.location.pathname;
    const navLinksAll = document.querySelectorAll('.nav-link');
    
    navLinksAll.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        if (currentPath === linkPath || 
            (currentPath.startsWith(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
    
    // ============================================
    // Performance: Lazy load images
    // ============================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // ============================================
    // Add fade-in animation keyframes
    // ============================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // Console Easter Egg
    // ============================================
    console.log('%c👋 Hi there!', 'font-size: 24px; font-weight: bold; color: #30c48d;');
    console.log('%cInterested in how this was built?', 'font-size: 14px; color: #9aa4b2;');
    console.log('%cThis portfolio uses semantic HTML5, CSS3 custom properties, and vanilla JavaScript.', 'font-size: 14px; color: #9aa4b2;');
    console.log('%cNo frameworks. Maximum performance. 💚', 'font-size: 14px; color: #30c48d; font-weight: bold;');
    console.log('%cCheck out the source: https://github.com/waleedhassan985', 'font-size: 12px; color: #7aa2f7;');
    
})();
