(() => {
    const links = document.querySelectorAll('.expedition-gallery-link');
    if (!links.length || typeof HTMLDialogElement === 'undefined') return;

    const dialog = document.createElement('dialog');
    dialog.className = 'expedition-lightbox';
    dialog.setAttribute('aria-label', 'Foto de la expedición ampliada');
    dialog.innerHTML = '<div class="expedition-lightbox-panel"><button type="button" class="expedition-lightbox-close" aria-label="Cerrar foto ampliada" autofocus>Cerrar <span aria-hidden="true">×</span></button><img alt=""><p></p></div>';
    document.body.appendChild(dialog);
    const image = dialog.querySelector('img');
    const caption = dialog.querySelector('p');
    let opener;
    let previousOverflow;

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            if (typeof dialog.showModal !== 'function') return;
            event.preventDefault();
            opener = link;
            const thumbnail = link.querySelector('img');
            image.alt = thumbnail.alt;
            image.src = link.href;
            caption.textContent = thumbnail.alt;
            previousOverflow = document.body.style.overflow;
            dialog.showModal();
            document.body.style.overflow = 'hidden';
        });
    });
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
        document.body.style.overflow = previousOverflow;
        image.removeAttribute('src');
        opener?.focus({ preventScroll: true });
    });
})();
