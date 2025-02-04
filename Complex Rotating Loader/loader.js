class ComplexLoader {
    constructor() {
        this.init();
    }

    init() {
        // Main rotation timeline
        const mainTl = gsap.timeline({ repeat: -1 });

        // Ring rotations
        mainTl.to('.ring.outer', {
            rotation: 360,
            duration: 4,
            ease: "none",
            repeat: -1
        }, 0).to('.ring.middle', {
            rotation: -360,
            duration: 3,
            ease: "none",
            repeat: -1
        }, 0).to('.ring.inner', {
            rotation: 360,
            duration: 2,
            ease: "none",
            repeat: -1
        }, 0);

        // Orbital dots animation
        gsap.to('.orbital-dots', {
            rotation: 360,
            duration: 3,
            ease: "none",
            repeat: -1
        });

        // Individual dot scaling
        gsap.to('.dot', {
            scale: 1.5,
            duration: 1,
            ease: "power1.inOut",
            stagger: {
                each: 0.5,
                repeat: -1,
                yoyo: true
            }
        });

        // Pulse animation
        gsap.to('.pulse', {
            scale: 1.5,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
            repeat: -1
        });

        // Core breathing effect
        gsap.to('.core', {
            scale: 1.2,
            duration: 0.8,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true
        });

        // Ring opacity variations
        const rings = document.querySelectorAll('.ring');
        rings.forEach((ring, i) => {
            gsap.to(ring, {
                opacity: 0.4,
                duration: 1 + i * 0.2,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            });
        });

        // Loading text animation
        gsap.to('.loader-text', {
            opacity: 0.4,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });

        // Add random direction changes
        setInterval(() => {
            const randomDuration = 2 + Math.random() * 2;
            const randomDelay = Math.random() * 2;
            
            gsap.to(['.ring.outer', '.ring.inner'], {
                rotation: '+=180',
                duration: randomDuration,
                delay: randomDelay,
                ease: "power1.inOut"
            });
        }, 5000);
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new ComplexLoader();
});
