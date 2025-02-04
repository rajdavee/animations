class ZoomPanBackground {
    constructor() {
        this.layers = document.querySelectorAll('.bg-layer');
        this.isAnimating = false;
        this.currentScale = 1;
        this.maxScale = 1.5;
        this.init();
    }

    init() {
        this.createBaseAnimation();
        this.addInteractivity();
        this.initialAnimation();
    }

    createBaseAnimation() {
        // Pattern layer animation
        gsap.to('.pattern-layer', {
            rotation: 360,
            duration: 300,
            repeat: -1,
            ease: "none"
        });

        // Create main zoom/pan timeline
        const mainTl = gsap.timeline({
            repeat: -1,
            yoyo: true,
            ease: "none"
        });

        // Image layer animations
        this.layers.forEach((layer, index) => {
            if (layer.classList.contains('image-layer')) {
                mainTl.to(layer, {
                    scale: this.maxScale,
                    xPercent: gsap.utils.random(-10, 10),
                    yPercent: gsap.utils.random(-10, 10),
                    rotation: gsap.utils.random(-5, 5),
                    duration: 20,
                    ease: "none"
                }, 0);
            }
        });

        // Overlay pulse animation
        gsap.to('.overlay-layer', {
            opacity: 0.7,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    addInteractivity() {
        // Mouse parallax effect
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            this.layers.forEach((layer, index) => {
                const depth = index * 5;
                const moveX = (clientX - innerWidth / 2) / depth;
                const moveY = (clientY - innerHeight / 2) / depth;

                gsap.to(layer, {
                    x: moveX,
                    y: moveY,
                    duration: 1,
                    ease: "power2.out"
                });
            });
        });

        // Button interactions
        const ctaButton = document.querySelector('.cta-button');
        ctaButton.addEventListener('mouseenter', () => {
            gsap.to('.overlay-layer', {
                opacity: 0.4,
                duration: 0.3
            });
        });

        ctaButton.addEventListener('mouseleave', () => {
            gsap.to('.overlay-layer', {
                opacity: 0.6,
                duration: 0.3
            });
        });

        // Handle resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        // Adjust layer positions based on new window size
        this.layers.forEach(layer => {
            gsap.set(layer, {
                x: 0,
                y: 0,
                scale: 1
            });
        });
    }

    initialAnimation() {
        const tl = gsap.timeline();

        tl.from('.image-layer', {
            scale: 1.2,
            duration: 2,
            ease: "power2.out"
        })
        .from('.content > *', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)"
        }, '-=1.5');
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new ZoomPanBackground();
});
