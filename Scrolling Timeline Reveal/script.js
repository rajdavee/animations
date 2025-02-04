gsap.registerPlugin(ScrollTrigger);

function initTimeline() {
    // Animate the progress bar
    gsap.to('.progress-bar', {
        scaleY: 1,
        transformOrigin: 'top',
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top center',
            end: 'bottom center',
            scrub: true
        }
    });

    // Animate each timeline item
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const card = item.querySelector('.content-card');
        
        // Timeline item appearance
        gsap.to(item, {
            opacity: 1,
            scrollTrigger: {
                trigger: item,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            }
        });

        // Card sliding animation
        gsap.to(card, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            }
        });

        // Year bubble animation
        gsap.from(item.querySelector('.year'), {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: item,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            }
        });

        // Icon animation
        gsap.from(item.querySelector('.milestone-icon'), {
            scale: 0,
            rotation: 180,
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: item,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    // Initial title animation
    gsap.from('.title', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Initialize timeline animations
    initTimeline();
});

// Refresh ScrollTrigger on resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
