class ParallaxEffect {
    constructor() {
        this.card = document.querySelector('.parallax-card');
        this.layers = document.querySelectorAll('.parallax-layer');
        this.bounds = this.card.getBoundingClientRect();
        this.mouseX = 0;
        this.mouseY = 0;
        this.centerX = this.bounds.width / 2;
        this.centerY = this.bounds.height / 2;
        this.initialX = 0;
        this.initialY = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.createParticles();
        this.animateParticles();
    }

    bindEvents() {
        this.card.addEventListener('mousemove', (e) => {
            const rect = this.card.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;

            // Update CSS variables for gradient position
            this.card.style.setProperty('--mouse-x', `${(this.mouseX / rect.width) * 100}%`);
            this.card.style.setProperty('--mouse-y', `${(this.mouseY / rect.height) * 100}%`);

            // Calculate rotation
            const rotateY = ((this.mouseX - this.centerX) / this.centerX) * 10;
            const rotateX = ((this.centerY - this.mouseY) / this.centerY) * 10;

            // Animate card rotation
            gsap.to(this.card, {
                rotationY: rotateY,
                rotationX: rotateX,
                duration: 0.5,
                ease: "power2.out"
            });

            // Animate layers with different intensities
            this.layers.forEach((layer, index) => {
                const depth = index * 20;
                const moveX = ((this.mouseX - this.centerX) / this.centerX) * depth;
                const moveY = ((this.mouseY - this.centerY) / this.centerY) * depth;

                gsap.to(layer, {
                    x: moveX,
                    y: moveY,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });

        // Reset animation on mouse leave
        this.card.addEventListener('mouseleave', () => {
            gsap.to([this.card, ...this.layers], {
                x: 0,
                y: 0,
                rotationY: 0,
                rotationX: 0,
                duration: 1,
                ease: "power3.out"
            });
        });

        // Button hover effect
        const button = document.querySelector('.explore-btn');
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                z: 40,
                scale: 1.1,
                duration: 0.3
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                z: 20,
                scale: 1,
                duration: 0.3
            });
        });

        // Handle resize
        window.addEventListener('resize', () => {
            this.bounds = this.card.getBoundingClientRect();
            this.centerX = this.bounds.width / 2;
            this.centerY = this.bounds.height / 2;
        });
    }

    createParticles() {
        const particlesContainer = document.querySelector('.particles');
        for(let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            particlesContainer.appendChild(particle);
        }
    }

    animateParticles() {
        gsap.to('.particles', {
            backgroundPosition: '100px 100px',
            duration: 20,
            repeat: -1,
            ease: "none"
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new ParallaxEffect();
});
