class LayeredReveal {
    constructor() {
        this.wrapper = document.querySelector('.image-wrapper');
        this.layers = document.querySelectorAll('.layer');
        this.currentState = 'hidden';
        
        this.init();
    }

    init() {
        // Initial states
        gsap.set('.layer', { 
            opacity: 0,
            scale: 1.1 
        });
        gsap.set('.content-overlay', { yPercent: 100 });
        gsap.set('.reveal-mask', { opacity: 0 });

        this.bindEvents();
        this.createTimeline();
    }

    createTimeline() {
        this.timeline = gsap.timeline({ paused: true })
            .to('.base-layer', {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out'
            })
            .to('.reveal-mask', {
                opacity: 0.3,
                duration: 0.4
            }, '-=0.4')
            .to('.middle-layer', {
                opacity: 1,
                scale: 1,
                duration: 0.8
            }, '-=0.2')
            .to('.top-layer', {
                opacity: 1,
                scale: 1,
                duration: 0.8
            }, '-=0.6')
            .to('.reveal-mask', {
                opacity: 0,
                duration: 0.4
            }, '-=0.4')
            .to('.content-overlay', {
                yPercent: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
    }

    reveal() {
        if (this.currentState === 'revealing') return;
        this.currentState = 'revealing';
        
        this.timeline.play().then(() => {
            this.currentState = 'revealed';
        });
    }

    reset() {
        if (this.currentState === 'hidden') return;
        this.currentState = 'hidden';
        
        this.timeline.reverse();
    }

    bindEvents() {
        // Reveal button
        const revealBtn = document.querySelector('.reveal-btn');
        revealBtn?.addEventListener('click', () => {
            this.reveal();
            gsap.to(revealBtn, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
        });

        // Reset button
        const resetBtn = document.querySelector('.reset-btn');
        resetBtn?.addEventListener('click', () => {
            this.reset();
            gsap.to(resetBtn, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
        });

        // Hover effects
        this.wrapper?.addEventListener('mouseenter', () => {
            if (this.currentState === 'revealed') {
                gsap.to('.reveal-mask', {
                    opacity: 0.15,
                    duration: 0.3
                });
            }
        });

        this.wrapper?.addEventListener('mouseleave', () => {
            gsap.to('.reveal-mask', {
                opacity: 0,
                duration: 0.3
            });
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    try {
        new LayeredReveal();

        // Initial entrance animation
        gsap.from('.gallery-container', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    } catch (error) {
        console.error('Error initializing LayeredReveal:', error);
    }
});
