const menuToggle = document.querySelector('.menu-toggle');
const menuItems = document.querySelector('.menu-items');
const items = document.querySelectorAll('.menu-item');

let isOpen = false;

menuToggle.addEventListener('click', () => {
    if (!isOpen) {
        menuItems.style.display = 'block';
        
        gsap.fromTo(items, {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out"
        });
    } else {
        gsap.to(items, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            stagger: {
                from: "end",
                amount: 0.1
            },
            onComplete: () => {
                menuItems.style.display = 'none';
            }
        });
    }
    
    isOpen = !isOpen;
});
