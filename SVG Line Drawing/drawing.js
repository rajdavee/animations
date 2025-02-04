class SVGDrawing {
    constructor() {
        this.paths = document.querySelectorAll('.draw-path');
        this.isDrawing = false;
        this.timeline = gsap.timeline({ paused: true });
        this.drawSpeed = 1;
        
        this.init();
    }

    init() {
        this.setupTimeline();
        this.bindEvents();
        this.initialAnimation();
    }

    setupTimeline() {
        const pathGroups = {
            geometric: document.querySelector('.geometric'),
            circles: document.querySelector('.circles'),
            wave: document.querySelector('.wave'),
            connections: document.querySelector('.connections'),
            decorative: document.querySelector('.decorative')
        };

        // Set initial states
        Object.values(pathGroups).forEach(path => {
            const length = path.getTotalLength();
            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length
            });
        });

        // Build sequential animation
        this.timeline
            .to(pathGroups.geometric, {
                strokeDashoffset: 0,
                duration: 1.5,
                ease: "power2.inOut"
            })
            .to(pathGroups.circles, {
                strokeDashoffset: 0,
                duration: 2,
                ease: "power1.inOut"
            }, "-=0.5")
            .to(pathGroups.connections, {
                strokeDashoffset: 0,
                duration: 1,
                ease: "power1.inOut"
            }, "-=1")
            .to(pathGroups.wave, {
                strokeDashoffset: 0,
                duration: 2,
                ease: "power2.out"
            }, "-=0.5")
            .to(pathGroups.decorative, {
                strokeDashoffset: 0,
                duration: 1.5,
                ease: "power1.inOut"
            }, "-=1");
    }

    draw() {
        if (this.isDrawing) return;
        this.isDrawing = true;

        this.timeline.timeScale(this.drawSpeed);
        this.timeline.play();

        gsap.to('.draw-btn', {
            scale: 0.95,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
    }

    erase() {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        this.timeline.timeScale(this.drawSpeed * 1.5);
        this.timeline.reverse();

        gsap.to('.erase-btn', {
            scale: 0.95,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
    }

    updateSpeed(speed) {
        this.drawSpeed = speed;
        if (this.timeline.isActive()) {
            this.timeline.timeScale(speed);
        }
    }

    bindEvents() {
        // Draw button
        document.querySelector('.draw-btn').addEventListener('click', () => this.draw());

        // Erase button
        document.querySelector('.erase-btn').addEventListener('click', () => this.erase());

        // Speed slider
        document.querySelector('.speed-slider').addEventListener('input', (e) => {
            this.updateSpeed(parseFloat(e.target.value));
        });

        // Button hover effects
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
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
    }

    initialAnimation() {
        gsap.from('.drawing-container', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        gsap.from('.controls > *', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new SVGDrawing();
});
