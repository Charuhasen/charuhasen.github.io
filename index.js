// Gasfalan Services Website JavaScript
// Author: Gasfalan Development Team
// Version: 2.0

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initCounters();
    initIntersectionObserver();
    initSmoothScrolling();
    initFormHandling();
    initButtonHandlers();
    initMobileMenu();
    
    // Mark page as loaded to prevent FOUC
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');
    });
});

// Navbar functionality
function initNavbar() {
    const header = document.querySelector('header');
    let scrolled = false;
    let lastScrollTop = 0;

    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Skip if scroll hasn't changed significantly
        if (Math.abs(scrollTop - lastScrollTop) < 5) {
            return;
        }
        lastScrollTop = scrollTop;
        
        if (scrollTop > 50 && !scrolled) {
            header.classList.add('scrolled');
            scrolled = true;
        } else if (scrollTop <= 50 && scrolled) {
            header.classList.remove('scrolled');
            scrolled = false;
        }
    }

    // Throttled scroll event
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Counter animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 60; // Reduced iterations for better performance

    const animateCounter = (counter) => {
        const targetValue = counter.getAttribute('data-target');
        const target = parseFloat(targetValue);
        const increment = target / speed;
        let current = 0;
        
        // Check if this counter needs special formatting
        const label = counter.parentElement.querySelector('.stat-label');
        const labelText = label ? label.textContent.toLowerCase() : '';
        const needsPercent = labelText.includes('satisfaction');
        const needsPlus = labelText.includes('clients') || labelText.includes('experience');
        const isDecimal = targetValue.includes('.');

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                let displayValue;
                if (isDecimal) {
                    displayValue = Math.min(current, target).toFixed(1);
                } else {
                    displayValue = Math.ceil(current);
                }
                
                if (needsPercent) {
                    counter.innerText = displayValue + '%';
                } else if (needsPlus) {
                    counter.innerText = displayValue + '+';
                } else {
                    counter.innerText = displayValue;
                }
                requestAnimationFrame(updateCounter);
            } else {
                let finalValue = target;
                if (isDecimal) {
                    finalValue = target.toFixed(1);
                }
                
                if (needsPercent) {
                    counter.innerText = finalValue + '%';
                } else if (needsPlus) {
                    counter.innerText = finalValue + '+';
                } else {
                    counter.innerText = finalValue;
                }
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, {
        threshold: 0.7,
        rootMargin: '0px 0px -50px 0px'
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Optimized Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.05, // Reduced threshold for better performance
        rootMargin: '0px 0px -50px 0px' // Reduced margin
    };

    const observer = new IntersectionObserver((entries) => {
        // Batch DOM updates
        const toAnimate = [];
        
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('fade-in-up')) {
                toAnimate.push(entry.target);
                observer.unobserve(entry.target);
            }
        });
        
        // Apply animations in a single rAF
        if (toAnimate.length > 0) {
            requestAnimationFrame(() => {
                toAnimate.forEach(el => el.classList.add('fade-in-up'));
            });
        }
    }, observerOptions);

    // Observe elements that should animate
    const animateElements = document.querySelectorAll(
        '.service-card, .sector-card, .team-member, .testimonial-card, .section-header, .about-text, .contact-info'
    );

    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Optimized smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const header = document.querySelector('header');
                const navHeight = header ? header.offsetHeight : 70;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                // Use native smooth scroll for better performance
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling
function initFormHandling() {
    const form = document.getElementById('quoteForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                submitForm(form);
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
            
            // Handle select change events
            if (input.tagName.toLowerCase() === 'select') {
                input.addEventListener('change', function() {
                    clearFieldError(this);
                });
            }
        });
    }
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearFieldError(field);

    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    } else if (fieldType === 'email' && value && !isValidEmail(value)) {
        errorMessage = 'Please enter a valid email address';
        isValid = false;
    } else if (fieldType === 'tel' && value && !isValidPhone(value)) {
        errorMessage = 'Please enter a valid phone number';
        isValid = false;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Form submission
function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Thank you! Your quote request has been submitted successfully. We\'ll contact you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        
        // Log data for development (remove in production)
        console.log('Form submitted:', data);
        
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Remove on click
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Button handlers
function initButtonHandlers() {
    // Hero CTA button
    const heroCTA = document.getElementById('hero-cta');
    if (heroCTA) {
        heroCTA.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const navHeight = document.querySelector('header').offsetHeight;
                const targetPosition = contactSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Hero services button
    const heroServices = document.getElementById('hero-services');
    if (heroServices) {
        heroServices.addEventListener('click', function() {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                const navHeight = document.querySelector('header').offsetHeight;
                const targetPosition = servicesSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Service buttons
    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceName = this.closest('.service-card').querySelector('h3').textContent;
            
            // Pre-fill contact form if available
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                const option = Array.from(serviceSelect.options).find(opt => 
                    opt.textContent.toLowerCase().includes(serviceName.toLowerCase().split(' ')[0])
                );
                if (option) {
                    serviceSelect.value = option.value;
                }
            }
            
            // Scroll to contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const navHeight = document.querySelector('header').offsetHeight;
                const targetPosition = contactSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}



// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Accessibility improvements
function initAccessibility() {
    // Skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management for mobile menu
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                const firstLink = navMenu.querySelector('a');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        });
    }

    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    window.announce = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
    initAccessibility();
});

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function for performance
    throttle: function(func, limit) {
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
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export utils for potential use by other scripts
window.GasfalanUtils = utils;

// CSS for notifications and accessibility
const additionalStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.notification-success {
    border-left: 4px solid var(--primary-color);
}

.notification-success i {
    color: var(--primary-color);
}

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #999;
    margin-left: auto;
}

.notification-close:hover {
    color: #333;
}

.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-color);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 0 0 4px 4px;
    z-index: 10001;
}

.skip-link:focus {
    top: 0;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.form-group.error input,
.form-group.error textarea,
.form-group.error select {
    border-color: #e74c3c;
}

.error-message {
    color: #e74c3c;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: block;
}

@media (max-width: 768px) {
    .notification {
        right: 10px;
        left: 10px;
        max-width: none;
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);