// ============================================================================
// VTPOC DATA STORY - INTERACTIVE VISUALIZATIONS
// ============================================================================

/**
 * Initialize interactive tooltips for data visualizations
 */
function initializeVisualizationInteractivity() {
    // Add hover effects and tooltips to SVG elements
    const svgElements = document.querySelectorAll('.insight-viz circle, .insight-viz rect, .major-viz circle, .exploration-viz rect');
    
    svgElements.forEach(element => {
        element.style.cursor = 'pointer';
        element.style.transition = 'all 0.3s ease';
        
        element.addEventListener('mouseenter', function(e) {
            // Brighten on hover
            const originalOpacity = this.getAttribute('opacity') || '1';
            this.setAttribute('data-original-opacity', originalOpacity);
            this.setAttribute('opacity', Math.min(parseFloat(originalOpacity) + 0.2, 1));
            this.style.filter = 'brightness(1.2)';
        });
        
        element.addEventListener('mouseleave', function() {
            const originalOpacity = this.getAttribute('data-original-opacity') || '1';
            this.setAttribute('opacity', originalOpacity);
            this.style.filter = '';
        });
    });
}

/**
 * Initialize expandable/collapsible insight sections
 */
function initializeExpandableInsights() {
    const insightMajors = document.querySelectorAll('.insight-major');
    
    insightMajors.forEach((insight) => {
        const header = insight.querySelector('.insight-header');
        if (!header) return;
        
        // Add expand/collapse toggle button
        const toggleIcon = document.createElement('button');
        toggleIcon.className = 'insight-toggle';
        toggleIcon.innerHTML = '−'; // Expanded by default
        toggleIcon.setAttribute('aria-label', 'Toggle insight details');
        toggleIcon.setAttribute('aria-expanded', 'true');
        header.appendChild(toggleIcon);
        
        // Make header clickable
        header.style.cursor = 'pointer';
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        
        // Get collapsible content
        const vizContainer = insight.querySelector('.insight-viz-container');
        const takeaway = insight.querySelector('.insight-takeaway');
        const splitContent = insight.querySelector('.insight-split');
        
        const collapsibleContent = [vizContainer, takeaway, splitContent].filter(el => el);
        
        // Toggle function
        const toggleInsight = () => {
            const isExpanded = toggleIcon.innerHTML === '−';
            
            toggleIcon.innerHTML = isExpanded ? '+' : '−';
            toggleIcon.setAttribute('aria-expanded', !isExpanded);
            
            collapsibleContent.forEach(el => {
                if (isExpanded) {
                    // Collapse
                    el.style.maxHeight = '0';
                    el.style.opacity = '0';
                    el.style.marginTop = '0';
                    el.style.marginBottom = '0';
                    el.style.overflow = 'hidden';
                    el.style.transition = 'all 0.4s ease';
                } else {
                    // Expand
                    el.style.maxHeight = '5000px';
                    el.style.opacity = '1';
                    el.style.marginTop = '';
                    el.style.marginBottom = '';
                    el.style.overflow = 'visible';
                }
            });
            
            insight.classList.toggle('collapsed');
        };
        
        // Click handler
        header.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') return; // Don't toggle if clicking a link
            toggleInsight();
        });
        
        // Keyboard handler
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleInsight();
            }
        });
    });
}

/**
 * Initialize filter toggles for economic data visualization
 */
function initializeComparisonToggles() {
    const economicInsight = document.querySelectorAll('.insight-major')[1];
    if (!economicInsight) return;
    
    const economicViz = economicInsight.querySelector('.insight-viz-container');
    
    if (economicViz) {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'viz-toggle-container';
        toggleContainer.innerHTML = `
            <div class="viz-toggle-buttons">
                <button class="viz-toggle-btn active" data-view="all">All Indicators</button>
                <button class="viz-toggle-btn" data-view="housing">Housing Only</button>
                <button class="viz-toggle-btn" data-view="income">Income Only</button>
                <button class="viz-toggle-btn" data-view="growth">Business Growth</button>
            </div>
        `;
        
        economicViz.insertBefore(toggleContainer, economicViz.firstChild);
        
        const buttons = toggleContainer.querySelectorAll('.viz-toggle-btn');
        const svg = economicViz.querySelector('svg');
        const groups = svg.querySelectorAll('g');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const view = this.getAttribute('data-view');
                
                // Show/hide groups based on view
                groups.forEach((group, index) => {
                    group.style.transition = 'opacity 0.3s ease';
                    
                    if (view === 'all') {
                        group.style.opacity = '1';
                    } else if (view === 'housing' && index === 0) {
                        group.style.opacity = '1';
                    } else if (view === 'income' && index === 1) {
                        group.style.opacity = '1';
                    } else if (view === 'growth' && index === 2) {
                        group.style.opacity = '1';
                    } else {
                        group.style.opacity = '0.15';
                    }
                });
            });
        });
    }
}

