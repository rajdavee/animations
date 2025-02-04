class Typewriter {
    constructor() {
        this.textElements = document.querySelectorAll('.typewriter-text');
        this.cursors = document.querySelectorAll('.cursor');
        this.timelines = new Map();
        this.isTyping = false;
        
        this.init();
    }

    init() {
        this.textElements.forEach((element, index) => {
            // Create spans for each character
            const text = element.dataset.text;
            const chars = [...text].map(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'char';
                return span;
            });
            
            chars.forEach(char => {
                element.insertBefore(char, element.querySelector('.cursor'));
            });

            // Create timeline for this text element
            const tl = gsap.timeline({ paused: true });
            
            // Character animation
            tl.to(element.querySelectorAll('.char'), {
                opacity: 1,
                y: 0,
                duration: 0.05,
                stagger: 0.05,
                ease: "power1.out"
            });

            // Cursor animation
            tl.to(element.querySelector('.cursor'), {
                opacity: 1,
                duration: 0.1
            }, 0);

            this.timelines.set(element, tl);
        });

        this.bindEvents();
    }

    typeText() {
        if (this.isTyping) return;
        this.isTyping = true;

        this.timelines.forEach((timeline, element) => {
            const delay = element.classList.contains('delayed') ? 1 : 0;
            timeline.play().delay(delay);
        });

        const totalDuration = Math.max(...[...this.timelines.values()]
            .map(tl => tl.duration()));

        gsap.delayedCall(totalDuration + 1, () => {
            this.isTyping = false;
        });
    }

    deleteText() {
        if (this.isTyping) return;
        this.isTyping = true;

        this.timelines.forEach((timeline, element) => {
            const chars = element.querySelectorAll('.char');
            
            gsap.to(chars, {
                opacity: 0,
                y: 20,
                duration: 0.05,
                stagger: 0.02,
                ease: "power1.in",
                onComplete: () => {
                    this.isTyping = false;
                }
            });
        });
    }

    reset() {
        this.timelines.forEach(timeline => timeline.pause(0));
        this.isTyping = false;
        
        gsap.to('.char', {
            opacity: 0,
            y: 20,
            duration: 0.1
        });
    }

    bindEvents() {
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                
                // Button press animation
                gsap.to(btn, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });

                switch(action) {
                    case 'type': this.typeText(); break;
                    case 'delete': this.deleteText(); break;
                    case 'reset': this.reset(); break;
                }
            });
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new Typewriter();

    // Initial animation
    gsap.from('.typewriter-container', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from('.control-btn', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
    });
});
