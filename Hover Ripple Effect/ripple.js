class RippleEffect {
    constructor() {
        this.elements = document.querySelectorAll('[class*="ripple-"]');
        this.bindEvents();
    }

    createRipple(event, element) {
        // Get element position
        const rect = element.getBoundingClientRect();
        
        // Calculate ripple position
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Create ripple element
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        element.appendChild(ripple);

        // Set ripple position
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Calculate ripple size
        const size = Math.max(element.offsetWidth, element.offsetHeight);
        ripple.style.width = ripple.style.height = `${size}px`;

        // Animate ripple
        const timeline = gsap.timeline({
            onComplete: () => ripple.remove()
        });

        timeline
            .set(ripple, {
                x: -size/2,
                y: -size/2,
                alpha: 0.5
            })
            .to(ripple, {
                scale: 2,
                alpha: 0,
                duration: 1,
                ease: "power2.out"
            });
    }

    createHoverRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        gsap.to(element, {
            duration: 0.5,
            background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)`,
            ease: "none"
        });
    }

    bindEvents() {
        this.elements.forEach(element => {
            // Click ripple
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
                
                // Scale effect
                gsap.to(element, {
                    scale: 0.98,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out"
                });
            });

            // Hover effect
            element.addEventListener('mousemove', (e) => {
                this.createHoverRipple(e, element);
            });

            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    background: element.classList.contains('primary') 
                        ? 'linear-gradient(45deg, #4a9eff, #6c63ff)'
                        : 'rgba(255, 255, 255, 0.05)',
                    duration: 0.5
                });
            });
        });

        // Initial animation
        gsap.from(this.elements, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new RippleEffect();
});
