// Declared globally so FeaturedSlider can access it
let lightboxManager;

// ============================================
// Gallery Config — เพิ่ม/ลบรูปที่นี่ที่เดียว
// ============================================
const PRE_WEDDING_IMAGES = [
    'assets/Pre-Wedding-Edit/1.jpeg',
    'assets/Pre-Wedding-Edit/2.jpeg',
    'assets/Pre-Wedding-Edit/3.jpeg',
    'assets/Pre-Wedding-Edit/4.jpeg',
    'assets/Pre-Wedding-Edit/5.jpeg',
    'assets/Pre-Wedding-Edit/6.jpeg',
    'assets/Pre-Wedding-Edit/7.jpeg',
    'assets/Pre-Wedding-Edit/T1.jpeg',
];

// ============================================
// FeaturedSlider — transform-based, no scroll jitter
// ============================================
class FeaturedSlider {
    constructor(trackId, dotsId, images) {
        this.track = document.getElementById(trackId);
        this.dotsEl = document.getElementById(dotsId);
        if (!this.track || !images.length) return;

        this.images = images;
        this.count = images.length;
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoPlayId = null;
        this.touchStartX = 0;

        this._render();
        this._renderDots();
        this._setupEvents();
        this.startAutoPlay();
    }

    _render() {
        // Append clone of first slide to enable seamless forward loop
        const slides = [...this.images, this.images[0]];
        this.track.innerHTML = slides.map((src, i) => `
            <div class="gallery-slide">
                <img class="gallery-item-pre" src="${src}"
                     alt="Pre-Wedding-PumKeng ${(i % this.count) + 1}"
                     loading="${i === 0 ? 'eager' : 'lazy'}"
                     decoding="async">
            </div>`).join('');
    }

    _renderDots() {
        if (!this.dotsEl) return;
        this.dotsEl.innerHTML = this.images.map((_, i) =>
            `<span class="gallery-dot ${i === 0 ? 'gallery-dot--active' : ''}" data-index="${i}"></span>`
        ).join('');
        this.dotsEl.querySelectorAll('.gallery-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                this.slideTo(parseInt(dot.dataset.index));
                this.resetAutoPlay();
            });
        });
    }

    _updateDots() {
        if (!this.dotsEl) return;
        const real = this.currentIndex % this.count;
        this.dotsEl.querySelectorAll('.gallery-dot').forEach((dot, i) => {
            dot.classList.toggle('gallery-dot--active', i === real);
        });
    }

    slideTo(index, animate = true) {
        if (this.isTransitioning && animate) return;
        this.currentIndex = index;
        this.track.style.transition = animate ? '' : 'none';
        this.track.style.transform = `translateX(-${index * 100}%)`;
        if (animate) this.isTransitioning = true;
        this._updateDots();
    }

    next() {
        if (this.isTransitioning) return;
        this.slideTo(this.currentIndex + 1);
    }

    prev() {
        if (this.isTransitioning || this.currentIndex === 0) return;
        this.slideTo(this.currentIndex - 1);
    }

    startAutoPlay() {
        this.autoPlayId = setInterval(() => this.next(), 3500);
    }

    stopAutoPlay() { clearInterval(this.autoPlayId); }

    resetAutoPlay() { this.stopAutoPlay(); this.startAutoPlay(); }

    _setupEvents() {
        const wrapper = this.track.parentElement;
        let hasSwiped = false;

        // Seamless infinite loop: after sliding to the clone, snap back to real index 0
        this.track.addEventListener('transitionend', () => {
            this.isTransitioning = false;
            if (this.currentIndex === this.count) {
                this.slideTo(0, false);
                void this.track.offsetWidth; // force reflow before re-enabling transition
            }
        });

        // Touch swipe
        wrapper.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            hasSwiped = false;
            this.stopAutoPlay();
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            if (Math.abs(e.touches[0].clientX - this.touchStartX) > 10) hasSwiped = true;
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            const diff = this.touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                diff > 0 ? this.next() : this.prev();
            }
            this.startAutoPlay();
        }, { passive: true });

        // Tap (not swipe) → open lightbox
        this.track.addEventListener('click', (e) => {
            if (hasSwiped || !e.target.closest('img')) return;
            if (lightboxManager) lightboxManager.open(this, this.currentIndex % this.count);
        });
    }

    pause() { this.stopAutoPlay(); }
    resume() { this.startAutoPlay(); }
}

