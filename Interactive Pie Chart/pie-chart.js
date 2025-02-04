class PieChart {
    constructor() {
        this.data = [
            { label: 'Product A', value: 35, color: '#4a9eff' },
            { label: 'Product B', value: 25, color: '#6c63ff' },
            { label: 'Product C', value: 20, color: '#845ef7' },
            { label: 'Product D', value: 15, color: '#63ffdb' },
            { label: 'Others', value: 5, color: '#ff63c4' }
        ];
        
        this.svg = document.querySelector('.pie-chart');
        this.legend = document.querySelector('.legend');
        this.center = { x: 200, y: 200 };
        this.radius = 150;
        
        this.init();
    }

    createSector(startAngle, endAngle, color, index) {
        const x1 = this.center.x + this.radius * Math.cos(startAngle);
        const y1 = this.center.y + this.radius * Math.sin(startAngle);
        const x2 = this.center.x + this.radius * Math.cos(endAngle);
        const y2 = this.center.y + this.radius * Math.sin(endAngle);
        
        const largeArc = endAngle - startAngle <= Math.PI ? 0 : 1;
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `
            M ${this.center.x} ${this.center.y}
            L ${x1} ${y1}
            A ${this.radius} ${this.radius} 0 ${largeArc} 1 ${x2} ${y2}
            Z
        `);
        path.setAttribute("fill", color);
        path.setAttribute("class", "sector");
        path.setAttribute("data-index", index);
        
        return path;
    }

    createLegendItem(item, index) {
        const div = document.createElement('div');
        div.className = 'legend-item';
        div.innerHTML = `
            <div class="legend-color" style="background: ${item.color}"></div>
            <span class="legend-label">${item.label}</span>
            <span class="legend-value">${item.value}%</span>
        `;
        return div;
    }

    animateChart() {
        let currentAngle = -Math.PI / 2;
        const sectors = [];
        const legendItems = [];
        
        // Create and animate sectors
        this.data.forEach((item, index) => {
            const angle = (item.value / 100) * Math.PI * 2;
            const sector = this.createSector(
                currentAngle,
                currentAngle + angle,
                item.color,
                index
            );
            
            sector.style.opacity = 0;
            sector.style.transformOrigin = "center";
            this.svg.appendChild(sector);
            sectors.push(sector);
            
            // Create legend item
            const legendItem = this.createLegendItem(item, index);
            this.legend.appendChild(legendItem);
            legendItems.push(legendItem);
            
            currentAngle += angle;
        });

        // Animation timeline
        const tl = gsap.timeline();

        // Animate sectors
        tl.to(sectors, {
            opacity: 1,
            duration: 0.5,
            stagger: 0.2
        })
        .to(sectors, {
            rotation: 360,
            transformOrigin: "center",
            duration: 1,
            ease: "power2.out"
        }, 0)
        .from(legendItems, {
            opacity: 0,
            x: -20,
            duration: 0.5,
            stagger: 0.1
        }, 0.5);

        return tl;
    }

    addInteractivity() {
        this.svg.querySelectorAll('.sector').forEach(sector => {
            sector.addEventListener('mouseenter', () => {
                const index = sector.dataset.index;
                gsap.to(sector, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                gsap.to(`.legend-item:nth-child(${parseInt(index) + 1})`, {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    duration: 0.3
                });
            });

            sector.addEventListener('mouseleave', () => {
                const index = sector.dataset.index;
                gsap.to(sector, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                gsap.to(`.legend-item:nth-child(${parseInt(index) + 1})`, {
                    backgroundColor: 'transparent',
                    duration: 0.3
                });
            });
        });
    }

    init() {
        const timeline = this.animateChart();
        this.addInteractivity();

        // Replay button
        document.querySelector('.replay-btn').addEventListener('click', () => {
            this.svg.innerHTML = ''; // Clear existing sectors
            this.legend.innerHTML = ''; // Clear legend
            this.animateChart();
        });
    }
}

// Initialize when document is loaded
window.addEventListener('load', () => {
    new PieChart();
});
