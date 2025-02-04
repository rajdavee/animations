import animations from './animations.js';

const GITHUB_REPO = 'https://github.com/rajdavee/animations/tree/main';

function encodeGitHubPath(path) {
    // Split path into segments and encode each segment
    return path.split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');
}

let currentAnimations = [...animations];

function createAnimationCard(animation) {
    const card = document.createElement('div');
    card.className = 'animation-card';
    card.innerHTML = `
        <div class="card-content">
            <h3 class="card-title">${animation.title}</h3>
            <p class="card-description">${animation.description}</p>
            <div class="card-meta">
                <span class="category">${animation.category}</span>
                <div class="card-links">
                    <a href="${GITHUB_REPO}/${encodeGitHubPath(animation.githubPath)}" 
                       target="_blank" 
                       class="github-link" 
                       onclick="event.stopPropagation()"
                       title="View source code on GitHub">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                        </svg>
                        View Code
                    </a>
                    <button class="preview-btn">Preview</button>
                </div>
            </div>
        </div>
    `;
    
    const previewBtn = card.querySelector('.preview-btn');
    previewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPreview(animation);
    });
    
    return card;
}

function openPreview(animation) {
    const modal = document.getElementById('previewModal');
    const iframe = document.getElementById('previewFrame');
    const title = document.getElementById('previewTitle');
    
    iframe.src = animation.path;
    title.textContent = animation.title;
    
    // Store current animation path for refresh button
    modal.dataset.currentPath = animation.path;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    gsap.fromTo(modal, 
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );
}

// Add new preview control handlers
document.getElementById('refreshPreview').addEventListener('click', () => {
    const iframe = document.getElementById('previewFrame');
    iframe.src = iframe.src;
});

document.getElementById('openNewTab').addEventListener('click', () => {
    const modal = document.getElementById('previewModal');
    window.open(modal.dataset.currentPath, '_blank');
});

function closePreview() {
    const modal = document.getElementById('previewModal');
    document.body.style.overflow = 'auto';
    
    gsap.to(modal, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            modal.style.display = 'none';
            document.getElementById('previewFrame').src = '';
        }
    });
}

function filterAnimations() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    currentAnimations = animations.filter(animation => {
        const matchesSearch = animation.title.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || animation.category === category;
        return matchesSearch && matchesCategory;
    });
    
    renderAnimations();
}

function renderAnimations() {
    const grid = document.getElementById('animationsGrid');
    grid.innerHTML = '';
    
    currentAnimations.forEach(animation => {
        const card = createAnimationCard(animation);
        gsap.fromTo(card,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 }
        );
        grid.appendChild(card);
    });
}

// Event Listeners
document.querySelector('.close-modal').addEventListener('click', closePreview);
document.getElementById('searchInput').addEventListener('input', filterAnimations);
document.getElementById('categoryFilter').addEventListener('change', filterAnimations);

// Initial render
renderAnimations();

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePreview();
});
