const notification = document.getElementById('notification');
const showButton = document.getElementById('showNotification');
const closeButton = document.querySelector('.close-btn');

let timeline = gsap.timeline({
    defaults: {
        duration: 0.5,
        ease: "back.out(1.7)"
    }
});

function showNotification() {
    // Reset notification position
    gsap.set(notification, {
        x: '100%',
        opacity: 0
    });

    // Animate notification entrance
    timeline.clear()
        .to(notification, {
            x: 0,
            opacity: 1
        })
        .from(notification, {
            scale: 0.8,
            duration: 0.2
        }, "<")
        .to(notification, {
            y: 10,
            duration: 0.15
        })
        .to(notification, {
            y: 0,
            duration: 0.3,
            ease: "elastic.out(1, 0.5)"
        });

    // Auto-hide after 5 seconds
    setTimeout(hideNotification, 5000);
}

function hideNotification() {
    timeline.clear()
        .to(notification, {
            x: '120%',
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
        });
}

// Event listeners
showButton.addEventListener('click', showNotification);
closeButton.addEventListener('click', hideNotification);

// Hover effect
notification.addEventListener('mouseenter', () => {
    gsap.to(notification, {
        scale: 1.02,
        duration: 0.2
    });
});

notification.addEventListener('mouseleave', () => {
    gsap.to(notification, {
        scale: 1,
        duration: 0.2
    });
});
