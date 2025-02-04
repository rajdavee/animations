class DynamicGraph {
    constructor() {
        this.data = Array.from({length: 12}, () => Math.floor(Math.random() * 80) + 20);
        this.barWidth = 40;
        this.maxHeight = 300;
        this.spacing = 60;
        
        this.init();
    }

    init() {
        this.setupGrid();
        this.createBars();
        this.bindEvents();
        this.initialAnimation();
    }

    setupGrid() {
        const gridGroup = document.querySelector('.grid-lines');
        for(let i = 0; i <= 10; i++) {
            const y = this.maxHeight - (i * (this.maxHeight / 10));
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", "50");
            line.setAttribute("x2", "750");
            line.setAttribute("y1", y);
            line.setAttribute("y2", y);
            gridGroup.appendChild(line);
        }
    }

    createBars() {
        const barsGroup = document.querySelector('.bars');
        const labelsGroup = document.querySelector('.x-labels');
        const valueLabelsGroup = document.querySelector('.value-labels');

        this.data.forEach((value, index) => {
            // Create bar
            const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            const x = 70 + (index * this.spacing);
            const height = (value / 100) * this.maxHeight;
            const y = this.maxHeight - height;

            bar.setAttribute("class", "bar");
            bar.setAttribute("x", x);
            bar.setAttribute("y", this.maxHeight);
            bar.setAttribute("width", this.barWidth);
            bar.setAttribute("height", 0);
            bar.setAttribute("data-value", value);

            // Create x-axis label
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.textContent = `Month ${index + 1}`;
            label.setAttribute("x", x + this.barWidth / 2);
            label.setAttribute("y", 20);

            // Create value label
            const valueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
            valueLabel.textContent = value;
            valueLabel.setAttribute("x", x + this.barWidth / 2);
            valueLabel.setAttribute("y", y - 10);
            valueLabel.setAttribute("opacity", 0);

            barsGroup.appendChild(bar);
            labelsGroup.appendChild(label);
            valueLabelsGroup.appendChild(valueLabel);
        });
    }

    updateData(type) {
        const newData = [...this.data];
        
        switch(type) {
            case 'random':
                newData.forEach((_, i) => newData[i] = Math.floor(Math.random() * 80) + 20);
                break;
            case 'growth':
                newData.forEach((val, i) => newData[i] = Math.min(val + 10, 100));
                break;
            case 'decline':
                newData.forEach((val, i) => newData[i] = Math.max(val - 10, 0));
                break;
        }

        this.animateUpdate(newData);
        this.data = newData;
    }

    animateUpdate(newData) {
        const bars = document.querySelectorAll('.bar');
        const valueLabels = document.querySelector('.value-labels').children;

        bars.forEach((bar, index) => {
            const newHeight = (newData[index] / 100) * this.maxHeight;
            const newY = this.maxHeight - newHeight;

            gsap.to(bar, {
                height: newHeight,
                y: newY,
                duration: 1,
                ease: "elastic.out(1, 0.5)"
            });

            gsap.to(valueLabels[index], {
                y: newY - 10,
                innerHTML: newData[index],
                duration: 1,
                ease: "power2.out"
            });
        });
    }

    bindEvents() {
        // Update button handlers
        document.querySelectorAll('.update-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.updateData(btn.dataset.type);
                
                gsap.from(btn, {
                    scale: 0.95,
                    duration: 0.3,
                    ease: "back.out(2)"
                });
            });
        });

        // Bar hover effects
        document.querySelectorAll('.bar').forEach(bar => {
            bar.addEventListener('mouseenter', (e) => {
                const tooltip = document.querySelector('.tooltip');
                const value = bar.getAttribute('data-value');
                
                tooltip.textContent = `Value: ${value}`;
                tooltip.style.opacity = 1;
                tooltip.style.transform = `translate(${e.clientX}px, ${e.clientY - 40}px)`;

                gsap.to(bar, {
                    scaleY: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            bar.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                tooltip.style.opacity = 0;

                gsap.to(bar, {
                    scaleY: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    initialAnimation() {
        const bars = document.querySelectorAll('.bar');
        const valueLabels = document.querySelector('.value-labels').children;

        bars.forEach((bar, index) => {
            const height = (this.data[index] / 100) * this.maxHeight;
            const y = this.maxHeight - height;

            gsap.to(bar, {
                height: height,
                y: y,
                duration: 1,
                delay: index * 0.1,
                ease: "elastic.out(1, 0.5)"
            });

            gsap.to(valueLabels[index], {
                opacity: 1,
                y: y - 10,
                duration: 1,
                delay: index * 0.1,
                ease: "power2.out"
            });
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new DynamicGraph();
});
