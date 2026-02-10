// ============================================================================
// VTPOC DATA STORY - INTERACTIVE SCRIPTS
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollTracking();
    initializeStatCounters();
    initializeInteractivity();
});

// ============================================================================
// ANIMATIONS & SCROLL EFFECTS
// ============================================================================

/**
 * Initialize scroll-triggered animations
 */
function initializeScrollTracking() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and blocks
    document.querySelectorAll(
        '.context-card, .exploration-card, .insight-card, .implication-block, .timeline-item'
    ).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Animate stat numbers when they come into view
 */
function initializeStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = parseInt(entry.target.getAttribute('data-animate'), 10);
                animateNumber(entry.target, 0, target, 2000);
                entry.target.dataset.animated = 'true';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

/**
 * Animate a number from start to end value
 */
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + '%';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '%';
        }
    }, 16);
}

/**
 * Initialize general animations on page load
 */
function initializeAnimations() {
    // Add animation class to story sections
    document.querySelectorAll('.story-section').forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
}

// ============================================================================
// INTERACTIVITY
// ============================================================================

/**
 * Initialize interactive elements
 */
function initializeInteractivity() {
    addSmoothScrolling();
    addKeyboardNavigation();
    addAccessibilityFeatures();
    createProgressBar();
    addShareFunctionality();
}

/**
 * Add smooth scrolling for anchor links
 */
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Update URL without jumping
                window.history.pushState(null, null, '#' + targetId);
            }
        });
    });
}

/**
 * Add keyboard navigation (arrow keys)
 */
function addKeyboardNavigation() {
    const sections = Array.from(document.querySelectorAll('.story-section'));
    let currentSection = 0;

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
            currentSection++;
            sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' && currentSection > 0) {
            currentSection--;
            sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        }
    });
}

/**
 * Add accessibility features
 */
function addAccessibilityFeatures() {
    // Add ARIA labels
    document.querySelectorAll('.stat-block').forEach(block => {
        const number = block.querySelector('.stat-number').textContent;
        const label = block.querySelector('.stat-label').textContent;
        block.setAttribute('aria-label', `${number} - ${label}`);
    });

    // Add role to charts
    document.querySelectorAll('.sample-chart').forEach(chart => {
        chart.setAttribute('role', 'img');
        chart.setAttribute('aria-label', 'Data visualization showing BIPOC population growth');
    });

    // Add lang attributes where needed
    document.documentElement.setAttribute('lang', 'en');
}

/**
 * Create a progress bar showing scroll position
 */
function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #d4542a 0%, #c64226 100%);
        z-index: 1000;
        transition: width 0.1s ease;
        width: 0%;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercentage + '%';
    });
}

/**
 * Add share functionality
 */
function addShareFunctionality() {
    // Create share buttons in sections
    const sections = document.querySelectorAll('.story-section');
    
    sections.forEach(section => {
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.title = 'Share this section';
        shareBtn.innerHTML = '📤';
        shareBtn.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #d4542a;
            color: white;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 100;
        `;

        shareBtn.addEventListener('click', function() {
            shareSection(section);
        });

        // Show share button when section is in view
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                shareBtn.style.opacity = entry.isIntersecting ? '1' : '0';
                shareBtn.style.pointerEvents = entry.isIntersecting ? 'auto' : 'none';
            });
        }, { threshold: 0.3 });

        observer.observe(section);
    });
}

/**
 * Share a section
 */
function shareSection(section) {
    const sectionId = section.id || section.querySelector('h2')?.textContent || 'Data Story';
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    const text = `Check out this part of the VTPOC Data Story: ${sectionId}`;

    // Try native share API
    if (navigator.share) {
        navigator.share({
            title: 'VTPOC Data Story',
            text: text,
            url: url
        }).catch(err => console.log('Share cancelled'));
    } else {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy:', err);
        });
    }
}

/**
 * Show a temporary notification
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: #d4542a;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
        z-index: 1001;
        animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
    `;

    document.body.appendChild(notification);

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => notification.remove(), 3000);
}

// ============================================================================
// DATA INTERACTION (for future enhancements)
// ============================================================================

/**
 * Filter data by county (placeholder for future development)
 */
function filterByCounty(countyName) {
    console.log('Filtering data for county:', countyName);
    // Future implementation for county filtering
}

/**
 * Drill down to detailed view (placeholder for future development)
 */
function drillDown(datasetName) {
    console.log('Drilling down into:', datasetName);
    // Future implementation for drill-down functionality
}

/**
 * Export chart as image (placeholder for future development)
 */
function exportChart(chartElement, format = 'png') {
    console.log('Exporting chart as:', format);
    // Future implementation for chart export
}

/**
 * Export filtered data as CSV (placeholder for future development)
 */
function exportAsCSV(data) {
    console.log('Exporting data as CSV');
    // Future implementation for CSV export
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Debounce function for performance
 */
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

/**
 * Log analytics event (placeholder for future analytics integration)
 */
function logEvent(eventName, eventData = {}) {
    console.log('Event:', eventName, eventData);
    // Future implementation for analytics tracking
    // Example: gtag('event', eventName, eventData);
}

// Log page view
logEvent('page_view', { title: document.title });

// Log user interactions
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        logEvent('link_click', { href: e.target.href });
    }
});

// Log scroll depth
let maxScroll = 0;
window.addEventListener('scroll', debounce(function() {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        if (maxScroll % 25 === 0) {
            logEvent('scroll_depth', { depth: Math.round(maxScroll) + '%' });
        }
    }
}, 1000));
// ============================================================================
// MODAL FUNCTIONALITY
// ============================================================================

// Get all learn more links
const learnMoreLinks = document.querySelectorAll('.learn-more-link');

// Add click handlers to open modals
learnMoreLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    });
});

// Get all close buttons
const closeButtons = document.querySelectorAll('.modal-close');

// Add click handlers to close modals
closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    });
});

// Close modal when clicking outside of modal content
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});