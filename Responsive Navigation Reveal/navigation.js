class NavigationController {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navItems = document.querySelectorAll('.nav-item');
        this.isOpen = false;
        this.isAnimating = false;
        
        this.timeline = gsap.timeline({ paused: true });
        this.initializeAnimations();
        this.bindEvents();
    }

    initializeAnimations() {
        this.timeline
            .to(this.navMenu, {
                height: 'auto',
                duration: 0.6,
                ease: 'power3.inOut',
                visibility: 'visible'
            })
            .to('.nav-link', {
                translateX: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: 'power2.out'
            }, '-=0.3')
            .from('.nav-item', {
                scale: 0.9,
                duration: 0.4,
                stagger: 0.08,
                ease: 'back.out(1.7)'
            }, '-=0.4');

        gsap.set('.nav-link', { translateX: -100, opacity: 0 });
    }

    toggleMenu() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.isOpen = !this.isOpen;
            this.menuToggle.classList.toggle('active');

            const tl = gsap.timeline({
                onComplete: () => this.isAnimating = false
            });

            if (this.isOpen) {
                tl.to(this.menuToggle.querySelectorAll('.bar'), {
                    backgroundColor: '#4a9eff',
                    stagger: 0.05,
                    duration: 0.2
                });
                this.timeline.play();
            } else {
                tl.to(this.menuToggle.querySelectorAll('.bar'), {
                    backgroundColor: '#ffffff',
                    stagger: 0.05,
                    duration: 0.2
                });
                this.timeline.reverse();
            }
        }
    }

    bindEvents() {
        // Menu toggle click
        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        // Nav link hover effects
        this.navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    scale: 1.1,
                    color: '#4a9eff',
                    duration: 0.3
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    scale: 1,
                    color: 'rgba(255, 255, 255, 0.7)',
                    duration: 0.3
                });
            });
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && this.isOpen) {
                    this.isOpen = false;
                    this.menuToggle.classList.remove('active');
                    this.timeline.progress(0).pause();
                    gsap.set(this.navMenu, { clearProps: 'all' });
                    gsap.set(this.navItems, { clearProps: 'all' });
                }
            }, 250);
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    const nav = new NavigationController();
    
    // Enhanced page load animation
    const entranceTimeline = gsap.timeline();
    
    entranceTimeline
        .from('.nav-brand', {
            y: -30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
        .from('.nav-link', {
            y: -20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.4');
});
