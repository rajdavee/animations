class FormAnimations {
    constructor() {
        this.inputs = document.querySelectorAll('input');
        this.form = document.querySelector('.animated-form');
        this.initializeAnimations();
    }

    initializeAnimations() {
        // Initial form entrance animation
        gsap.from('.form-container', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.form-group', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
        });

        // Setup input animations
        this.inputs.forEach(input => {
            const wrapper = input.closest('.input-wrapper');
            const indicator = wrapper.querySelector('.focus-indicator');
            const glow = wrapper.querySelector('.glow-effect');

            // Focus animations
            input.addEventListener('focus', () => {
                gsap.timeline()
                    .to(indicator, {
                        width: '100%',
                        duration: 0.3,
                        ease: 'power2.out'
                    })
                    .to(glow, {
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    }, 0)
                    .to(input, {
                        backgroundColor: 'rgba(255, 255, 255, 0.07)',
                        duration: 0.3
                    }, 0);
            });

            // Blur animations
            input.addEventListener('blur', () => {
                if (!input.value) {
                    gsap.timeline()
                        .to(indicator, {
                            width: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                        })
                        .to(glow, {
                            opacity: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                        }, 0)
                        .to(input, {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            duration: 0.3
                        }, 0);
                }
            });

            // Input value change animations
            input.addEventListener('input', () => {
                if (input.value) {
                    gsap.to(wrapper, {
                        scale: 1.02,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.out'
                    });
                }
            });
        });

        // Submit button hover effect
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.addEventListener('mouseenter', () => {
            gsap.to(submitBtn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        submitBtn.addEventListener('mouseleave', () => {
            gsap.to(submitBtn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        // Form submit animation
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            gsap.timeline()
                .to('.form-group', {
                    y: -10,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.3,
                    ease: 'power2.in'
                })
                .to('.submit-btn', {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.2
                }, '-=0.2')
                .to('.form-container', {
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        // Reset form after animation
                        setTimeout(() => {
                            this.form.reset();
                            this.resetAnimations();
                        }, 500);
                    }
                });
        });
    }

    resetAnimations() {
        gsap.timeline()
            .set('.form-container', { scale: 1, opacity: 1 })
            .set('.form-group', { y: 0, opacity: 1 })
            .set('.submit-btn', { scale: 1, opacity: 1 })
            .from('.form-group', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new FormAnimations();
});
