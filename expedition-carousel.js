document.querySelectorAll('.expedition-carousel').forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.expedition-carousel-slide'));
    const dots = Array.from(carousel.querySelectorAll('.expedition-carousel-dots button'));
    const count = carousel.querySelector('.expedition-carousel-count');
    const stage = carousel.querySelector('.expedition-carousel-stage');
    let current = 0;
    let start = null;
    let suppressClick = false;
    let timer;
    let hovered = false;
    let touching = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reducedMotion.matches;
    const schedule = () => {
        window.clearTimeout(timer);
        const stopped = paused || hovered || touching || document.hidden || carousel.contains(document.activeElement);
        count.setAttribute('aria-live', stopped ? 'polite' : 'off');
        if (!stopped) timer = window.setTimeout(() => show(current + 1), 3000);
    };
    const show = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            slide.hidden = false;
            slide.classList.toggle('is-active', i === current);
            slide.inert = i !== current;
            slide.setAttribute('aria-hidden', String(i !== current));
        });
        // Prepare the next photo before it fades into view.
        slides[(current + 1) % slides.length].querySelector('img').loading = 'eager';
        dots.forEach((dot, i) => { dot.setAttribute('aria-pressed', String(i === current)); });
        count.textContent = `${current + 1} / ${slides.length}`;
        schedule();
    };
    if (slides.length < 2) return;
    carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
    carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    carousel.addEventListener('focusin', schedule);
    carousel.addEventListener('focusout', () => window.setTimeout(schedule, 0));
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; schedule(); });
    carousel.querySelectorAll('.expedition-carousel-arrow, .expedition-carousel-controls').forEach((element) => { element.hidden = false; });
    carousel.querySelector('.expedition-carousel-prev').addEventListener('click', () => show(current - 1));
    carousel.querySelector('.expedition-carousel-next').addEventListener('click', () => show(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
    carousel.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        show(current + (event.key === 'ArrowRight' ? 1 : -1));
    });
    stage.addEventListener('touchstart', (event) => {
        touching = true;
        schedule();
        suppressClick = false;
        start = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    }, { passive: true });
    stage.addEventListener('touchend', (event) => {
        touching = false;
        schedule();
        if (!start || !event.changedTouches.length) return;
        const dx = event.changedTouches[0].clientX - start.x;
        const dy = event.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            suppressClick = true;
            show(current + (dx < 0 ? 1 : -1));
        }
        start = null;
    }, { passive: true });
    stage.addEventListener('touchcancel', () => { start = null; touching = false; schedule(); }, { passive: true });
    stage.addEventListener('click', (event) => {
        if (suppressClick) { event.preventDefault(); suppressClick = false; }
    }, true);
    show(0);
});
