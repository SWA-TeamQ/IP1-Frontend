// Safe, optional Spline viewer lazy-loader.
// Only activates if an element with id="splinePlaceholder" exists.

export function initSplineViewer() {
    const splinePlaceholder = document.getElementById("splinePlaceholder");
    if (!splinePlaceholder) return;
    if (splinePlaceholder.dataset.loaded) return;

    const loadSpline = () => {
        if (splinePlaceholder.dataset.loaded) return;
        const splineUrl = splinePlaceholder.dataset.splineUrl;
        if (!splineUrl) return;

        const script = document.createElement("script");
        script.type = "module";
        script.src =
            "https://unpkg.com/@splinetool/viewer@1.0.19/build/spline-viewer.js";
        script.onload = () => {
            const viewer = document.createElement("spline-viewer");
            viewer.url = splineUrl;
            splinePlaceholder.appendChild(viewer);
            splinePlaceholder.dataset.loaded = "true";
        };
        document.head.appendChild(script);
    };

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    loadSpline();
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(splinePlaceholder);
    } else {
        setTimeout(loadSpline, 300);
    }
}
