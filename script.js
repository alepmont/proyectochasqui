const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const revealElements = Array.from(document.querySelectorAll('.reveal'));
const contactForm = document.querySelector('.contact-form');
const topbar = document.querySelector('.topbar');
const menuToggle = document.querySelector('.menu-toggle');
const topnav = document.querySelector('.topnav');

if (topbar && menuToggle && topnav) {
    const closeMenu = () => {
        topbar.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = topbar.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menu' : 'Abrir menu');
    });

    topnav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 720) {
                closeMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 720) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}

if (heroSlides.length > 1) {
    let activeSlide = 0;

    window.setInterval(() => {
        heroSlides[activeSlide].classList.remove('is-active');
        activeSlide = (activeSlide + 1) % heroSlides.length;
        heroSlides[activeSlide].classList.add('is-active');
    }, 4200);
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
    });
}, {
    threshold: 0.18,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach((element) => revealObserver.observe(element));

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const button = contactForm.querySelector('button[type="submit"]');

        if (button instanceof HTMLButtonElement) {
            button.textContent = 'Solicitud recibida';
            button.disabled = true;
        }
    });
}