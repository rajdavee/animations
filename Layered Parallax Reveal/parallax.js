gsap.registerPlugin(ScrollTrigger);

// Create floating elements animation
const floatingElements = document.querySelectorAll('.element');
floatingElements.forEach((element, index) => {
    gsap.set(element, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
    });
    
    gsap.to(element, {
        duration: 3 + index,
        x: '+=50',
        y: '+=30',
        rotation: 360,
        repeat: -1,
        yoyo: true,
        ease: 'none'
    });
});

// Initialize main parallax timeline
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".parallax-container",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
        anticipatePin: 1
    }
});

// Layer animations
tl.to(".background", {
    z: -100,
    scale: 1.1,
    ease: "none"
}, 0);

tl.to(".stars", {
    scale: 1.3,
    opacity: 0.1,
    ease: "none"
}, 0);

tl.to(".middle .content", {
    y: -150,
    z: 50,
    scale: 0.8,
    ease: "none"
}, 0);

tl.to(".foreground .content", {
    y: -300,
    z: 200,
    scale: 0.6,
    ease: "none"
}, 0);

// Initial reveal animation
gsap.from(".content > *", {
    y: 50,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: "power3.out"
});

// Ambient star movement
gsap.to(".stars", {
    backgroundPosition: "100px 100px",
    duration: 20,
    repeat: -1,
    ease: "none"
});

// Button hover effect
document.querySelector('.cta-button').addEventListener('mouseenter', () => {
    gsap.to('.cta-button', {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
    });
});

document.querySelector('.cta-button').addEventListener('mouseleave', () => {
    gsap.to('.cta-button', {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
    });
});
