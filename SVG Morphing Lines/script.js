gsap.registerPlugin(MotionPathPlugin);

const shapes = {
    wave: {
        path: "M100,200 C200,100 600,300 700,200",
        label: "Wave Pattern Analysis",
        dataPoints: 245
    },
    circle: {
        path: "M100,200 C250,50 550,350 700,200 S250,50 100,200",
        label: "Circular Data Flow",
        dataPoints: 360
    },
    zigzag: {
        path: "M100,200 L266,100 L433,300 L600,100 L700,200",
        label: "Growth Spike Pattern",
        dataPoints: 180
    }
};

// Initialize animation system
function initAnimation() {
    // Set initial paths
    const initialPath = shapes.wave.path;
    gsap.set('.guide-path', { attr: { d: initialPath }});
    gsap.set('.line-path', { attr: { d: initialPath }});
    
    // Create the dot animation
    const dotTimeline = gsap.timeline({
        repeat: -1,
        defaults: { duration: 3, ease: "none" }
    });

    // Animate dot along path
    dotTimeline.to('.dot-path', {
        motionPath: {
            path: '.line-path',
            align: '.line-path',
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        }
    });

    // Initial line draw animation
    gsap.from('.line-path', {
        strokeDasharray: 1000,
        strokeDashoffset: 1000,
        duration: 2,
        ease: "power2.out"
    });

    return dotTimeline;
}

// Handle morphing between shapes
function morphTo(shape, dotTimeline) {
    // Update active button state
    document.querySelectorAll('.morph-btn').forEach(btn => 
        btn.classList.remove('active'));
    document.querySelector(`[data-shape="${shape}"]`).classList.add('active');

    // Animate the path change
    gsap.to('.line-path', {
        attr: { d: shapes[shape].path },
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
            // Keep guide path in sync
            gsap.set('.guide-path', { 
                attr: { d: document.querySelector('.line-path').getAttribute('d') }
            });
        }
    });

    // Update counter
    gsap.to('.metric-value', {
        innerText: shapes[shape].dataPoints,
        duration: 1,
        snap: { innerText: 1 }
    });
}

// Initialize everything when the page loads
window.addEventListener('load', () => {
    const dotTimeline = initAnimation();

    // Set up button click handlers
    document.querySelectorAll('.morph-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const shape = btn.dataset.shape;
            morphTo(shape, dotTimeline);
        });
    });

    // Entry animations
    gsap.from('.container', {
        y: 30,
        opacity: 0,
        duration: 1
    });

    gsap.from('.morph-btn', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1
    });
});

// Add hover effects for buttons
document.querySelectorAll('.morph-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        if (!btn.classList.contains('active')) {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });

    btn.addEventListener('mouseleave', () => {
        if (!btn.classList.contains('active')) {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
});
