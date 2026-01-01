console.log("hi")
export function renderSkeletons(container, count = 8) {
    const skeletonHTML = `
        <div class="skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-price"></div>
            <div class="skeleton skeleton-button"></div>
        </div>
    `;
    
    // Inject the repeated skeleton HTML
    container.innerHTML = new Array(count).fill(skeletonHTML).join('');
}

