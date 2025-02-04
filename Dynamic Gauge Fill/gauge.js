class GaugeAnimation {
    constructor() {
        this.gauge = document.querySelector('.gauge-fill');
        this.gaugeBg = document.querySelector('.gauge-bg');
        this.valueText = document.querySelector('.gauge-value');
        this.slider = document.querySelector('.gauge-slider');
        this.buttons = document.querySelectorAll('.control-btn');
        this.currentValue = 0;
        this.isAnimating = false;

        this.init();
    }

    init() {
        // Set initial styles
        gsap.set(this.gauge, {
            stroke: 'url(#gaugeGradient)',
            strokeDasharray: '251.2',
            strokeDashoffset: '251.2'
        });

        gsap.set(this.gaugeBg, {
            stroke: 'rgba(255, 255, 255, 0.1)'
        });

        this.bindEvents();
        this.animateIn();
    }

    updateGauge(value) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const offset = 251.2 - (value / 100 * 251.2);
        
        gsap.timeline({
            onComplete: () => this.isAnimating = false
        })
        .to(this.gauge, {
            strokeDashoffset: offset,
            duration: 1,
            ease: "power2.out"
        })
        .to(this.valueText, {
            textContent: Math.round(value) + '%',
            duration: 1,
            ease: "power2.out",
            snap: { textContent: 1 }
        }, 0)
        .to(this.gauge, {
            stroke: this.getColor(value),
            duration: 0.5
        }, 0);

        this.currentValue = value;
    }

    getColor(value) {
        if (value < 30) return '#4a9eff';
        if (value < 70) return '#6c63ff';
        return '#63ffdb';
    }

    bindEvents() {
        this.slider.addEventListener('input', (e) => {
            this.updateGauge(parseFloat(e.target.value));
        });

        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = parseFloat(btn.dataset.value);
                this.slider.value = value;
                this.updateGauge(value);

                gsap.from(btn, {
                    scale: 0.95,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
        });
    }

    animateIn() {
        gsap.from(this.gauge, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: "back.out(1.7)"
        });

        gsap.from([this.slider, '.control-btn'], {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
}

// Initialize
window.addEventListener('load', () => {
    new GaugeAnimation();
});
