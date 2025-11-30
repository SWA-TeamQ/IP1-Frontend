// Spline viewer lazy loading
const splinePlaceholder = document.getElementById("splinePlaceholder");

const loadSpline = () => {
    if (splinePlaceholder.dataset.loaded) return;

    const splineUrl = splinePlaceholder.dataset.splineUrl;
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.0.19/build/spline-viewer.js";
    script.onload = () => {
        const viewer = document.createElement("spline-viewer");
        viewer.url = splineUrl;
        splinePlaceholder.appendChild(viewer);
        splinePlaceholder.dataset.loaded = true;
    };
    document.head.appendChild(script);
};

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadSpline();
        observer.disconnect();
    }
}, { threshold: 0.1 });

observer.observe(splinePlaceholder);
