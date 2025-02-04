const gradientContainer = document.querySelector('.gradient-container');
const buttons = document.querySelectorAll('button');

const themes = {
    sunset: {
        from: '#ff6b6b',
        to: '#4ecdc4'
    },
    ocean: {
        from: '#2193b0',
        to: '#6dd5ed'
    },
    forest: {
        from: '#11998e',
        to: '#38ef7d'
    },
    aurora: {
        from: '#4e54c8',
        to: '#8f94fb'
    }
};

function updateGradient(theme) {
    gsap.to(gradientContainer, {
        duration: 1.5,
        ease: "power2.inOut",
        backgroundImage: `linear-gradient(45deg, ${themes[theme].from}, ${themes[theme].to})`,
        onUpdate: function() {
            // Add subtle rotation during transition
            gsap.to(gradientContainer, {
                duration: 0.5,
                backgroundSize: "200% 200%",
                backgroundPosition: "100% 100%",
                ease: "none"
            });
        },
        onComplete: function() {
            gsap.to(gradientContainer, {
                duration: 0.5,
                backgroundSize: "100% 100%",
                backgroundPosition: "0% 0%",
                ease: "power2.out"
            });
        }
    });
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        updateGradient(theme);
    });
});

// Add hover effect to indicate interactivity
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.1,
            duration: 0.3
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3
        });
    });
});
