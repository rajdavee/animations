class ParticleExplosion {
    constructor() {
        this.svg = document.querySelector('.main-svg');
        this.particleGroup = document.querySelector('.particle-group');
        this.triggerCircle = document.querySelector('.trigger-circle');
        this.isAnimating = false;
        this.particles = [];
        this.particleCount = 30;
        
        this.init();
    }

    createParticle() {
        const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        particle.setAttribute("r", "5");
        particle.setAttribute("cx", "200");
        particle.setAttribute("cy", "200");
        particle.setAttribute("fill", this.getRandomColor());
        particle.classList.add("particle");
        return particle;
    }

    getRandomColor() {
        const colors = ['#4a9eff', '#6c63ff', '#63ffdb', '#ff63c4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    generateParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = this.createParticle();
            this.particleGroup.appendChild(particle);
            this.particles.push(particle);
        }
    }

    explode() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Initial burst animation
        gsap.to(this.triggerCircle, {
            r: 0,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in"
        });

        // Particle explosion
        this.particles.forEach((particle, i) => {
            const angle = (i / this.particleCount) * Math.PI * 2;
            const radius = 100 + Math.random() * 100;
            const duration = 0.6 + Math.random() * 0.8;

            gsap.to(particle, {
                cx: 200 + Math.cos(angle) * radius,
                cy: 200 + Math.sin(angle) * radius,
                r: 1 + Math.random() * 4,
                opacity: 0,
                duration: duration,
                ease: "power2.out",
                delay: Math.random() * 0.2
            });
        });

        // Add shockwave effect
        const shockwave = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        shockwave.setAttribute("cx", "200");
        shockwave.setAttribute("cy", "200");
        shockwave.setAttribute("r", "0");
        shockwave.setAttribute("stroke", "#4a9eff");
        shockwave.setAttribute("fill", "none");
        shockwave.setAttribute("stroke-width", "2");
        this.svg.appendChild(shockwave);

        gsap.to(shockwave, {
            r: 200,
            stroke: "transparent",
            strokeWidth: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                shockwave.remove();
                this.reset();
            }
        });
    }

    reset() {
        this.isAnimating = false;
        
        // Reset trigger circle
        gsap.to(this.triggerCircle, {
            r: 50,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        });

        // Reset particles
        this.particles.forEach(particle => {
            gsap.set(particle, {
                cx: 200,
                cy: 200,
                r: 5,
                opacity: 1
            });
        });
    }

    init() {
        this.generateParticles();
        
        // Event listeners
        this.triggerCircle.addEventListener('click', () => this.explode());
        document.querySelector('.explosion-btn').addEventListener('click', () => this.explode());
        document.querySelector('.reset-btn').addEventListener('click', () => this.reset());

        // Hover effects
        this.triggerCircle.addEventListener('mouseenter', () => {
            if (!this.isAnimating) {
                gsap.to(this.triggerCircle, {
                    fill: '#6c63ff',
                    duration: 0.3
                });
            }
        });

        this.triggerCircle.addEventListener('mouseleave', () => {
            if (!this.isAnimating) {
                gsap.to(this.triggerCircle, {
                    fill: '#4a9eff',
                    duration: 0.3
                });
            }
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new ParticleExplosion();
});
