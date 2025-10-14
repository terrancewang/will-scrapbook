// Wait for the entire HTML document to be loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Select all the scrapbook pages we want to animate
    const scrapbookPages = document.querySelectorAll('.scrapbook-page');

    // Set up the Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the element is intersecting the viewport (i.e., on screen)
            if (entry.isIntersecting) {
                // Add a slight delay for smoother animation
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, 100);
            } else {
                // When scrolling back and element goes out of view, remove the visible class
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        root: null, // observes intersections relative to the viewport
        threshold: 0.1 // Triggers when 10% of the element is visible
    });

    // Tell the observer to watch each of our scrapbook pages
    scrapbookPages.forEach(page => {
        observer.observe(page);
    });

    // Title screen fade effect based on scroll position
    const titleContent = document.querySelector('.title-content');
    const titleScreen = document.querySelector('.title-screen');
    
    const handleTitleFade = () => {
        const scrollLeft = timelineContainer.scrollLeft;
        const titleScreenWidth = titleScreen.offsetWidth;
        
        // Calculate fade based on how much we've scrolled past the title screen
        const fadeStart = titleScreenWidth * 0.1; // Start fading when 10% past title screen
        const fadeEnd = titleScreenWidth * 0.4; // Complete fade when 40% past title screen
        
        if (scrollLeft >= fadeStart && scrollLeft <= fadeEnd) {
            const fadeProgress = (scrollLeft - fadeStart) / (fadeEnd - fadeStart);
            titleContent.style.opacity = 1 - fadeProgress;
            titleContent.style.transform = `translateY(${-fadeProgress * 50}px)`;
        } else if (scrollLeft > fadeEnd) {
            titleContent.style.opacity = 0;
            titleContent.style.transform = 'translateY(-50px)';
        } else {
            titleContent.style.opacity = 1;
            titleContent.style.transform = 'translateY(0)';
        }
    };
    
    // Listen for scroll events
    timelineContainer.addEventListener('scroll', handleTitleFade);
    
    // Initial call to set correct state
    handleTitleFade();

    // Timeline line animation based on scroll
    const handleTimelineAnimation = () => {
        const scrollLeft = timelineContainer.scrollLeft;
        const maxScroll = timelineContainer.scrollWidth - timelineContainer.clientWidth;
        
        // Calculate the percentage of scroll progress
        const scrollProgress = Math.min(scrollLeft / maxScroll, 1);
        
        // Update the timeline line width based on scroll progress
        const timelineLine = document.querySelector('.timeline-container::before');
        if (timelineLine) {
            timelineLine.style.width = `${scrollProgress * 100}%`;
        }
        
        // Use CSS custom property to update the pseudo-element
        document.documentElement.style.setProperty('--timeline-width', `${scrollProgress * 100}%`);
    };
    
    // Listen for scroll events on timeline animation
    timelineContainer.addEventListener('scroll', handleTimelineAnimation);
    
    // Initial call to set correct state
    handleTimelineAnimation();

});

const timelineContainer = document.querySelector('.timeline-container');

// Variables for acceleration tracking
let lastScrollTime = 0;
let scrollVelocity = 0;
let isScrolling = false;

// Simple and effective wheel scrolling with acceleration
timelineContainer.addEventListener('wheel', (event) => {
    // Prevent the default vertical scroll
    event.preventDefault();

    const currentTime = Date.now();
    const timeDelta = currentTime - lastScrollTime;
    lastScrollTime = currentTime;

    // Calculate base scroll amount
    const baseScrollAmount = event.deltaY * 2.0;
    
    // Calculate velocity for acceleration
    if (timeDelta < 50) { // If scrolling quickly (within 50ms)
        scrollVelocity = Math.min(scrollVelocity + 0.5, 3.0); // Cap acceleration at 2.5x
    } else {
        scrollVelocity = Math.max(scrollVelocity - 0.1, 1.0); // Decay back to normal
    }
    
    // Apply acceleration
    const acceleratedScrollAmount = baseScrollAmount * scrollVelocity;
    
    timelineContainer.scrollLeft += acceleratedScrollAmount;
    
    // Set scrolling state for velocity decay
    isScrolling = true;
    clearTimeout(timelineContainer.scrollTimeout);
    timelineContainer.scrollTimeout = setTimeout(() => {
        isScrolling = false;
        scrollVelocity = 1.0; // Reset to normal speed
    }, 100);
}, { passive: false });