// ============================================
// Hero Particles
// ============================================
function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 10 + 8;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;

        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * -20;
        const opacity = Math.random() * 0.5 + 0.3;
        const translateX = Math.random() * 100 - 50;

        particle.style.setProperty('--opacity', opacity);
        particle.style.setProperty('--translateX', `${translateX}px`);
        particle.style.animation = `float-up ${duration}s linear ${delay}s infinite`;

        container.appendChild(particle);
    }
}

// ============================================
// Main Init
// ============================================
document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar: show on scroll past hero ---
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.navbar__link');
    let ticking = false;

    function updateNavbar() {
        const heroHeight = document.getElementById('hero')?.offsetHeight || 500;
        navbar.classList.toggle('is-visible', window.scrollY > heroHeight * 0.5);
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('is-active');
            navMenu.classList.toggle('is-open');
            document.body.style.overflow = navMenu.classList.contains('is-open') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('is-active');
                navMenu.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveLink() {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.toggle('is-active', link.getAttribute('href') === `#${sectionId}`);
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink);

    // --- RSVP Countdown Timer (June 20, 2026) ---
    const rsvpDate = new Date('2026-06-20T07:00:00').getTime();

    function updateRsvpCountdown() {
        const distance = rsvpDate - Date.now();

        if (distance > 0) {
            const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('rsvp-days').textContent    = String(days).padStart(2, '0');
            document.getElementById('rsvp-hours').textContent   = String(hours).padStart(2, '0');
            document.getElementById('rsvp-minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('rsvp-seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            const el = document.getElementById('rsvp-countdown');
            if (el) el.innerHTML = '<p style="font-size: 1.2rem; color: var(--color-gold);">RSVP Closed</p>';
        }
    }

    updateRsvpCountdown();
    setInterval(updateRsvpCountdown, 1000);

    // --- Scroll Animation (Intersection Observer) ---
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    // Card section slide-up animation
    const cardObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('is-visible'), 100);
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    document.querySelectorAll('.card-section__card').forEach(card => cardObserver.observe(card));

    // --- Gallery Lightbox Manager ---
    lightboxManager = {
        modal:    document.getElementById('galleryModal'),
        img:      document.getElementById('galleryModalImage'),
        closeBtn: document.getElementById('galleryModalClose'),
        prevBtn:  document.getElementById('galleryPrevBtn'),
        nextBtn:  document.getElementById('galleryNextBtn'),
        activeGallery: null,
        currentIndex: 0,

        init() {
            if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
            if (this.modal) this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });
            if (this.prevBtn) this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigate(-1);
            });
            if (this.nextBtn) this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigate(1);
            });
            document.addEventListener('keydown', (e) => {
                if (!this.modal?.classList.contains('is-active')) return;
                if (e.key === 'ArrowLeft')  this.navigate(-1);
                if (e.key === 'ArrowRight') this.navigate(1);
                if (e.key === 'Escape')     this.close();
            });
        },

        open(gallery, index) {
            this.activeGallery = gallery;
            this.currentIndex = index;
            this.updateImage();
            this.modal.classList.add('is-active');
            document.body.style.overflow = 'hidden';
            gallery.pause?.();
        },

        close() {
            this.activeGallery?.resume?.();
            this.modal.classList.remove('is-active');
            if (!document.getElementById('photoGalleryModal')?.classList.contains('is-active')) {
                document.body.style.overflow = '';
            }
            this.activeGallery = null;
        },

        navigate(direction) {
            if (!this.activeGallery) return;
            const count = this.activeGallery.images.length;
            this.currentIndex = (this.currentIndex + direction + count) % count;
            this.updateImage();
        },

        updateImage() {
            if (this.img) this.img.src = this.activeGallery.images[this.currentIndex];
        }
    };
    lightboxManager.init();

    // --- Pre-Wedding Featured Slider ---
    new FeaturedSlider('galleryTrackPre', 'galleryDots', PRE_WEDDING_IMAGES);

    // --- Photo Gallery Grid Modal ---
    const pgModal    = document.getElementById('photoGalleryModal');
    const pgGrid     = document.getElementById('photoGalleryGrid');
    const pgOpenBtn  = document.getElementById('openPhotoGallery');
    const pgCloseBtn = document.getElementById('photoGalleryClose');
    const pgBackdrop = document.getElementById('photoGalleryBackdrop');
    let pgSavedScrollY = 0;

    function openPhotoGallery() {
        if (!pgModal) return;
        pgSavedScrollY = window.scrollY;
        document.body.style.overflow  = 'hidden';
        document.body.style.position  = 'fixed';
        document.body.style.top       = `-${pgSavedScrollY}px`;
        document.body.style.width     = '100%';
        pgModal.classList.add('is-active');
        pgModal.setAttribute('aria-hidden', 'false');
    }

    function closePhotoGallery() {
        if (!pgModal) return;
        pgModal.classList.remove('is-active');
        pgModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow  = '';
        document.body.style.position  = '';
        document.body.style.top       = '';
        document.body.style.width     = '';
        window.scrollTo(0, pgSavedScrollY);
    }

    // Build 2-column masonry grid
    if (pgGrid) {
        const renderCol = (images, offset) => images.map((src, i) => `
            <div class="photo-gallery-modal__item" data-index="${offset + i * 2}">
                <img src="${src}" alt="Pre-Wedding-PumKeng ${offset + i * 2 + 1}" loading="lazy" decoding="async">
            </div>`).join('');

        const leftImgs  = PRE_WEDDING_IMAGES.filter((_, i) => i % 2 === 0);
        const rightImgs = PRE_WEDDING_IMAGES.filter((_, i) => i % 2 !== 0);

        pgGrid.innerHTML = `
            <div class="photo-gallery-modal__col">${renderCol(leftImgs, 0)}</div>
            <div class="photo-gallery-modal__col">${renderCol(rightImgs, 1)}</div>`;

        pgGrid.addEventListener('click', (e) => {
            const item = e.target.closest('.photo-gallery-modal__item');
            if (!item) return;
            lightboxManager.open(
                { images: PRE_WEDDING_IMAGES, pause: () => {}, resume: () => {} },
                parseInt(item.dataset.index)
            );
        });
    }

    if (pgOpenBtn)  pgOpenBtn.addEventListener('click', openPhotoGallery);
    if (pgCloseBtn) pgCloseBtn.addEventListener('click', closePhotoGallery);
    if (pgBackdrop) pgBackdrop.addEventListener('click', closePhotoGallery);

    // --- Smooth Scroll for Internal Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({
                        top: target.offsetTop - (navbar?.offsetHeight || 60),
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Hero Content Entrance Animation ---
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        setTimeout(() => heroContent.classList.add('is-visible'), 300);
    }

    // --- Color Preview Lightbox ---
    const colorLightbox = document.getElementById('colorLightbox');
    const colorMsgSwatch = document.getElementById('colorMsgSwatch');

    document.querySelectorAll('.theme-color__row').forEach(row => {
        row.addEventListener('click', () => {
            colorMsgSwatch.style.backgroundColor = row.style.backgroundColor;
            colorLightbox.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (colorLightbox) {
        colorLightbox.addEventListener('click', () => {
            colorLightbox.classList.remove('is-active');
            document.body.style.overflow = '';
        });
    }

    // --- Hero Particles ---
    initHeroParticles();

    // Mark page as loaded
    document.body.classList.add('is-loaded');
});
