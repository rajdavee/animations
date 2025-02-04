class CardCarousel {
    constructor() {
        this.currentIndex = 0;
        this.cards = [];
        this.isAnimating = false;
        this.cardCount = 5;
        
        this.init();
    }

    init() {
        // Generate cards dynamically
        const wrapper = document.querySelector('.cards-wrapper');
        
        for(let i = 1; i < this.cardCount; i++) {
            const card = document.querySelector('.card').cloneNode(true);
            card.dataset.index = i;
            card.querySelector('img').src = `https://picsum.photos/600/400?random=${i + 1}`;
            wrapper.appendChild(card);
        }

        this.cards = document.querySelectorAll('.card');
        this.createDots();
        this.positionCards();
        this.bindEvents();
        this.animateEntrance();
    }

    positionCards() {
        this.cards.forEach((card, index) => {
            const offset = index - this.currentIndex;
            const position = this.calculatePosition(offset);
            
            gsap.to(card, {
                x: position.x,
                z: position.z,
                rotation: position.rotation,
                scale: position.scale,
                opacity: position.opacity,
                duration: 0.6,
                ease: "power2.out"
            });
        });

        this.updateDots();
    }

    calculatePosition(offset) {
        const positions = {
            0: { x: '0%', z: 0, rotation: 0, scale: 1, opacity: 1 },
            1: { x: '100%', z: -100, rotation: 5, scale: 0.8, opacity: 0.6 },
            '-1': { x: '-100%', z: -100, rotation: -5, scale: 0.8, opacity: 0.6 },
            2: { x: '120%', z: -200, rotation: 10, scale: 0.6, opacity: 0.3 },
            '-2': { x: '-120%', z: -200, rotation: -10, scale: 0.6, opacity: 0.3 }
        };

        return positions[offset] || { x: 0, z: -300, rotation: 0, scale: 0, opacity: 0 };
    }

    nextCard() {
        if(this.isAnimating) return;
        this.isAnimating = true;
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.positionCards();
        
        gsap.delayedCall(0.6, () => this.isAnimating = false);
    }

    previousCard() {
        if(this.isAnimating) return;
        this.isAnimating = true;
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.positionCards();
        
        gsap.delayedCall(0.6, () => this.isAnimating = false);
    }

    createDots() {
        const dotsContainer = document.querySelector('.progress-dots');
        this.cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.addEventListener('click', () => this.goToCard(index));
            dotsContainer.appendChild(dot);
        });
    }

    updateDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToCard(index) {
        if(this.isAnimating || index === this.currentIndex) return;
        this.isAnimating = true;
        this.currentIndex = index;
        this.positionCards();
        
        gsap.delayedCall(0.6, () => this.isAnimating = false);
    }

    bindEvents() {
        document.querySelector('.next-btn').addEventListener('click', () => this.nextCard());
        document.querySelector('.prev-btn').addEventListener('click', () => this.previousCard());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowRight') this.nextCard();
            if(e.key === 'ArrowLeft') this.previousCard();
        });

        // Touch events
        let startX;
        document.querySelector('.carousel').addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        document.querySelector('.carousel').addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if(Math.abs(diff) > 50) {
                if(diff > 0) this.nextCard();
                else this.previousCard();
            }
        });
    }

    animateEntrance() {
        gsap.from('.carousel', {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        gsap.from('.card', {
            scale: 0,
            rotation: 15,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new CardCarousel();
});
