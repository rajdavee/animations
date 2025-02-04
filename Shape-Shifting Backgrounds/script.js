const shapes = {
    geometric: {
        layer1: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        layer2: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        layer3: 'circle(50% at 50% 50%)'
    },
    organic: {
        layer1: 'circle(70% at 30% 50%)',
        layer2: 'circle(60% at 70% 30%)',
        layer3: 'circle(50% at 50% 70%)'
    },
    abstract: {
        layer1: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)',
        layer2: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
        layer3: 'polygon(0% 20%, 100% 50%, 100% 80%, 0% 50%)'
    }
};

class ShapeShifter {
    constructor() {
        this.layers = document.querySelectorAll('.shape-layer');
        this.currentShape = 'geometric';
        this.isAnimating = false;
        this.initializeAnimations();
        this.setupEventListeners();
    }

    initializeAnimations() {
        // Create ambient animation
        this.ambientTimeline = gsap.timeline({
            repeat: -1,
            yoyo: true,
            defaults: { duration: 10, ease: 'none' }
        });

        this.layers.forEach((layer, index) => {
            this.ambientTimeline.to(layer, {
                scale: 1.1 + (index * 0.1),
                rotation: 5 - (index * 2),
            }, 0);
        });
    }

    morphTo(shapeName) {
        if (this.isAnimating || this.currentShape === shapeName) return;
        this.isAnimating = true;
        this.currentShape = shapeName;

        const timeline = gsap.timeline({
            onComplete: () => this.isAnimating = false
        });

        this.layers.forEach((layer, index) => {
            timeline.to(layer, {
                clipPath: shapes[shapeName][`layer${index + 1}`],
                duration: 1.5,
                ease: "power2.inOut"
            }, index * 0.2);
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.shape-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const shape = btn.dataset.shape;
                this.morphTo(shape);

                // Button animation
                gsap.from(btn, {
                    scale: 0.9,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });

            // Hover effects
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.1,
                    duration: 0.3
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3
                });
            });
        });

        // Mouse movement parallax
        document.addEventListener('mousemove', (e) => {
            if (this.isAnimating) return;

            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            this.layers.forEach((layer, index) => {
                const depth = (index + 1) * 2;
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
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    const shapeShifter = new ShapeShifter();

    // Initial animation
    gsap.from('.shape-layer', {
        scale: 0,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out"
    });

    gsap.from('.content > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });
});
