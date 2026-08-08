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
const instagramRow = document.querySelector('.instagram-row-shell');
const instagramPrev = document.querySelector('.instagram-carousel-arrow-prev');
const instagramNext = document.querySelector('.instagram-carousel-arrow-next');
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
    const brand = topbar.querySelector('.brand');

    if (brand && !topnav.querySelector('.topnav-mobile-brand')) {
        const mobileBrand = brand.cloneNode(true);
        mobileBrand.classList.add('topnav-mobile-brand');
        topnav.append(mobileBrand);
    }

    if (!topnav.querySelector('.topnav-close')) {
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'topnav-close';
        closeButton.setAttribute('aria-label', 'Cerrar menu');
        closeButton.innerHTML = [
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
            '<path d="M6 6l12 12M18 6L6 18"/>',
            '</svg>'
        ].join('');
        topnav.prepend(closeButton);
    }

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

    const closeButton = topnav.querySelector('.topnav-close');
    if (closeButton instanceof HTMLButtonElement) {
        closeButton.addEventListener('click', closeMenu);
    }

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

const updateTopbarScrollState = () => {
    if (!topbar) {
        return;
    }

    topbar.classList.toggle('is-scrolled', window.scrollY > 50);
};

window.addEventListener('scroll', updateTopbarScrollState, { passive: true });
window.addEventListener('resize', updateTopbarScrollState);
updateTopbarScrollState();

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

if (instagramRow && instagramPrev && instagramNext) {
    const getInstagramStep = () => {
        const firstPost = instagramRow.querySelector('.instagram-post-slot');

        if (!(firstPost instanceof HTMLElement)) {
            return instagramRow.clientWidth;
        }

        const styles = window.getComputedStyle(instagramRow);
        const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');
        return firstPost.offsetWidth + gap;
    };

    const syncInstagramArrows = () => {
        if (window.innerWidth > 480) {
            instagramPrev.classList.add('is-hidden');
            instagramNext.classList.add('is-hidden');
            return;
        }

        const maxScroll = instagramRow.scrollWidth - instagramRow.clientWidth;
        instagramPrev.classList.toggle('is-hidden', instagramRow.scrollLeft <= 4);
        instagramNext.classList.toggle('is-hidden', instagramRow.scrollLeft >= maxScroll - 4);
    };

    instagramPrev.addEventListener('click', () => {
        instagramRow.scrollBy({ left: -getInstagramStep(), behavior: 'smooth' });
    });

    instagramNext.addEventListener('click', () => {
        instagramRow.scrollBy({ left: getInstagramStep(), behavior: 'smooth' });
    });

    instagramRow.addEventListener('scroll', syncInstagramArrows, { passive: true });
    window.addEventListener('resize', syncInstagramArrows);
    window.setTimeout(syncInstagramArrows, 180);
    syncInstagramArrows();
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

const instagramSection = document.querySelector('.section-instagram');
const instagramScriptPlaceholder = document.querySelector('script[data-instagram-src]');
const loadInstagramEmbed = () => {
    if (!instagramScriptPlaceholder || document.querySelector('script[data-instagram-loaded]')) {
        return;
    }

    const script = document.createElement('script');
    script.src = instagramScriptPlaceholder.dataset.instagramSrc;
    script.async = true;
    script.dataset.instagramLoaded = 'true';
    document.body.appendChild(script);
};

if (instagramSection) {
    if ('IntersectionObserver' in window) {
        const instagramObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                loadInstagramEmbed();
                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: '0px 0px -150px 0px',
            threshold: 0.1
        });

        instagramObserver.observe(instagramSection);
    } else {
        loadInstagramEmbed();
    }
}

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

// Modal handling
const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal instanceof HTMLElement) {
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }
};

const closeModal = (modal) => {
    if (modal instanceof HTMLElement) {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }
};

// Event delegation for modal buttons
document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-modal-target]');
    if (button) {
        const modalId = button.dataset.modalTarget;
        if (modalId) {
            openModal(modalId);
        }
    }

    const closeBtn = event.target.closest('.exp-modal-close');
    if (closeBtn) {
        const backdrop = event.target.closest('.exp-modal-backdrop');
        if (backdrop) {
            closeModal(backdrop);
        }
    }

    const backdrop = event.target.closest('.exp-modal-backdrop');
    if (backdrop && event.target === backdrop) {
        closeModal(backdrop);
    }
});

// Escape key to close modals
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.exp-modal-backdrop.is-open');
        openModals.forEach((modal) => {
            closeModal(modal);
        });
    }
});