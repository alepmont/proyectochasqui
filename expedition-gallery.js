(() => {
    const links = Array.from(document.querySelectorAll('.expedition-gallery-link'));
    if (!links.length || typeof HTMLDialogElement === 'undefined') return;

    const dialog = document.createElement('dialog');
    dialog.className = 'expedition-lightbox';
    dialog.setAttribute('aria-label', 'Foto de la expedición ampliada');
    dialog.innerHTML = '<div class="expedition-lightbox-panel"><button type="button" class="expedition-lightbox-close" aria-label="Cerrar foto ampliada" autofocus>Cerrar <span aria-hidden="true">×</span></button><div class="expedition-lightbox-stage"><img alt=""><button type="button" class="expedition-lightbox-arrow expedition-lightbox-prev" aria-label="Foto anterior" aria-keyshortcuts="ArrowLeft">&#10094;</button><button type="button" class="expedition-lightbox-arrow expedition-lightbox-next" aria-label="Foto siguiente" aria-keyshortcuts="ArrowRight">&#10095;</button></div><div class="expedition-lightbox-count" aria-live="polite" aria-atomic="true"></div><p></p></div>';
    document.body.appendChild(dialog);
    const image = dialog.querySelector('img');
    const caption = dialog.querySelector('p');
    const counter = dialog.querySelector('.expedition-lightbox-count');
    const previous = dialog.querySelector('.expedition-lightbox-prev');
    const next = dialog.querySelector('.expedition-lightbox-next');
    let opener;
    let previousOverflow;
    let current = 0;
    const show = (index) => {
        current = (index + links.length) % links.length;
        const link = links[current];
        const thumbnail = link.querySelector('img');
        image.alt = thumbnail.alt;
        image.src = link.href;
        caption.textContent = thumbnail.alt;
        counter.textContent = `${current + 1} / ${links.length}`;
    };
    previous.hidden = next.hidden = links.length < 2;

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            if (typeof dialog.showModal !== 'function') return;
            event.preventDefault();
            opener = link;
            show(links.indexOf(link));
            previousOverflow = document.body.style.overflow;
            dialog.showModal();
            document.body.style.overflow = 'hidden';
        });
    });
    dialog.querySelector('.expedition-lightbox-close').addEventListener('click', () => dialog.close());
    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    dialog.addEventListener('keydown', (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        show(current + (event.key === 'ArrowRight' ? 1 : -1));
    });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
        document.body.style.overflow = previousOverflow;
        image.removeAttribute('src');
        opener?.focus({ preventScroll: true });
    });
})();
