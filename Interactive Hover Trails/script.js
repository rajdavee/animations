const trailContainer = document.getElementById('trail-container');
const icons = document.querySelectorAll('.icon-wrapper');
let isHovering = false;
let currentIcon = null;
let lastX = 0;
let lastY = 0;

function createTrailElement(icon, x, y) {
    const trail = document.createElement('div');
    trail.className = 'trail';
    trail.textContent = icon;
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    trailContainer.appendChild(trail);

    // Animate the trail
    gsap.fromTo(trail, 
        {
            opacity: 0.8,
            scale: 0.8,
            x: 0,
            y: 0
        },
        {
            duration: 1,
            scale: 0.2,
            opacity: 0,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            ease: "power2.out",
            onComplete: () => trail.remove()
        }
    );
}

function handleMouseMove(e) {
    if (!isHovering) return;

    const distanceMoved = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    
    if (distanceMoved > 20) { // Only create trail after certain distance
        createTrailElement(currentIcon, e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
    }
}

icons.forEach(iconWrapper => {
    const icon = iconWrapper.querySelector('.icon');
    
    iconWrapper.addEventListener('mouseenter', () => {
        isHovering = true;
        currentIcon = iconWrapper.dataset.icon;
        
        // Scale up icon
        gsap.to(icon, {
            scale: 1.2,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    });

    iconWrapper.addEventListener('mouseleave', () => {
        isHovering = false;
        
        // Scale down icon
        gsap.to(icon, {
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    });
});

// Throttled mouse move handler
let timeout;
document.addEventListener('mousemove', (e) => {
    if (timeout) return;
    
    timeout = setTimeout(() => {
        handleMouseMove(e);
        timeout = null;
    }, 16); // Approximately 60fps
});

// Initial animation
gsap.from('.icon-wrapper', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "back.out(1.7)"
});
