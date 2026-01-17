document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // Navigation Bar - Show on Scroll
    // ============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.navbar__link');
    let lastScrollY = window.scrollY;
    let ticking = false;

    // Show navbar after scrolling past hero
    function updateNavbar() {
        const heroHeight = document.getElementById('hero')?.offsetHeight || 500;

        if (window.scrollY > heroHeight * 0.5) {
            navbar.classList.add('is-visible');
        } else {
            navbar.classList.remove('is-visible');
        }

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

        // Close menu when clicking a link
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
                    link.classList.remove('is-active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('is-active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink);

    // ============================================
    // Scroll Progress Indicator
    // ============================================
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }
    }

    window.addEventListener('scroll', updateScrollProgress);

    // ============================================
    // Countdown Timer - Wedding Date: June 27, 2026
    // ============================================
    const weddingDate = new Date('2026-06-27T07:00:00').getTime();
    const rsvpDate = new Date('2026-06-20T07:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        } else {
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) {
                countdownEl.innerHTML = '<p style="font-size: 1.2rem; color: var(--color-gold);">🎉 Wedding Day!</p>';
            }
        }
    }

    // RSVP Countdown - June 20, 2026
    function updateRsvpCountdown() {
        const now = new Date().getTime();
        const distance = rsvpDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('rsvp-days');
            const hoursEl = document.getElementById('rsvp-hours');
            const minutesEl = document.getElementById('rsvp-minutes');
            const secondsEl = document.getElementById('rsvp-seconds');

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        } else {
            // Optional: Message when RSVP closes
            const countdownEl = document.getElementById('rsvp-countdown');
            if (countdownEl) {
                countdownEl.innerHTML = '<p style="font-size: 1.2rem; color: var(--color-gold);">RSVP Closed</p>';
            }
        }
    }

    updateCountdown();
    updateRsvpCountdown();
    setInterval(() => {
        updateCountdown();
        updateRsvpCountdown();
    }, 1000);

    // ============================================
    // Scroll Animation with Intersection Observer
    // ============================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
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
    // Card Section Slide-Up Animation
    // ============================================
    const cardSections = document.querySelectorAll('.card-section__card');

    const cardObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.05
    };

    const cardObserverCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on scroll position
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    };

    const cardObserver = new IntersectionObserver(cardObserverCallback, cardObserverOptions);

    cardSections.forEach(card => {
        cardObserver.observe(card);
    });

    // ============================================
    // Universal Infinite Gallery Logic & Lightbox
    // ============================================

    // 1. Global Lightbox Manager
    const lightboxManager = {
        modal: document.getElementById('galleryModal'),
        img: document.getElementById('galleryModalImage'),
        closeBtn: document.getElementById('galleryModalClose'),
        prevBtn: document.getElementById('galleryPrevBtn'),
        nextBtn: document.getElementById('galleryNextBtn'),

        activeGallery: null, // Instance of AutoScrollGallery
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

            // Keyboard Nav
            document.addEventListener('keydown', (e) => {
                if (!this.modal || !this.modal.classList.contains('is-active')) return;
                if (e.key === 'ArrowLeft') this.navigate(-1);
                if (e.key === 'ArrowRight') this.navigate(1);
                if (e.key === 'Escape') this.close();
            });
        },

        open(gallery, index) {
            this.activeGallery = gallery;
            this.currentIndex = index;
            this.updateImage();
            this.modal.classList.add('is-active');
            document.body.style.overflow = 'hidden';
            if (gallery.pause) gallery.pause();
        },

        close() {
            if (this.activeGallery && this.activeGallery.resume) this.activeGallery.resume();
            this.modal.classList.remove('is-active');
            document.body.style.overflow = '';
            this.activeGallery = null;
        },

        navigate(direction) {
            if (!this.activeGallery) return;
            const count = this.activeGallery.images.length;
            this.currentIndex = (this.currentIndex + direction + count) % count;
            this.updateImage();
        },

        updateImage() {
            const src = this.activeGallery.images[this.currentIndex];
            if (this.img) this.img.src = src;
        }
    };
    lightboxManager.init();


    // 2. Class: AutoScrollGallery
    class AutoScrollGallery {
        constructor(trackId, options = {}) {
            this.track = document.getElementById(trackId);
            if (!this.track) return;

            this.wrapper = this.track.parentElement;
            this.speed = options.speed || 0.5;
            this.mode = options.mode || 'continuous'; // 'continuous' | 'swipe'
            this.images = [];
            this.isPaused = false;
            this.isDragging = false;
            this.animationId = null;
            this.intervalId = null;

            // Initialize
            if (options.images && options.images.length > 0) {
                // Mode A: Inject Data
                this.images = options.images;
                this.renderFromData();
            } else {
                // Mode B: Read from HTML
                this.readFromDOM();
                this.duplicateForSmoothLoop();
            }

            this.setupEvents();

            if (this.mode === 'swipe') {
                this.startSwipeAnimation();
            } else {
                this.startContinuousAnimation();
            }
        }

        renderFromData() {
            // Duplicate x4 for smooth loop
            const renderList = [...this.images, ...this.images, ...this.images, ...this.images];
            this.track.innerHTML = renderList.map(src =>
                `<img src="${src}" class="gallery-item bento-img" loading="lazy" draggable="false">`
            ).join('');
        }

        readFromDOM() {
            const imgs = this.track.querySelectorAll('img');
            if (imgs.length === 0) return;

            // Capture sources
            this.images = Array.from(imgs).map(img => img.getAttribute('src'));
        }

        duplicateForSmoothLoop() {
            // Clone existing HTML content 3 more times (Total 4x)
            const originalContent = this.track.innerHTML;
            this.track.innerHTML = originalContent.repeat(4);
        }

        setupEvents() {
            // Click to Open Lightbox
            this.track.addEventListener('click', (e) => {
                const img = e.target.closest('img');
                if (img) {
                    // Determine index in the UNIQUE image set
                    const src = img.getAttribute('src');
                    // We assume uniqueness or first match is fine for now
                    let index = this.images.indexOf(src);

                    // Fallback for relative vs absolute mismatch
                    if (index === -1) {
                        index = this.images.findIndex(s => img.src.includes(s));
                    }
                    if (index === -1) index = 0;

                    lightboxManager.open(this, index);
                }
            });

            // Touch Interaction
            let startX, scrollLeft;

            this.wrapper.addEventListener('touchstart', (e) => {
                this.isDragging = true;
                this.isPaused = true;
                startX = e.touches[0].pageX - this.wrapper.offsetLeft;
                scrollLeft = this.wrapper.scrollLeft;
            });

            this.wrapper.addEventListener('touchend', () => {
                this.isDragging = false;
                this.isPaused = false;
            });

            this.wrapper.addEventListener('touchmove', (e) => {
                if (!this.isDragging) return;
                // Native scroll allowed
            });

            // Mouse Drag
            this.wrapper.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                this.isPaused = true;
                this.wrapper.style.cursor = 'grabbing';
                startX = e.pageX - this.wrapper.offsetLeft;
                scrollLeft = this.wrapper.scrollLeft;
                e.preventDefault();
            });

            this.wrapper.addEventListener('mouseup', () => {
                this.isDragging = false;
                this.isPaused = false;
                this.wrapper.style.cursor = 'grab';
            });

            this.wrapper.addEventListener('mouseleave', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.isPaused = false;
                    this.wrapper.style.cursor = 'grab';
                }
            });

            this.wrapper.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;
                e.preventDefault();
                const x = e.pageX - this.wrapper.offsetLeft;
                const walk = (x - startX) * 2;
                this.wrapper.scrollLeft = scrollLeft - walk;
            });
        }

        startContinuousAnimation() {
            const animate = () => {
                if (!this.isPaused && !this.isDragging) {
                    this.wrapper.scrollLeft += this.speed;

                    // Infinite Loop Logic: Reset when reaching end of "first clone set"
                    const maxScroll = this.wrapper.scrollWidth - this.wrapper.clientWidth;
                    if (this.wrapper.scrollLeft >= maxScroll - 2) {
                        this.wrapper.scrollLeft = 0;
                    }
                }
                this.animationId = requestAnimationFrame(animate);
            };
            this.animationId = requestAnimationFrame(animate);
        }

        startSwipeAnimation() {
            // Swipe/Warp every 3 seconds
            // Random start delay to desync
            setTimeout(() => {
                this.intervalId = setInterval(() => {
                    if (!this.isPaused && !this.isDragging) {
                        const itemWidth = this.wrapper.clientWidth; // Scroll by full width of container

                        // Smooth scroll using behavior
                        this.wrapper.scrollBy({ left: itemWidth, behavior: 'smooth' });

                        // Check reset after scroll finishes (rough timeout sync)
                        // We reset silently if we are too far
                        setTimeout(() => {
                            const maxScroll = this.wrapper.scrollWidth - this.wrapper.clientWidth;
                            if (this.wrapper.scrollLeft >= maxScroll - 20) {
                                this.wrapper.scrollTo({ left: 0, behavior: 'auto' });
                            }
                        }, 600);
                    }
                }, 2500);
            }, Math.random() * 2000);
        }

        pause() { this.isPaused = true; }
        resume() { this.isPaused = false; }
    }

    // 3. Initialize Galleries

    // A. Gift Gallery (From HTML)
    const galleryTrack = document.getElementById('galleryTrack');
    if (galleryTrack) {
        new AutoScrollGallery('galleryTrack', { speed: 0.5 });
    }

    // B. Pre-Wedding Gallery (Swipe)
    const galleryTrackPre = document.getElementById('galleryTrackPre');
    if (galleryTrackPre) {
        new AutoScrollGallery('galleryTrackPre', { speed: 0.5, mode: 'swipe' });
    }

    // C. Pre-Wedding Thumbnail Gallery (Continuous)
    const galleryTrackPre2 = document.getElementById('galleryTrackPre2');
    if (galleryTrackPre2) {
        new AutoScrollGallery('galleryTrackPre2', { speed: 0.8, mode: 'continuous' });
    }

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
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                copyFeedback.classList.add('is-visible');
                setTimeout(() => {
                    copyFeedback.classList.remove('is-visible');
                }, 2000);
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
                    const navbarHeight = navbar?.offsetHeight || 60;
                    const targetPosition = target.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============================================
    // Floating Particles Effect (Hero Section)
    // ============================================
    const particlesContainer = document.getElementById('particles');

    if (particlesContainer) {
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random positioning
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 6 + 2;
        const delay = Math.random() * 10;
        const duration = Math.random() * 10 + 10;

        particle.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(196, 163, 90, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
        `;

        particlesContainer.appendChild(particle);
    }

    // Add particle animation keyframes
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes floatParticle {
            0%, 100% {
                transform: translateY(0) translateX(0) scale(1);
                opacity: 0.3;
            }
            25% {
                transform: translateY(-30px) translateX(10px) scale(1.1);
                opacity: 0.6;
            }
            50% {
                transform: translateY(-50px) translateX(-5px) scale(0.9);
                opacity: 0.4;
            }
            75% {
                transform: translateY(-20px) translateX(15px) scale(1.05);
                opacity: 0.5;
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // ============================================
    // Parallax Effect on Hero
    // ============================================
    const heroGlow = document.querySelector('.hero__glow');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        if (heroGlow && scrolled < window.innerHeight) {
            heroGlow.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.2}px))`;
        }
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
            const highResSrc = img.src.replace('w=200&h=200', 'w=800&h=800');
            lightboxImage.src = highResSrc;
            lightbox.classList.add('is-active');
            document.body.style.overflow = 'hidden';
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
        if (e.key === 'Escape' && lightbox?.classList.contains('is-active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = '';
        lightboxImage.src = '';
    }

    // ============================================
    // Theme Color Swatch Hover Effect
    // ============================================
    const swatches = document.querySelectorAll('.theme-colors__swatch');

    swatches.forEach(swatch => {
        swatch.addEventListener('mouseenter', () => {
            swatches.forEach(s => {
                if (s !== swatch) {
                    s.style.opacity = '0.5';
                    s.style.transform = 'scale(0.9)';
                }
            });
        });

        swatch.addEventListener('mouseleave', () => {
            swatches.forEach(s => {
                s.style.opacity = '1';
                s.style.transform = 'scale(1)';
            });
        });
    });

    // ============================================
    // Schedule Item Hover Animation
    // ============================================
    const scheduleItems = document.querySelectorAll('.schedule__item');

    scheduleItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.05}s`;
    });

    // ============================================
    // Initial Page Load Animation
    // ============================================
    document.body.classList.add('is-loaded');

    // Trigger hero content animation
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('is-visible');
        }, 300);
    }

    // ============================================
    // Color Comparison Lightbox
    // ============================================
    const colorLightbox = document.getElementById('colorLightbox');
    const colorMsgSwatch = document.getElementById('colorMsgSwatch');
    const colorMsgName = document.getElementById('colorMsgName');
    const colorLightboxClose = document.getElementById('colorLightboxClose');
    const colorRows = document.querySelectorAll('.theme-color__row');

    // Open color lightbox
    colorRows.forEach(row => {
        row.addEventListener('click', () => {
            const color = row.style.backgroundColor;
            // const name = row.querySelector('.theme-color__name').textContent;

            colorMsgSwatch.style.backgroundColor = color;
            // colorMsgName.textContent = name;

            colorLightbox.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close color lightbox
    if (colorLightboxClose) {
        colorLightboxClose.addEventListener('click', closeColorLightbox);
    }

    if (colorLightbox) {
        colorLightbox.addEventListener('click', (e) => {
            if (e.target === colorLightbox || e.target.closest('.lightbox__content--color')) {
                closeColorLightbox();
            }
        });
    }

    function closeColorLightbox() {
        colorLightbox.classList.remove('is-active');
        document.body.style.overflow = '';
    }

});

/* ============================================
   HERO PARTICLES SYSTEM
   ============================================ */
function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 30; // Number of particles

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Randomize size
    const size = Math.random() * 10 + 8; // 8px to 23px for hearts
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Randomize Position
    const startLeft = Math.random() * 100;
    particle.style.left = `${startLeft}%`;

    // Randomize Animation Params
    const duration = Math.random() * 10 + 15; // 15s - 25s duration (slow float)
    const delay = Math.random() * -20; // Start at random times (negative delay to pre-warm)
    const opacity = Math.random() * 0.5 + 0.3; // 0.3 to 0.8 opacity
    const translateX = Math.random() * 100 - 50; // Sway -50px to +50px

    // Set Custom Properties for CSS animation
    particle.style.setProperty('--opacity', opacity);
    particle.style.setProperty('--translateX', `${translateX}px`);

    particle.style.animation = `float-up ${duration}s linear ${delay}s infinite`;

    container.appendChild(particle);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // ... existing init ...
    initHeroParticles();
});
