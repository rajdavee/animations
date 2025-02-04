class SectionTransitions {
    constructor() {
        this.currentSection = 'home';
        this.isAnimating = false;
        this.overlays = document.querySelectorAll('.overlay');
        this.sections = document.querySelectorAll('.section');
        this.navButtons = document.querySelectorAll('.nav-btn');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupInitialState();
    }

    setupInitialState() {
        gsap.set(this.overlays, { transformOrigin: 'right center' });
        document.querySelector(`[data-section="${this.currentSection}"]`).classList.add('active');
    }

    async transitionTo(newSection) {
        if (this.isAnimating || newSection === this.currentSection) return;
        this.isAnimating = true;

        // Update navigation
        this.navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === newSection);
        });

        // Transition timeline
        const tl = gsap.timeline({
            onComplete: () => {
                this.currentSection = newSection;
                this.isAnimating = false;
            }
        });

        // Overlay animations
        tl.set(this.overlays, { transformOrigin: 'right center' })
          .to(this.overlays, {
              scaleX: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.in"
          })
          .add(() => {
              // Switch sections
              this.sections.forEach(section => {
                  section.classList.toggle('active', section.id === newSection);
              });
          })
          .set(this.overlays, { transformOrigin: 'left center' })
          .to(this.overlays, {
              scaleX: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out"
          });

        // Content animations
        tl.from(`#${newSection} > *`, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        }, "-=0.5");
    }

    bindEvents() {
        // Navigation clicks
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.transitionTo(btn.dataset.section);
            });

            // Hover effects
            btn.addEventListener('mouseenter', () => {
                if (!btn.classList.contains('active')) {
                    gsap.to(btn, {
                        scale: 1.1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            btn.addEventListener('mouseleave', () => {
                if (!btn.classList.contains('active')) {
                    gsap.to(btn, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const sections = ['home', 'about', 'projects', 'contact'];
            const currentIndex = sections.indexOf(this.currentSection);
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                const nextSection = sections[currentIndex + 1];
                if (nextSection) this.transitionTo(nextSection);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                const prevSection = sections[currentIndex - 1];
                if (prevSection) this.transitionTo(prevSection);
            }
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new SectionTransitions();
});
