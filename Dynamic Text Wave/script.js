// Split text into spans
function splitText() {
    document.querySelectorAll('.wave-text').forEach(text => {
        const content = text.textContent;
        text.textContent = '';
        [...content].forEach(char => {
            if (char === ' ') {
                text.appendChild(document.createTextNode(' '));
            } else {
                const span = document.createElement('span');
                span.className = 'letter';
                span.textContent = char;
                text.appendChild(span);
            }
        });
    });
}

// Animation effects
const effects = {
    wave: letters => ({
        y: -20,
        stagger: {
            each: 0.05,
            from: "start"
        },
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1
    }),
    
    bounce: letters => ({
        y: -30,
        rotation: 15,
        stagger: {
            each: 0.1,
            from: "center"
        },
        ease: "elastic.out(1, 0.3)",
        duration: 1
    }),
    
    spiral: letters => ({
        rotation: 360,
        scale: 1.2,
        stagger: {
            each: 0.1,
            from: "random"
        },
        ease: "back.inOut(1.7)",
        duration: 1
    })
};

// Initialize
function init() {
    splitText();
    
    // Entry animation
    gsap.from('.letter', {
        opacity: 0,
        y: 50,
        rotateX: -90,
        stagger: {
            each: 0.05,
            from: "random"
        },
        duration: 1,
        ease: "back.out(1.7)"
    });

    // Add button listeners
    document.querySelectorAll('.wave-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const effect = effects[btn.dataset.effect];
            const letters = document.querySelectorAll('.letter');
            
            // Button feedback
            gsap.from(btn, {
                scale: 0.9,
                duration: 0.3,
                ease: "back.out(2)"
            });
            
            // Apply effect
            gsap.to(letters, effect(letters));
        });
    });

    // Add hover effect for letters
    document.querySelectorAll('.letter').forEach(letter => {
        letter.addEventListener('mouseenter', () => {
            gsap.to(letter, {
                y: -10,
                scale: 1.2,
                color: '#4a9eff',
                duration: 0.3,
                ease: "back.out(2)"
            });
        });

        letter.addEventListener('mouseleave', () => {
            gsap.to(letter, {
                y: 0,
                scale: 1,
                color: 'white',
                duration: 0.3,
                ease: "back.out(2)"
            });
        });
    });
}

// Start when page loads
window.addEventListener('load', init);
