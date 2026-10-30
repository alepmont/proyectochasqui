(() => {
    'use strict';

    // Share one installation across all pages and guard against duplicate loading.
    if (window.chasquiAnalyticsLoaded) return;
    window.chasquiAnalyticsLoaded = true;

    const measurementId = 'G-WDPSJJXNTF';
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(tag);

    // GA4 enhanced measurement sends outbound clicks. The existing GA4 rule
    // creates whatsapp_click when event_name=click and link_domain contains wa.me.
    // Keep that single source to avoid counting the same click twice.
})();
