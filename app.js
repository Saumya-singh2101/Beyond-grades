/**
 * EduReform AI - Core Application Logic
 * Handles authentication, navigation, and main app functionality
 */

class EduReformApp {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.currentPage = 'home';
        this.mobileMenuOpen = false;
        
        // Initialize app
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('Initializing EduReform AI...');
        
        // Check authentication status
        this.checkAuthentication();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup page-specific functionality
        this.setupPageFunctionality();
        
        // Initialize mobile responsiveness
        this.setupMobileHandling();

        console.log('EduReform AI initialized successfully');
    }

    /**
     * Check if user is authenticated
     */
    checkAuthentication() {
        const userData = localStorage.getItem('eduReformUser');
        const authToken = localStorage.getItem('eduReformAuth');
        
        if (userData && authToken) {
            this.currentUser = JSON.parse(userData);
            this.isAuthenticated = true;
            
            console.log('User authenticated:', this.currentUser.username);
        } else {
            this.isAuthenticated = false;
        }
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Handle page load
        document.addEventListener('DOMContentLoaded', () => {
            this.handlePageLoad();
        });

        // Handle page navigation
        window.addEventListener('popstate', (event) => {
            this.handleNavigation(event.state);
        });

        // Handle scroll effects
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Handle resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle clicks outside elements (for closing dropdowns, modals)
        document.addEventListener('click', (e) => {
            this.handleDocumentClick(e);
        });
    }

    /**
     * Setup page-specific functionality
     */
    setupPageFunctionality() {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('dashboard.html')) {
            this.currentPage = 'dashboard';
            this.setupDashboard();
        } else if (currentPath.includes('learning.html')) {
            this.currentPage = 'learning';
            this.setupLearningModule();
        } else if (currentPath.includes('educator.html')) {
            this.currentPage = 'educator';
            this.setupEducatorPanel();
        } else {
            this.currentPage = 'home';
            this.setupHomePage();
        }
    }

    /**
     * Setup home page functionality
     */
    setupHomePage() {
        // Animate hero elements on scroll
        this.animateOnScroll();
        
        // Setup feature card interactions
        this.setupFeatureCards();
        
        // Setup smooth scrolling for navigation
        this.setupSmoothScrolling();
    }

    /**
     * Setup dashboard functionality
     */
    setupDashboard() {
        // Auto-authenticate as student for demo
        this.currentUser = {
            username: 'Demo Student',
            userType: 'student',
            skills: this.generateDemoSkills(),
            interests: this.generateDemoInterests(),
            learningStyle: 'visual'
        };
        this.isAuthenticated = true;

        // Initialize dashboard components
        this.initializeDashboardCharts();
        this.loadUserProgress();
        this.setupQuickActions();
    }

    /**
     * Setup learning module
     */
    setupLearningModule() {
        // Auto-authenticate as student for demo
        this.currentUser = {
            username: 'Demo Student',
            userType: 'student',
            skills: this.generateDemoSkills(),
            interests: this.generateDemoInterests(),
            learningStyle: 'visual'
        };
        this.isAuthenticated = true;

        this.initializeLearningModules();
        this.setupDragAndDrop();
        this.setupScenarioGenerator();
    }

    /**
     * Setup educator panel
     */
    setupEducatorPanel() {
        // Auto-authenticate as educator for demo
        this.currentUser = {
            username: 'Demo Educator',
            userType: 'educator',
            skills: this.generateDemoSkills(),
            interests: this.generateDemoInterests(),
            learningStyle: 'visual'
        };
        this.isAuthenticated = true;

        this.initializeEducatorAnalytics();
        this.setupStudentTracking();
        this.setupExportFunctionality();
    }

    /**
     * Handle page load
     */
    handlePageLoad() {
        // Add loading animation
        this.showLoading();
        
        // Simulate loading time for better UX
        setTimeout(() => {
            this.hideLoading();
            this.addPageAnimations();
        }, 500);

        // Update navigation active state
        this.updateNavigationState();
    }

    /**
     * Handle navigation
     * @param {Object} state - Navigation state
     */
    handleNavigation(state) {
        if (state && state.page) {
            this.currentPage = state.page;
            this.updateNavigationState();
        }
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const nav = document.querySelector('.nav-container');
        
        // Update navigation background on scroll
        if (nav) {
            if (scrollTop > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        // Parallax effect for floating shapes
        this.updateFloatingShapes(scrollTop);
        
        // Animate elements on scroll
        this.animateOnScroll();
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.mobileMenuOpen) {
            this.toggleMobileMenu();
        }

        // Refresh any charts or graphics that need resizing
        this.refreshResponsiveElements();
    }

    /**
     * Handle document clicks
     * @param {Event} event - Click event
     */
    handleDocumentClick(event) {
        // Close mobile menu if clicking outside
        const nav = document.querySelector('.nav-container');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (this.mobileMenuOpen && nav && !nav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            this.toggleMobileMenu();
        }

        // Close any open dropdowns
        this.closeDropdowns(event);
    }

    /**
     * Show login modal
     */
    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('active');
            
            // Focus first input
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                setTimeout(() => usernameInput.focus(), 300);
            }
        }
    }

    /**
     * Hide login modal
     */
    hideLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * Handle user login
     */
    async handleLogin() {
        const username = document.getElementById('username')?.value.trim();
        const password = document.getElementById('password')?.value.trim();
        const userType = document.getElementById('userType')?.value;

        if (!username || !password) {
            this.showNotification('Please enter both username and password', 'error');
            return;
        }

        // Show loading state
        const loginBtn = document.querySelector('.btn-modal-primary');
        if (loginBtn) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
        }

        try {
            // Simulate authentication (in real app, this would be an API call)
            const success = await this.authenticateUser(username, password, userType);
            
            if (success) {
                this.showNotification('Login successful! Welcome to EduReform AI', 'success');
                this.hideLoginModal();
                
                // Redirect based on user type
                if (userType === 'educator') {
                    window.location.href = 'educator.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                this.showNotification('Invalid credentials. Try: student/demo or educator/demo', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Login failed. Please try again.', 'error');
        } finally {
            // Remove loading state
            if (loginBtn) {
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
        }
    }

    /**
     * Authenticate user (simulated)
     * @param {string} username - Username
     * @param {string} password - Password
     * @param {string} userType - User type
     * @returns {Promise<boolean>} - Success status
     */
    async authenticateUser(username, password, userType) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo authentication
        const validCredentials = [
            { username: 'student', password: 'demo', type: 'student' },
            { username: 'educator', password: 'demo', type: 'educator' },
            { username: 'admin', password: 'demo', type: 'educator' }
        ];

        const isValid = validCredentials.some(cred => 
            cred.username === username && 
            cred.password === password && 
            cred.type === userType
        );

        if (isValid) {
            // Create user session
            const user = {
                username,
                userType,
                loginTime: new Date().toISOString(),
                skills: this.generateDemoSkills(),
                interests: this.generateDemoInterests(),
                learningStyle: 'visual'
            };

            // Store in localStorage
            localStorage.setItem('eduReformUser', JSON.stringify(user));
            localStorage.setItem('eduReformAuth', this.generateAuthToken());
            
            this.currentUser = user;
            this.isAuthenticated = true;
            
            return true;
        }

        return false;
    }

    /**
     * Generate demo skills for user
     * @returns {Object} - Skills object
     */
    generateDemoSkills() {
        return {
            criticalThinking: Math.floor(Math.random() * 20) + 80,
            creativity: Math.floor(Math.random() * 30) + 60,
            analyticalReasoning: Math.floor(Math.random() * 15) + 85,
            communication: Math.floor(Math.random() * 25) + 65,
            research: Math.floor(Math.random() * 20) + 70,
            patternRecognition: Math.floor(Math.random() * 20) + 75
        };
    }

    /**
     * Generate demo interests for user
     * @returns {Array} - Interests array
     */
    generateDemoInterests() {
        const allInterests = [
            'History', 'Science', 'Mathematics', 'Literature', 'Art', 
            'Technology', 'Philosophy', 'Psychology', 'Economics', 'Politics'
        ];
        
        return allInterests.sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    /**
     * Generate authentication token
     * @returns {string} - Auth token
     */
    generateAuthToken() {
        return 'token_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    /**
     * Logout user
     */
    logout() {
        // Clear stored data
        localStorage.removeItem('eduReformUser');
        localStorage.removeItem('eduReformAuth');
        localStorage.removeItem('eduReformInsights');
        
        // Clear chat history
        if (window.eduReformChatbot) {
            window.eduReformChatbot.clearChat();
        }

        // Clear API history
        if (window.geminiAPI) {
            window.geminiAPI.clearHistory();
        }
        
        // Reset app state
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Show notification
        this.showNotification('Logged out successfully', 'info');
        
        // Redirect to home
        window.location.href = 'index.html';
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        const nav = document.querySelector('.nav-container');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (nav && menuBtn) {
            if (this.mobileMenuOpen) {
                nav.classList.add('mobile-menu-open');
                menuBtn.classList.add('active');
            } else {
                nav.classList.remove('mobile-menu-open');
                menuBtn.classList.remove('active');
            }
        }
    }

    /**
     * Scroll to features section
     */
    scrollToFeatures() {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    /**
     * Setup smooth scrolling for navigation links
     */
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Setup feature card interactions
     */
    setupFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const feature = card.dataset.feature;
                this.handleFeatureClick(feature);
            });
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-10px)';
            });
        });
    }

    /**
     * Handle feature card clicks
     * @param {string} feature - Feature identifier
     */
    handleFeatureClick(feature) {
        switch (feature) {
            case 'chatbot':
                if (window.eduReformChatbot) {
                    window.eduReformChatbot.toggleChat();
                }
                break;
            case 'skillmap':
                window.location.href = 'dashboard.html';
                break;
            case 'interactive':
                window.location.href = 'learning.html';
                break;
            case 'educator':
                window.location.href = 'educator.html';
                break;
        }
    }

    /**
     * Animate elements on scroll
     */
    animateOnScroll() {
        const animatedElements = document.querySelectorAll('.feature-card, .about-feature, .progress-item');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in');
            }
        });
    }

    /**
     * Update floating shapes position based on scroll
     * @param {number} scrollTop - Scroll position
     */
    updateFloatingShapes(scrollTop) {
        const shapes = document.querySelectorAll('.floating-shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollTop * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    }

    /**
     * Show loading animation
     */
    showLoading() {
        let loader = document.getElementById('globalLoader');
        
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.innerHTML = `
                <div class="loader-overlay">
                    <div class="loader-content">
                        <div class="loader-spinner"></div>
                        <div class="loader-text">Loading EduReform AI...</div>
                    </div>
                </div>
            `;
            
            // Add loader styles
            const loaderStyles = `
                .loader-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(12, 12, 12, 0.9);
                    z-index: 9999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .loader-content {
                    text-align: center;
                    color: #ffffff;
                }
                .loader-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(79, 172, 254, 0.3);
                    border-top: 3px solid #4facfe;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                .loader-text {
                    font-size: 1.1rem;
                    opacity: 0.8;
                }
            `;
            
            if (!document.getElementById('loaderStyles')) {
                const style = document.createElement('style');
                style.id = 'loaderStyles';
                style.textContent = loaderStyles;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(loader);
        }
        
        loader.style.display = 'block';
    }

    /**
     * Hide loading animation
     */
    hideLoading() {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                loader.style.opacity = '1';
            }, 300);
        }
    }

    /**
     * Add page animations
     */
    addPageAnimations() {
        const animatedElements = document.querySelectorAll('.hero-content, .feature-card, .glass-card');
        
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in');
            }, index * 100);
        });
    }

    /**
     * Update navigation active state
     */
    updateNavigationState() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Check if link matches current page
            const href = link.getAttribute('href');
            if (href === window.location.pathname || 
                (href === 'dashboard.html' && this.currentPage === 'dashboard') ||
                (href === 'learning.html' && this.currentPage === 'learning') ||
                (href === 'educator.html' && this.currentPage === 'educator')) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification');
        existing.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add notification styles
        const notificationStyles = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                color: #ffffff;
                font-weight: 500;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 400px;
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            }
            .notification-success {
                background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
            }
            .notification-error {
                background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
            }
            .notification-info {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = notificationStyles;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    /**
     * Redirect to login
     */
    redirectToLogin() {
        this.showNotification('Please log in to access this page', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    /**
     * Redirect to home
     */
    redirectToHome() {
        this.showNotification('Access denied', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // Placeholder methods for different sections
    initializeDashboardCharts() {
        console.log('Dashboard charts initialized');
    }

    loadUserProgress() {
        console.log('User progress loaded');
    }

    setupQuickActions() {
        console.log('Quick actions setup');
    }

    initializeLearningModules() {
        console.log('Learning modules initialized');
    }

    setupDragAndDrop() {
        console.log('Drag and drop setup');
    }

    setupScenarioGenerator() {
        console.log('Scenario generator setup');
    }

    initializeEducatorAnalytics() {
        console.log('Educator analytics initialized');
    }

    setupStudentTracking() {
        console.log('Student tracking setup');
    }

    setupExportFunctionality() {
        console.log('Export functionality setup');
    }

    setupMobileHandling() {
        console.log('Mobile handling setup');
    }

    refreshResponsiveElements() {
        console.log('Responsive elements refreshed');
    }

    closeDropdowns(event) {
        console.log('Dropdowns closed');
    }
}

// Global functions for HTML onclick events

function toggleMobileMenu() {
    if (window.eduReformApp) {
        window.eduReformApp.toggleMobileMenu();
    }
}

function scrollToFeatures() {
    if (window.eduReformApp) {
        window.eduReformApp.scrollToFeatures();
    }
}

// Initialize app when script loads
window.eduReformApp = new EduReformApp();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EduReformApp;
}