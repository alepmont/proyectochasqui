const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const revealElements = Array.from(document.querySelectorAll('.reveal'));
const contactForm = document.querySelector('.contact-form');
const topbar = document.querySelector('.topbar');
const menuToggle = document.querySelector('.menu-toggle');
const topnav = document.querySelector('.topnav');
const dropdownWrappers = Array.from(document.querySelectorAll('.topnav-dropdown'));
const experienceGrid = document.querySelector('.experience-grid');
const experiencePrev = document.querySelector('.carousel-arrow-prev');
const experienceNext = document.querySelector('.carousel-arrow-next');
const langButtons = Array.from(document.querySelectorAll('.lang-button'));

const setLangButtonState = (lang) => {
    langButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.lang === lang);
    });
};

const setGoogleLangCookie = (lang) => {
    const cookieValue = `/es/${lang}`;
    document.cookie = `googtrans=${cookieValue};path=/`;
    document.cookie = `googtrans=${cookieValue};path=/;domain=${window.location.hostname}`;
};

const applyGoogleTranslate = (lang) => {
    const combo = document.querySelector('.goog-te-combo');

    if (!(combo instanceof HTMLSelectElement)) {
        return false;
    }

    if (combo.value !== lang) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
    }

    return true;
};

window.googleTranslateElementInit = () => {
    if (!(window.google && window.google.translate && window.google.translate.TranslateElement)) {
        return;
    }

    new window.google.translate.TranslateElement({
        pageLanguage: 'es',
        includedLanguages: 'es,en',
        autoDisplay: false
    }, 'google_translate_element');
};

const loadGoogleTranslate = () => {
    if (document.querySelector('script[data-google-translate="true"]')) {
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.dataset.googleTranslate = 'true';
    document.head.appendChild(script);
};

if (langButtons.length) {
    const browserLang = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es';
    const initialLang = localStorage.getItem('site-lang') || browserLang;

    setLangButtonState(initialLang);
    setGoogleLangCookie(initialLang);
    loadGoogleTranslate();

    const syncInitialLanguage = () => {
        if (!applyGoogleTranslate(initialLang)) {
            window.setTimeout(syncInitialLanguage, 350);
        }
    };

    window.setTimeout(syncInitialLanguage, 450);

    langButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetLang = button.dataset.lang === 'en' ? 'en' : 'es';

            localStorage.setItem('site-lang', targetLang);
            setLangButtonState(targetLang);
            setGoogleLangCookie(targetLang);

            if (!applyGoogleTranslate(targetLang)) {
                const retry = () => {
                    if (!applyGoogleTranslate(targetLang)) {
                        window.setTimeout(retry, 250);
                    }
                };

                retry();
            }
        });
    });
}

dropdownWrappers.forEach((wrapper) => {
    const trigger = wrapper.querySelector('.topnav-dropdown-trigger');
    const menu = wrapper.querySelector('.topnav-dropdown-menu');

    if (!(trigger instanceof HTMLButtonElement) || !menu) {
        return;
    }

    const openDropdown = () => {
        wrapper.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
    };

    const closeDropdown = () => {
        wrapper.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
    };

    trigger.addEventListener('click', () => {
        wrapper.classList.contains('is-open') ? closeDropdown() : openDropdown();
    });

    wrapper.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeDropdown();
            trigger.focus();
        }
    });

    document.addEventListener('click', (event) => {
        if (!wrapper.contains(event.target)) {
            closeDropdown();
        }
    });
});

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

if (experienceGrid && experiencePrev && experienceNext) {
    let autoScrollId;

    const getScrollStep = () => {
        const firstCard = experienceGrid.querySelector('.experience-card');
        if (!(firstCard instanceof HTMLElement)) {
            return 320;
        }

        const styles = window.getComputedStyle(experienceGrid);
        const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');
        return firstCard.offsetWidth + gap;
    };

    const scrollNext = () => {
        const step = getScrollStep();
        const remaining = experienceGrid.scrollWidth - experienceGrid.clientWidth - experienceGrid.scrollLeft;

        if (remaining <= step * 0.6) {
            experienceGrid.scrollTo({ left: 0, behavior: 'smooth' });
            return;
        }

        experienceGrid.scrollBy({ left: step, behavior: 'smooth' });
    };

    const startAutoScroll = () => {
        window.clearInterval(autoScrollId);
        autoScrollId = window.setInterval(scrollNext, 4200);
    };

    const stopAutoScroll = () => {
        window.clearInterval(autoScrollId);
    };

    experiencePrev.addEventListener('click', () => {
        experienceGrid.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        startAutoScroll();
    });

    experienceNext.addEventListener('click', () => {
        experienceGrid.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        startAutoScroll();
    });

    experienceGrid.addEventListener('mouseenter', stopAutoScroll);
    experienceGrid.addEventListener('mouseleave', startAutoScroll);
    experienceGrid.addEventListener('focusin', stopAutoScroll);
    experienceGrid.addEventListener('focusout', startAutoScroll);

    startAutoScroll();
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