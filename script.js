// ==========================================
// MODERN PORTFOLIO JAVASCRIPT
// ==========================================

class ModernPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.handleLoading();
        this.createParticles();
        this.initializeTypingEffect();
        this.setupScrollAnimations();
        this.initializeSkillBars();
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Mobile menu
        this.setupMobileMenu();
        
        // Smooth scrolling
        this.setupSmoothScrolling();
        
        // Contact form
        this.setupContactForm();
        
        // Navbar scroll effect
        this.setupNavbarScrollEffect();
        
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                    this.updateActiveNavLink(link);
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navLinks = document.getElementById('nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
        }
    }

    closeMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navLinks = document.getElementById('nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            });
        });
    }

    scrollToElement(element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setupNavbarScrollEffect() {
        const navbar = document.getElementById('navbar');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.9)';
                navbar.style.boxShadow = '0 2px 10px rgba(44, 62, 80, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.8)';
                navbar.style.boxShadow = 'none';
            }
            
            // Update active nav link based on scroll position
            this.updateActiveNavOnScroll();
            
            lastScrollTop = scrollTop;
        });
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        const formMessage = document.getElementById('form-message');
        
        if (form && formMessage) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                    formMessage.className = 'form-message success';
                    formMessage.classList.remove('hidden');
                    
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        formMessage.classList.add('hidden');
                    }, 5000);
                }, 2000);
            });
        }
    }

    // ==========================================
    // ANIMATIONS
    // ==========================================
    initializeAnimations() {
        // Add initial animation classes
        this.addAnimationClasses();
        
        // Setup intersection observer for scroll animations
        this.setupIntersectionObserver();
    }

    addAnimationClasses() {
        // Hero elements
        const heroElements = document.querySelectorAll('.hero-avatar, .hero-title, .hero-subtitle, .hero-description, .hero-buttons');
        heroElements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.animationDelay = `${index * 0.2}s`;
        });

        // Section elements
        const sectionElements = document.querySelectorAll('.section-title, .section-divider, .section-subtitle');
        sectionElements.forEach(element => {
            element.classList.add('slide-up');
        });

        // Cards with stagger effect
        const skillCards = document.querySelectorAll('.skill-category');
        const projectCards = document.querySelectorAll('.project-card');
        
        [...skillCards, ...projectCards].forEach((card, index) => {
            card.classList.add('scale-in', `stagger-${index + 1}`);
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    
                    // Special handling for skill bars
                    if (entry.target.classList.contains('skill-category')) {
                        this.animateSkillBars(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.scale-in, .slide-up, .fade-in').forEach(element => {
            element.style.animationPlayState = 'paused';
            observer.observe(element);
        });
    }

    // ==========================================
    // TYPING EFFECT
    // ==========================================
    initializeTypingEffect() {
        const nameElement = document.getElementById('typed-name');
        const cursor = document.querySelector('.title-cursor');
        
        if (nameElement && cursor) {
            const text = nameElement.textContent;
            nameElement.textContent = '';
            
            let index = 0;
            const typeSpeed = 100;
            
            const typeWriter = () => {
                if (index < text.length) {
                    nameElement.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, typeSpeed);
                } else {
                    // Stop cursor blinking after typing is complete
                    setTimeout(() => {
                        cursor.style.animation = 'none';
                        cursor.style.opacity = '0';
                    }, 2000);
                }
            };
            
            // Start typing after a short delay
            setTimeout(typeWriter, 1000);
        }
    }

    // ==========================================
    // SKILL BARS
    // ==========================================
    initializeSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.style.width = '0%';
        });
    }

    animateSkillBars(skillCategory) {
        const progressBars = skillCategory.querySelectorAll('.skill-progress');
        
        progressBars.forEach((bar, index) => {
            const targetWidth = bar.getAttribute('data-progress') + '%';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, index * 200);
        });
    }

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    setupScrollAnimations() {
        // Parallax effect for floating shapes
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.shape');
            
            shapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = scrolled * speed;
                shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });

        // Smooth reveal animations
        this.setupScrollRevealAnimations();
    }

    setupScrollRevealAnimations() {
        const revealElements = document.querySelectorAll('.glass-card, .project-card, .skill-category');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.15
        });

        revealElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            revealObserver.observe(element);
        });
    }

    // ==========================================
    // PARTICLES
    // ==========================================
    createParticles() {
        const particlesContainer = document.getElementById('hero-particles');
        const particleCount = 50;
        
        if (particlesContainer) {
            for (let i = 0; i < particleCount; i++) {
                this.createParticle(particlesContainer, i);
            }
        }
    }

    createParticle(container, index) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        container.appendChild(particle);
    }

    // ==========================================
    // LOADING SCREEN
    // ==========================================
    handleLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        
        // Simulate loading time
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 2000);
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    handleResize() {
        // Recalculate positions and animations on resize
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.left = Math.random() * 100 + '%';
        });
    }

    // Debounce function for performance
    debounce(func, wait, immediate) {
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
    }

    // Smooth scrolling fallback for older browsers
    smoothScrollTo(targetPosition, duration = 1000) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        requestAnimationFrame(animation.bind(this));
    }

    // Easing function for smooth animations
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }, 0);
            });
        }
    }

    // Theme management (for future dark/light mode toggle)
    initThemeManager() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Listen for theme changes
        prefersDark.addListener((e) => {
            if (e.matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        });
    }

    // Enhanced glassmorphism effects
    enhanceGlassmorphism() {
        const glassElements = document.querySelectorAll('.glass-card, .glass-btn');
        
        glassElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                e.target.style.background = `
                    radial-gradient(circle at ${x}px ${y}px, 
                        rgba(255, 255, 255, 0.2) 0%, 
                        rgba(255, 255, 255, 0.1) 50%, 
                        transparent 100%),
                    var(--glass-bg)
                `;
            });
            
            element.addEventListener('mouseleave', (e) => {
                e.target.style.background = 'var(--glass-bg)';
            });
        });
    }

    // Keyboard navigation support
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC to close mobile menu
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
            
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Preload images for better performance
    preloadImages() {
        const imageUrls = [
            // Add any image URLs that need preloading
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
}

// ==========================================
// INITIALIZE APPLICATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new ModernPortfolio();
    
    // Enable performance monitoring in development
    if (window.location.hostname === 'localhost') {
        portfolio.measurePerformance();
    }
});

// ==========================================
// ADDITIONAL ENHANCEMENTS
// ==========================================

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Service Worker for offline functionality (optional)
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

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernPortfolio;
}