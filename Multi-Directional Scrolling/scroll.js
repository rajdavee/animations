gsap.registerPlugin(ScrollTrigger);

class MultiDirectionalScroll {
    constructor() {
        this.initScrollAnimations();
    }

    initScrollAnimations() {
        // Horizontal scroll items
        const scrollItems = gsap.utils.toArray('.scroll-item');
        
        scrollItems.forEach((item, i) => {
            const speed = item.dataset.speed;
            
            gsap.to(item, {
                x: () => speed * window.innerWidth,
                scrollTrigger: {
                    trigger: '.scroll-section',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                    invalidateOnRefresh: true
                }
            });

            // Fade in animation
            gsap.to(item, {
                opacity: 1,
                x: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: item,
                    start: 'top center+=100',
                    end: 'bottom center',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Vertical floating texts
        const floatTexts = gsap.utils.toArray('.float-text');
        
        floatTexts.forEach(text => {
            const speed = text.dataset.speed;
            
            gsap.to(text, {
                y: () => speed * window.innerHeight,
                opacity: 1,
                scrollTrigger: {
                    trigger: '.scroll-section',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                    invalidateOnRefresh: true
                }
            });
        });

        // Parallax background effect
        gsap.to('.scroll-section', {
            backgroundPosition: `50% ${innerHeight / 2}px`,
            scrollTrigger: {
                trigger: '.scroll-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Hero section parallax
        gsap.to('.hero', {
            y: (i, target) => ScrollTrigger.maxScroll(window) * -0.3,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Content section reveal
        gsap.from('.content-section > *', {
            y: 100,
            opacity: 0,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.content-section',
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            }
        });
    }

    // Refresh ScrollTrigger on resize
    handleResize() {
        ScrollTrigger.refresh();
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    const scroller = new MultiDirectionalScroll();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        scroller.handleResize();
    });

    // Initial animations
    gsap.from('.hero h1', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
    });

    gsap.from('.hero .subtitle', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.5,
        ease: 'power3.out'
    });
});
