class InteractiveList {
    constructor() {
        this.items = document.querySelectorAll('.list-item');
        this.init();
    }

    init() {
        this.setupItems();
        this.bindEvents();
        this.initialAnimation();
    }

    setupItems() {
        this.items.forEach((item, index) => {
            const color = item.dataset.color;
            const line = item.querySelector('.hover-line');
            line.style.background = color;
            
            // Set initial states
            gsap.set(item.querySelector('.item-indicator'), {
                opacity: 0,
                x: -20
            });
        });
    }

    animateItem(item, isEntering) {
        const content = item.querySelector('.item-content');
        const number = item.querySelector('.item-number');
        const indicator = item.querySelector('.item-indicator');
        const line = item.querySelector('.hover-line');
        const color = item.dataset.color;

        const tl = gsap.timeline();

        if (isEntering) {
            tl.to(item, {
                backgroundColor: `${color}15`,
                duration: 0.3
            })
            .to(number, {
                color: color,
                duration: 0.3
            }, 0)
            .to(content, {
                x: 10,
                duration: 0.4,
                ease: "power2.out"
            }, 0)
            .to(indicator, {
                opacity: 1,
                x: 0,
                duration: 0.4,
                ease: "power2.out"
            }, 0)
            .to(line, {
                scaleX: 1,
                duration: 0.4,
                ease: "power2.inOut"
            }, 0);
        } else {
            tl.to(item, {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                duration: 0.3
            })
            .to(number, {
                color: 'rgba(255, 255, 255, 0.3)',
                duration: 0.3
            }, 0)
            .to(content, {
                x: 0,
                duration: 0.4,
                ease: "power2.out"
            }, 0)
            .to(indicator, {
                opacity: 0,
                x: -20,
                duration: 0.4,
                ease: "power2.in"
            }, 0)
            .to(line, {
                scaleX: 0,
                duration: 0.4,
                ease: "power2.inOut"
            }, 0);
        }

        return tl;
    }

    bindEvents() {
        this.items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.animateItem(item, true);
            });

            item.addEventListener('mouseleave', () => {
                this.animateItem(item, false);
            });

            item.addEventListener('click', () => {
                gsap.to(item, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            });
        });
    }

    initialAnimation() {
        gsap.from(this.items, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new InteractiveList();
});
