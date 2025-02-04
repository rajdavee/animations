class PageTransitions {
    constructor() {
        this.currentPage = 'home';
        this.isAnimating = false;
        this.panels = document.querySelectorAll('.overlay-panel');
        this.loader = document.querySelector('.transition-loader');
        this.init();
    }

    init() {
        this.bindEvents();
        this.showPage(this.currentPage);
    }

    async transitionTo(newPage) {
        if (this.isAnimating || newPage === this.currentPage) return;
        this.isAnimating = true;

        // Transition timeline
        const tl = gsap.timeline({
            onComplete: () => this.isAnimating = false
        });

        // Reveal panels
        tl.set(this.panels, { transformOrigin: 'left' })
          .to(this.panels, {
              scaleX: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.inOut"
          })
          .to(this.loader, {
              opacity: 1,
              visibility: 'visible',
              duration: 0.3
          })
          .to(this.loader.querySelector('.loader-circle'), {
              rotation: 360,
              duration: 1,
              ease: "none",
              repeat: -1
          })
          .add(() => {
              // Switch pages
              document.querySelector(`.page.active`).classList.remove('active');
              document.querySelector(`#${newPage}`).classList.add('active');
          })
          .to(this.loader, {
              opacity: 0,
              visibility: 'hidden',
              duration: 0.3
          })
          .set(this.panels, { transformOrigin: 'right' })
          .to(this.panels, {
              scaleX: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.inOut"
          });

        // Update current page
        this.currentPage = newPage;
    }

    showPage(page) {
        document.querySelector(`#${page}`).classList.add('active');
        
        // Initial page animation
        gsap.from(`#${page} > *`, {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    bindEvents() {
        // Navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.transitionTo(link.dataset.page);
                
                // Button animation
                gsap.from(link, {
                    scale: 0.9,
                    duration: 0.3,
                    ease: "back.out(2)"
                });
            });
        });

        // Add hover effects
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    y: -2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new PageTransitions();
});
