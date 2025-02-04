class PricingCalculator {
    constructor() {
        this.basePrice = 29;
        this.userPrice = 2;
        this.storagePrice = 0.5;
        this.supportPrice = 10;
        this.backupPrice = 15;
        
        this.currentPrice = this.basePrice;
        this.features = {
            support: false,
            backup: false
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.animateEntry();
    }

    calculatePrice() {
        let total = this.basePrice;
        const users = parseInt(document.querySelector('[data-type="users"]').value);
        const storage = parseInt(document.querySelector('[data-type="storage"]').value);

        total += (users - 10) * this.userPrice;
        total += (storage - 5) * this.storagePrice;
        
        if(this.features.support) total += this.supportPrice;
        if(this.features.backup) total += this.backupPrice;

        return Math.round(total);
    }

    updatePrice(newPrice, animated = true) {
        const priceElement = document.querySelector('.price-value');
        const oldPrice = this.currentPrice;

        if(animated) {
            gsap.to(this, {
                currentPrice: newPrice,
                duration: 1,
                ease: "power2.out",
                onUpdate: () => {
                    priceElement.textContent = Math.round(this.currentPrice);
                }
            });

            // Bounce animation if price increases
            if(newPrice > oldPrice) {
                gsap.from(priceElement, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }

            // Show savings badge if price is significantly lower
            const savingsBadge = document.querySelector('.savings-badge');
            if(newPrice < oldPrice * 0.9) {
                gsap.to(savingsBadge, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
            } else {
                gsap.to(savingsBadge, {
                    opacity: 0,
                    y: 10,
                    duration: 0.3
                });
            }
        } else {
            priceElement.textContent = newPrice;
        }
    }

    bindEvents() {
        // Slider inputs
        document.querySelectorAll('.price-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                const type = e.target.dataset.type;
                const display = document.querySelector(`[data-value="${type}"]`);

                gsap.to(display, {
                    scale: 1.2,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out"
                });

                display.textContent = value;
                this.updatePrice(this.calculatePrice());
            });
        });

        // Feature toggles
        document.querySelectorAll('.feature-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const feature = toggle.dataset.feature;
                this.features[feature] = !this.features[feature];
                
                const timeline = gsap.timeline();

                if(this.features[feature]) {
                    toggle.classList.add('active');
                    timeline.to(toggle, {
                        backgroundColor: 'rgba(74, 158, 255, 0.2)',
                        duration: 0.3
                    });
                } else {
                    toggle.classList.remove('active');
                    timeline.to(toggle, {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        duration: 0.3
                    });
                }

                this.updatePrice(this.calculatePrice());
            });
        });

        // Subscribe button
        document.querySelector('.subscribe-btn').addEventListener('mouseenter', () => {
            gsap.to('.subscribe-btn', {
                scale: 1.05,
                duration: 0.3
            });
        });

        document.querySelector('.subscribe-btn').addEventListener('mouseleave', () => {
            gsap.to('.subscribe-btn', {
                scale: 1,
                duration: 0.3
            });
        });
    }

    animateEntry() {
        const tl = gsap.timeline();

        tl.from('.calculator-container', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
        .from('.input-group, .features, .total-price, .subscribe-btn', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }, '-=0.5');
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new PricingCalculator();
});
