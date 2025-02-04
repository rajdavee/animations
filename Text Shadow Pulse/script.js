const text = document.querySelector('.pulse-text');
const toggleButton = document.getElementById('togglePulse');
let pulseTimeline;
let isAutoPulsing = false;

function createPulseEffect() {
    // Kill any existing timeline
    if (pulseTimeline) pulseTimeline.kill();
    
    // Create new timeline
    pulseTimeline = gsap.timeline({
        repeat: -1,
        yoyo: true
    });

    pulseTimeline
        .to(text, {
            duration: 0.8,
            textShadow: `
                0 0 20px rgba(255,255,255,0.8),
                0 0 40px rgba(255,255,255,0.4),
                0 0 60px rgba(255,255,255,0.2)
            `,
            ease: "sine.inOut"
        })
        .to(text, {
            duration: 0.8,
            textShadow: `
                0 0 5px rgba(255,255,255,0.3),
                0 0 10px rgba(255,255,255,0.2),
                0 0 15px rgba(255,255,255,0.1)
            `,
            ease: "sine.inOut"
        });

    return pulseTimeline;
}

// Hover effect
text.addEventListener('mouseenter', () => {
    if (!isAutoPulsing) {
        createPulseEffect();
    }
});

text.addEventListener('mouseleave', () => {
    if (!isAutoPulsing && pulseTimeline) {
        pulseTimeline.kill();
        gsap.to(text, {
            duration: 0.3,
            textShadow: '0 0 10px rgba(255,255,255,0)'
        });
    }
});

// Toggle auto-pulse
toggleButton.addEventListener('click', () => {
    isAutoPulsing = !isAutoPulsing;
    if (isAutoPulsing) {
        createPulseEffect();
        toggleButton.textContent = 'Stop Auto-Pulse';
    } else {
        if (pulseTimeline) {
            pulseTimeline.kill();
            gsap.to(text, {
                duration: 0.3,
                textShadow: '0 0 10px rgba(255,255,255,0)'
            });
        }
        toggleButton.textContent = 'Start Auto-Pulse';
    }
});
