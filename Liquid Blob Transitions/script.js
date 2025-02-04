gsap.registerPlugin(CustomEase);

// Custom easing for liquid effect
CustomEase.create("liquidSquish", "M0,0 C0.4,0 0.2,1 1,1");

// Define shape paths
const shapes = {
    circle: "M200,200 m-150,0 a150,150 0 1,0 300,0 a150,150 0 1,0 -300,0",
    square: "M50,50 L350,50 L350,350 L50,350 Z",
    star: "M200,50 L240,160 L350,160 L260,230 L300,350 L200,280 L100,350 L140,230 L50,160 L160,160 Z",
    random: () => {
        const points = 8;
        const radius = 150;
        const variance = 0.4;
        let path = "M";
        
        for(let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const variance_r = radius * (1 + (Math.random() - 0.5) * variance);
            const x = 200 + Math.cos(angle) * variance_r;
            const y = 200 + Math.sin(angle) * variance_r;
            
            if(i === 0) path += `${x},${y}`;
            else path += ` S${x},${y} ${x},${y}`;
        }
        return path + "Z";
    }
};

// Initialize blob
function initBlob() {
    const svg = document.querySelector('.blob-svg');
    
    // Add gradient and filter defs 
    svg.innerHTML = `
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" class="gradient-stop-1" stop-color="#4a9eff"/>
                <stop offset="100%" class="gradient-stop-2" stop-color="#6c63ff"/>
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        ${svg.innerHTML}
    `;
}

// Morph function
function morphTo(targetPath) {
    const path = typeof targetPath === 'function' ? targetPath() : targetPath;
    
    gsap.to('.blob', {
        attr: { d: path },
        duration: 1.5,
        ease: "liquidSquish",
        onStart: () => {
            gsap.to('.blob', {
                scale: 0.95,
                duration: 0.5,
                ease: "power2.inOut",
                yoyo: true,
                repeat: 1
            });
        }
    });
}

// Event listeners
document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const shape = btn.dataset.shape;
        morphTo(shapes[shape]);
        
        // Button animation
        gsap.from(btn, {
            scale: 0.9,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    });
});

// Mouse move effect
document.addEventListener('mousemove', (e) => {
    const blob = document.querySelector('.blob');
    const rect = blob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angleX = (e.clientX - centerX) * 0.01;
    const angleY = (e.clientY - centerY) * 0.01;
    
    gsap.to('.blob-svg', {
        rotationY: angleX,
        rotationX: -angleY,
        duration: 0.5,
        ease: "power1.out"
    });
});

// Initialize
window.addEventListener('load', () => {
    initBlob();
    morphTo(shapes.circle);
    
    // Entry animation
    gsap.from('.blob', {
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)"
    });
});
