document.querySelectorAll('.card').forEach((card, index) => {
    // Initial state
    gsap.set(card.querySelector('.card-inner'), {
        transformPerspective: 1000
    });

    // Create timeline for each card
    const cardTl = gsap.timeline({ paused: true });
    
    cardTl
        .to(card.querySelector('.card-inner'), {
            rotationY: 180,
            duration: 0.8,
            ease: "power2.inOut"
        })
        .from(card.querySelector('.card-back'), {
            scale: 0.7,
            opacity: 0.5,
            duration: 0.4,
            ease: "power1.out"
        }, "-=0.4");

    // Entry animation
    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.2,
        ease: "power3.out"
    });

    // Hover effects
    card.addEventListener('mouseenter', () => {
        cardTl.play();
        gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        cardTl.reverse();
        gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    // Button hover effect
    const button = card.querySelector('.details-btn');
    if (button) {
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
    }
});
