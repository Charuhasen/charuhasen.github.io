// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

// Show menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Hide menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Hide menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// Hide menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('show-menu');
    }
});

// Smooth scrolling for navigation links (fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
const header = document.getElementById('header');
let lastScrollY = window.scrollY;

function updateHeader() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', updateHeader, { passive: true });

// Contact form handling
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Basic form validation
        const requiredFields = ['name', 'phone', 'email', 'service'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            const value = formObject[field];
            
            if (!value || value.trim() === '') {
                isValid = false;
                input.style.borderColor = '#ef4444';
                input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            } else {
                input.style.borderColor = '#d1d5db';
                input.style.boxShadow = 'none';
            }
        });
        
        // Email validation
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formObject.email && !emailRegex.test(formObject.email)) {
            isValid = false;
            emailInput.style.borderColor = '#ef4444';
            emailInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        }
        
        // Phone validation (basic)
        const phoneInput = document.getElementById('phone');
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (formObject.phone && !phoneRegex.test(formObject.phone)) {
            isValid = false;
            phoneInput.style.borderColor = '#ef4444';
            phoneInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        }
        
        if (isValid) {
            // Show success message
            showFormMessage('Thank you! Your message has been received. We will contact you soon.', 'success');
            
            // Reset form
            this.reset();
            
            // Log form data (in a real application, you would send this to a server)
            console.log('Form submitted:', formObject);
        } else {
            showFormMessage('Please fill in all required fields correctly.', 'error');
        }
    });
}

// Show form message function
function showFormMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message--${type}`;
    messageElement.textContent = message;
    
    // Add styles
    messageElement.style.cssText = `
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1rem;
        font-weight: 500;
        text-align: center;
        ${type === 'success' 
            ? 'background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' 
            : 'background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'
        }
    `;
    
    // Insert message at the top of the form
    const form = document.getElementById('contact-form');
    form.insertBefore(messageElement, form.firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service__card, .feature, .contact__item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Phone number formatting for Ghana
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    // Handle Ghana country code
    if (value.startsWith('233')) {
        value = '+233 ' + value.slice(3);
    } else if (value.startsWith('0')) {
        value = '+233 ' + value.slice(1);
    }
    
    // Format the number
    if (value.startsWith('+233 ')) {
        const number = value.slice(5);
        if (number.length > 0) {
            value = '+233 ' + number.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
        }
    }
    
    input.value = value;
}

// Add phone formatting to phone input
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        formatPhoneNumber(this);
    });
    
    // Add placeholder
    phoneInput.placeholder = '+233 XX XXX XXXX';
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
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

// Apply debouncing to scroll handler
const debouncedUpdateHeader = debounce(updateHeader, 10);
window.removeEventListener('scroll', updateHeader);
window.addEventListener('scroll', debouncedUpdateHeader, { passive: true });

// Lazy loading for images (when images are added)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Service worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error handling for missing elements
function safeEventListener(elementId, event, handler) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener(event, handler);
    }
}

// WhatsApp integration (optional enhancement)
function initWhatsAppIntegration() {
    const phoneNumbers = ['+233539734402', '+233206806687'];
    const whatsappLinks = document.querySelectorAll('.contact__phone');
    
    whatsappLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Option to call or WhatsApp
            const choice = confirm('Would you like to call this number? Click Cancel to send a WhatsApp message instead.');
            
            if (choice) {
                window.location.href = link.href; // Make the call
            } else {
                // Open WhatsApp
                const phone = phoneNumbers[index] || phoneNumbers[0];
                const message = encodeURIComponent('Hello Gasfalan Services, I would like to inquire about your services.');
                window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
            }
        });
    });
}

// Initialize WhatsApp integration
document.addEventListener('DOMContentLoaded', initWhatsAppIntegration);