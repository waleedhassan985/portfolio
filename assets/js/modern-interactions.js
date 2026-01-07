/**
 * Modern Portfolio Enhancements JavaScript
 * Scroll animations, testimonials, and more
 */

(function() {
    'use strict';
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // ============================================
    // Scroll Animations (Intersection Observer)
    // ============================================
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally unobserve after animation
                    // animateOnScroll.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .timeline-item'
        );
        
        animatedElements.forEach(el => {
            animateOnScroll.observe(el);
        });
    } else {
        // Fallback: immediately show all elements
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .timeline-item'
        );
        animatedElements.forEach(el => {
            el.classList.add('visible');
        });
    }
    
    // ============================================
    // Testimonials Carousel
    // ============================================
    function initTestimonialsCarousel() {
        const carousel = document.querySelector('.testimonials-carousel');
        if (!carousel) return;
        
        const items = carousel.querySelectorAll('.testimonial-item');
        const dotsContainer = document.querySelector('.testimonial-nav');
        const prevBtn = document.querySelector('.testimonial-arrow.prev');
        const nextBtn = document.querySelector('.testimonial-arrow.next');
        
        if (items.length === 0) return;
        
        let currentIndex = 0;
        let autoplayInterval;
        
        // Create dots
        if (dotsContainer) {
            items.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'testimonial-dot';
                dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
                if (index === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    goToSlide(index);
                    resetAutoplay();
                });
                
                dotsContainer.appendChild(dot);
            });
        }
        
        function showSlide(index) {
            items.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            
            const dots = dotsContainer?.querySelectorAll('.testimonial-dot');
            if (dots) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        }
        
        function goToSlide(index) {
            currentIndex = (index + items.length) % items.length;
            showSlide(currentIndex);
        }
        
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        function startAutoplay() {
            if (prefersReducedMotion) return;
            autoplayInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
        
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
        
        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoplay();
            }
        });
        
        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoplay();
            }
        }
        
        // Initialize
        showSlide(0);
        startAutoplay();
    }
    
    // ============================================
    // Smooth Scroll for Internal Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                if (navMenu?.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle?.setAttribute('aria-expanded', 'false');
                }
                
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
    // Form Validation & Enhancement
    // ============================================
    function initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;
        
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        
        // Add floating label effect
        inputs.forEach(input => {
            // Check on load
            if (input.value) {
                input.classList.add('has-value');
            }
            
            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
            
            // Real-time validation
            input.addEventListener('blur', () => {
                validateField(input);
            });
        });
        
        function validateField(field) {
            let isValid = true;
            const errorClass = 'error';
            
            // Remove existing error
            field.classList.remove(errorClass);
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) existingError.remove();
            
            // Email validation
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    showError(field, 'Please enter a valid email address');
                }
            }
            
            // Required field validation
            if (field.required && !field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            }
            
            return isValid;
        }
        
        function showError(field, message) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = 'var(--danger)';
            errorDiv.style.fontSize = 'var(--text-sm)';
            errorDiv.style.marginTop = '4px';
            field.parentElement.appendChild(errorDiv);
        }
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });
            
            if (isFormValid) {
                // Handle form submission
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate submission (replace with actual API call)
                setTimeout(() => {
                    submitBtn.textContent = 'Message Sent!';
                    form.reset();
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1500);
            }
        });
    }
    
    // ============================================
    // Lazy Loading Images
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ============================================
    // Navbar Scroll Effect
    // ============================================
    function initNavbarScroll() {
        const nav = document.querySelector('.nav');
        if (!nav) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            // Hide/show on scroll (optional)
            if (currentScroll > lastScroll && currentScroll > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    // ============================================
    // Skills Tooltip
    // ============================================
    function initSkillsTooltip() {
        const skillCards = document.querySelectorAll('.skill-card');
        
        skillCards.forEach(card => {
            const description = card.dataset.description;
            if (!description) return;
            
            card.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'skill-tooltip';
                tooltip.textContent = description;
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--elev);
                    border: 1px solid var(--accent);
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 14px;
                    z-index: 1000;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s;
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = card.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                
                setTimeout(() => tooltip.style.opacity = '1', 10);
                
                card.dataset.tooltipId = Date.now();
                tooltip.dataset.tooltipId = card.dataset.tooltipId;
            });
            
            card.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector(`.skill-tooltip[data-tooltip-id="${card.dataset.tooltipId}"]`);
                if (tooltip) {
                    tooltip.style.opacity = '0';
                    setTimeout(() => tooltip.remove(), 200);
                }
            });
        });
    }
    
    // ============================================
    // Back to Top Button
    // ============================================
    function initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.innerHTML = '↑';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--accent), var(--accent-hover));
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        `;
        
        document.body.appendChild(backToTop);
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.pointerEvents = 'auto';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.pointerEvents = 'none';
            }
        }, { passive: true });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }
    
    // ============================================
    // Initialize All Features
    // ============================================
    function init() {
        initTestimonialsCarousel();
        initContactForm();
        initNavbarScroll();
        initSkillsTooltip();
        initBackToTop();
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
