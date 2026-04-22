import { PRE_WEDDING_IMAGES } from './config/constants.js';
import { FeaturedSlider } from './components/FeaturedSlider.js';
import { LightboxManager } from './components/LightboxManager.js';
import { PhotoGalleryModal } from './components/PhotoGalleryModal.js';
import { ColorLightbox } from './components/ColorLightbox.js';
import { initHeroParticles, initScrollAnimations, initSmoothScroll } from './utils/animations.js';
import { initRsvpCountdown } from './utils/countdown.js';
import { initNavbar } from './utils/navbar.js';

function initInvitationCardPreview(lightbox) {
    const invitationCardImg = document.querySelector('.invitation-card__img');
    if (invitationCardImg) {
        invitationCardImg.style.cursor = 'zoom-in';
        invitationCardImg.addEventListener('click', () => {
            lightbox.open(
                { images: [invitationCardImg.src], pause: () => { }, resume: () => { } },
                0
            );
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar ---
    const navbar = initNavbar();

    // --- RSVP Countdown ---
    initRsvpCountdown();

    // --- Scroll Animations ---
    initScrollAnimations();

    // --- Lightbox Manager ---
    const lightboxManager = new LightboxManager();
    lightboxManager.init();

    // --- Pre-Wedding Featured Slider ---
    new FeaturedSlider('galleryTrackPre', 'galleryDots', PRE_WEDDING_IMAGES, lightboxManager);

    // --- Photo Gallery Grid Modal ---
    const photoGallery = new PhotoGalleryModal(PRE_WEDDING_IMAGES, lightboxManager);

    // --- Color Preview Lightbox ---
    const colorLightbox = new ColorLightbox();
    colorLightbox.init();

    // --- Back button closes modals ---
    window.addEventListener('popstate', () => {
        if (lightboxManager.modal?.classList.contains('is-active')) {
            lightboxManager._doClose();
        } else if (photoGallery.modal?.classList.contains('is-active')) {
            photoGallery._doClose();
        } else if (colorLightbox.lightbox?.classList.contains('is-active')) {
            colorLightbox._doClose();
        }
    });

    // --- Smooth Scroll ---
    initSmoothScroll(navbar);

    // --- Hero Content Entrance ---
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        setTimeout(() => heroContent.classList.add('is-visible'), 300);
    }

    // --- Invitation Card Preview ---
    initInvitationCardPreview(lightboxManager);

    // --- Hero Particles ---
    initHeroParticles();

    // --- Mark page as loaded ---
    document.body.classList.add('is-loaded');

    // --- Register Service Worker ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .catch(() => { /* silently fail if SW not supported */ });
    }
});