/**
 * Animate visualizations when they scroll into view
 */
function animateInsightVizOnScroll() {
    const vizObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const svg = entry.target;
                const elements = svg.querySelectorAll('circle, rect, polyline, path');
                
                // Stagger animation of elements
                elements.forEach((el, index) => {
                    setTimeout(() => {
                        const originalOpacity = el.getAttribute('data-original-opacity') || el.getAttribute('opacity') || '1';
                        el.style.opacity = originalOpacity;
                        el.style.transform = 'scale(1)';
                    }, index * 40);
                });
                
                vizObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Set initial state and observe
    document.querySelectorAll('.insight-viz, .major-viz, .exploration-viz').forEach(svg => {
        const elements = svg.querySelectorAll('circle, rect, polyline, path');
        elements.forEach(el => {
            const originalOpacity = el.getAttribute('opacity') || '1';
            el.setAttribute('data-original-opacity', originalOpacity);
            el.style.opacity = '0';
            el.style.transform = 'scale(0.9)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        vizObserver.observe(svg);
    });
}

/**
 * Add click-to-highlight functionality for geographic visualization
 */
function initializeCountyInteraction() {
    const geoInsight = document.querySelectorAll('.insight-major')[0];
    if (!geoInsight) return;
    
    const geoViz = geoInsight.querySelector('.insight-viz');
    
    if (geoViz) {
        const circles = geoViz.querySelectorAll('circle');
        let selectedCircle = null;
        
        circles.forEach(circle => {
            circle.style.cursor = 'pointer';
            circle.style.transition = 'all 0.3s ease';
            
            circle.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Remove previous highlight
                if (selectedCircle && selectedCircle !== this) {
                    selectedCircle.style.filter = '';
                    selectedCircle.style.stroke = '';
                    selectedCircle.style.strokeWidth = '';
                }
                
                // Toggle this circle
                if (selectedCircle === this) {
                    this.style.filter = '';
                    this.style.stroke = '';
                    this.style.strokeWidth = '';
                    selectedCircle = null;
                } else {
                    this.style.filter = 'drop-shadow(0 0 12px #F4D35E)';
                    this.style.stroke = '#F4D35E';
                    this.style.strokeWidth = '3';
                    selectedCircle = this;
                    
                    // Highlight associated text
                    const cx = parseFloat(this.getAttribute('cx'));
                    const texts = geoViz.querySelectorAll('text');
                    texts.forEach(text => {
                        const tx = parseFloat(text.getAttribute('x'));
                        if (Math.abs(tx - cx) < 100) {
                            text.style.transition = 'all 0.3s ease';
                            text.style.fill = '#F4D35E';
                            text.style.fontWeight = 'bold';
                            setTimeout(() => {
                                text.style.fill = '';
                                text.style.fontWeight = '';
                            }, 2500);
                        }
                    });
                }
            });
        });
        
        // Click outside to deselect
        document.addEventListener('click', function() {
            if (selectedCircle) {
                selectedCircle.style.filter = '';
                selectedCircle.style.stroke = '';
                selectedCircle.style.strokeWidth = '';
                selectedCircle = null;
            }
        });
    }
}

/**
 * Add smooth scroll animation to section links
 */
function initializeSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Initialize progress indicator for scrolling
 */
function initializeScrollProgress() {
    let progressBar = document.getElementById('scroll-progress');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #F4D35E 0%, #1a3a52 100%);
            z-index: 9999;
            transition: width 0.2s ease;
        `;
        document.body.appendChild(progressBar);
    }
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/**
 * Initialize all interactive features
 */
function initializeAllInteractivity() {
    try {
        initializeVisualizationInteractivity();
        initializeExpandableInsights();
        initializeComparisonToggles();
        animateInsightVizOnScroll();
        initializeCountyInteraction();
        initializeSmoothScrollLinks();
        initializeScrollProgress();
        
        console.log('✓ Interactive features initialized');
    } catch (error) {
        console.error('Error initializing interactivity:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllInteractivity);
} else {
    initializeAllInteractivity();
}
