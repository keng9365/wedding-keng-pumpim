export class FeaturedSlider {
    constructor(trackId, dotsId, images, lightboxManager = null) {
        this.track = document.getElementById(trackId);
        this.dotsEl = document.getElementById(dotsId);
        this.lightboxManager = lightboxManager;
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

    setLightboxManager(manager) {
        this.lightboxManager = manager;
    }

    _render() {
        const slides = [...this.images, this.images[0]];
        const fragment = document.createDocumentFragment();

        slides.forEach((src, i) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'gallery-slide';

            const img = document.createElement('img');
            img.className = 'gallery-item-pre';
            img.src = src;
            img.alt = `Pre-Wedding-PumKeng ${(i % this.count) + 1}`;
            img.loading = i === 0 ? 'eager' : 'lazy';
            img.decoding = 'async';

            slideDiv.appendChild(img);
            fragment.appendChild(slideDiv);
        });

        this.track.textContent = '';
        this.track.appendChild(fragment);
    }

    _renderDots() {
        if (!this.dotsEl) return;

        this.dotsEl.textContent = '';
        const fragment = document.createDocumentFragment();

        this.images.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = `gallery-dot${i === 0 ? ' gallery-dot--active' : ''}`;
            dot.dataset.index = String(i);
            dot.addEventListener('click', () => {
                this.slideTo(i);
                this.resetAutoPlay();
            });
            fragment.appendChild(dot);
        });

        this.dotsEl.appendChild(fragment);
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

        this.track.addEventListener('transitionend', () => {
            this.isTransitioning = false;
            if (this.currentIndex === this.count) {
                this.slideTo(0, false);
                void this.track.offsetWidth;
            }
        });

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

        this.track.addEventListener('click', (e) => {
            if (hasSwiped || !e.target.closest('img')) return;
            if (this.lightboxManager) this.lightboxManager.open(this, this.currentIndex % this.count);
        });
    }

    pause() { this.stopAutoPlay(); }

    resume() { this.startAutoPlay(); }
}
