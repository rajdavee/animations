class ChainedSequence {
    constructor() {
        this.items = document.querySelectorAll('.sequence-item');
        this.currentStep = 0;
        this.isAnimating = false;
        this.timeline = gsap.timeline({ paused: true });
        
        this.init();
    }

    init() {
        this.setupTimeline();
        this.bindEvents();
        this.showStep(0);
    }

    setupTimeline() {
        this.items.forEach((item, index) => {
            const card = item.querySelector('.content-card');
            const progressLine = item.querySelector('.progress-line');

            // Add to main timeline
            this.timeline.addLabel(`step${index}`)
                .to(item, {
                    opacity: 1,
                    visibility: 'visible',
                    duration: 0.5
                })
                .from(card, {
                    y: 30,
                    scale: 0.95,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                }, '<')
                .to(progressLine, {
                    width: '100%',
                    duration: 0.8,
                    ease: "power2.inOut"
                }, '<');

            // Add fade out after next item starts
            if (index < this.items.length - 1) {
                this.timeline.to(item, {
                    opacity: 0.3,
                    scale: 0.95,
                    duration: 0.5
                }, `step${index + 1}`);
            }
        });
    }

    showStep(step) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const progress = step / (this.items.length - 1);
        
        gsap.to(this.timeline, {
            progress: progress,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                this.currentStep = step;
                this.isAnimating = false;
                this.updateButtons();
            }
        });
    }

    next() {
        if (this.currentStep < this.items.length - 1) {
            this.showStep(this.currentStep + 1);
        }
    }

    previous() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    reset() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        gsap.to(this.timeline, {
            progress: 0,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                this.currentStep = 0;
                this.isAnimating = false;
                this.updateButtons();
            }
        });
    }

    updateButtons() {
        document.querySelector('.prev-btn').disabled = this.currentStep === 0;
        document.querySelector('.next-btn').disabled = this.currentStep === this.items.length - 1;
    }

    bindEvents() {
        document.querySelector('.next-btn').addEventListener('click', () => this.next());
        document.querySelector('.prev-btn').addEventListener('click', () => this.previous());
        document.querySelector('.reset-btn').addEventListener('click', () => this.reset());

        // Button hover animations
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                if (!btn.disabled) {
                    gsap.to(btn, {
                        scale: 1.05,
                        duration: 0.3
                    });
                }
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3
                });
            });
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new ChainedSequence();
});
