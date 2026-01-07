document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // Countdown Timer - Wedding Date: June 27, 2026
    // ============================================
    const weddingDate = new Date('2026-06-27T07:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('countdown').innerHTML = '<p style="font-size: 1.2rem; color: var(--color-accent);">🎉 Wedding Day!</p>';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ============================================
    // Scroll Animation with Intersection Observer
    // ============================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // Copy Bank Account Number
    // ============================================
    const copyBtn = document.getElementById('copyBtn');
    const accountNumber = document.getElementById('accountNumber');
    const copyFeedback = document.getElementById('copyFeedback');

    if (copyBtn && accountNumber && copyFeedback) {
        copyBtn.addEventListener('click', () => {
            const text = accountNumber.innerText.replace(/-/g, '').trim();

            navigator.clipboard.writeText(text).then(() => {
                copyFeedback.classList.add('is-visible');

                setTimeout(() => {
                    copyFeedback.classList.remove('is-visible');
                }, 2000);
            }).catch(err => {
                console.error('Copy failed:', err);
            });
        });
    }

    // ============================================
    // Smooth Scroll for Internal Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ============================================
    // Gallery Lightbox Popup
    // ============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    // Open lightbox when clicking gallery image
    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            // Get higher resolution version of the image
            const highResSrc = img.src.replace('w=200&h=200', 'w=800&h=800');
            lightboxImage.src = highResSrc;
            lightbox.classList.add('is-active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox with close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close lightbox when clicking outside the image
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = ''; // Restore scrolling
        lightboxImage.src = '';
    }

});
