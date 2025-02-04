gsap.registerPlugin(CustomEase);

// Custom easing curves
CustomEase.create("bounceOut", "M0,0 C0.4,0 0.2,1 1,1");
CustomEase.create("elasticOut", "M0,0 C0.4,0 0.3,1 0.7,0.9 S0.8,1 1,1");

class ModalController {
    constructor() {
        this.activeModal = null;
        this.initializeListeners();
    }

    initializeListeners() {
        // Trigger buttons
        document.querySelectorAll('.trigger-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalType = btn.dataset.modal;
                this.openModal(`${modalType}-modal`);
            });
        });

        // Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Overlay click
        document.querySelector('.modal-overlay').addEventListener('click', 
            () => this.closeModal());
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.querySelector('.modal-overlay');
        this.activeModal = modal;

        // Show overlay
        gsap.to(overlay, {
            opacity: 1,
            visibility: 'visible',
            duration: 0.3,
            ease: 'power2.out'
        });

        // Animate modal
        gsap.fromTo(modal, 
            {
                opacity: 0,
                visibility: 'visible',
                scale: 0.8,
                y: 50
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: "elasticOut",
                onComplete: () => {
                    this.addModalInteractivity(modal);
                }
            }
        );
    }

    closeModal() {
        if (!this.activeModal) return;

        const overlay = document.querySelector('.modal-overlay');
        
        gsap.to(this.activeModal, {
            opacity: 0,
            scale: 0.8,
            y: 50,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                this.activeModal.style.visibility = 'hidden';
                this.activeModal = null;
            }
        });

        gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => overlay.style.visibility = 'hidden'
        });
    }

    addModalInteractivity(modal) {
        // Add hover effects to buttons
        modal.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
        });
    }
}

// Initialize
window.addEventListener('load', () => {
    new ModalController();
    
    // Animate in trigger buttons
    gsap.from('.trigger-btn', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
    });
});
