function createSpinnerAnimation() {
    // Create main timeline
    const mainTl = gsap.timeline({ repeat: -1 });

    // Spinner rotations
    mainTl.to('.spinner-outer .spinner-circle', {
        rotation: 360,
        duration: 2,
        ease: 'none',
        repeat: -1
    }, 0);

    mainTl.to('.spinner-middle .spinner-circle', {
        rotation: -360,
        duration: 3,
        ease: 'none',
        repeat: -1
    }, 0);

    mainTl.to('.spinner-inner .spinner-circle', {
        rotation: 360,
        duration: 4,
        ease: 'none',
        repeat: -1
    }, 0);

    // Pulse animation
    mainTl.to('.pulse', {
        scale: 1.5,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        repeat: -1
    }, 0);

    // Loading dots animation
    const dotsTl = gsap.timeline({ repeat: -1 });
    dotsTl.to('.dots', {
        text: {
            value: '...',
            delimiter: ''
        },
        duration: 1.5,
        repeat: -1,
        repeatDelay: 0.2,
        ease: 'none'
    });

    // Add hover interaction
    document.querySelector('.loader').addEventListener('mouseenter', () => {
        gsap.to(['.spinner-outer', '.spinner-middle', '.spinner-inner'], {
            scale: 1.1,
            duration: 0.3,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    });

    document.querySelector('.loader').addEventListener('mouseleave', () => {
        gsap.to(['.spinner-outer', '.spinner-middle', '.spinner-inner'], {
            scale: 1,
            duration: 0.3,
            stagger: {
                from: 'end',
                each: 0.1
            },
            ease: 'back.out(1.7)'
        });
    });

    // Initial reveal animation
    gsap.from('.loader', {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)'
    });

    gsap.from('.loader-text', {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
    });
}

// Initialize animation when page loads
window.addEventListener('load', createSpinnerAnimation);
