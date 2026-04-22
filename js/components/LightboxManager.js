export class LightboxManager {
    constructor() {
        this.modal = document.getElementById('galleryModal');
        this.img = document.getElementById('galleryModalImage');
        this.counter = document.getElementById('galleryCounter');
        this.closeBtn = document.getElementById('galleryModalClose');
        this.prevBtn = document.getElementById('galleryPrevBtn');
        this.nextBtn = document.getElementById('galleryNextBtn');
        this.activeGallery = null;
        this.currentIndex = 0;
        this.scale = 1;
        this.tx = 0;
        this.ty = 0;
    }

    init() {
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());

        const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

        const applyTransform = () => {
            if (this.img) this.img.style.transform = `translate(${this.tx}px,${this.ty}px) scale(${this.scale})`;
        };

        const naturalCenter = () => {
            const r = this.img.getBoundingClientRect();
            return {
                cx: r.left + r.width / 2 - this.tx,
                cy: r.top + r.height / 2 - this.ty
            };
        };

        const zoomAt = (px, py, newScale, animated = false) => {
            newScale = clamp(newScale, 1, 5);
            const { cx, cy } = naturalCenter();
            const r = newScale / this.scale;
            this.tx = (px - cx) * (1 - r) + this.tx * r;
            this.ty = (py - cy) * (1 - r) + this.ty * r;
            this.scale = newScale;
            if (this.scale <= 1) { this.scale = 1; this.tx = 0; this.ty = 0; }
            if (animated && this.img) {
                this.img.style.transition = 'transform 0.3s ease';
                this.img.addEventListener('transitionend', () => {
                    if (this.img) this.img.style.transition = '';
                }, { once: true });
            }
            applyTransform();
        };

        const resetZoom = (animated = true) => {
            if (animated && this.img) {
                this.img.style.transition = 'transform 0.3s ease';
                this.img.addEventListener('transitionend', () => {
                    if (this.img) this.img.style.transition = '';
                }, { once: true });
            }
            this.scale = 1; this.tx = 0; this.ty = 0;
            applyTransform();
        };

        const getTouchDist = (t) =>
            Math.hypot(t[1].clientX - t[0].clientX, t[1].clientY - t[0].clientY);

        let dragStartX = 0, dragStartY = 0;
        let lastTx = 0, lastTy = 0;
        let hasDragged = false;
        let wasPinching = false;
        let lastTapTime = 0;
        let isMouseDown = false;

        let pinchStartDist = 0, pinchStartScale = 1;
        let pinchMidX = 0, pinchMidY = 0;
        let pinchStartTx = 0, pinchStartTy = 0;
        let pinchCx = 0, pinchCy = 0;

        if (!this.modal) return;

        this.modal.addEventListener('click', (e) => {
            if (hasDragged) return;
            if (e.target === this.modal) this.close();
        });

        this.modal.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                dragStartX = e.touches[0].clientX;
                dragStartY = e.touches[0].clientY;
                lastTx = this.tx; lastTy = this.ty;
                hasDragged = false;

                const now = Date.now();
                if (now - lastTapTime < 300 && !wasPinching) {
                    hasDragged = true;
                    this.scale > 1 ? resetZoom(true) : zoomAt(dragStartX, dragStartY, 2.5, true);
                    lastTapTime = 0;
                } else {
                    lastTapTime = now;
                    wasPinching = false;
                }
            } else if (e.touches.length === 2) {
                wasPinching = true;
                hasDragged = true;
                pinchStartDist = getTouchDist(e.touches);
                pinchStartScale = this.scale;
                pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                pinchStartTx = this.tx; pinchStartTy = this.ty;
                ({ cx: pinchCx, cy: pinchCy } = naturalCenter());
            }
        }, { passive: true });

        this.modal.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const dist = getTouchDist(e.touches);
                const newScale = clamp(pinchStartScale * (dist / pinchStartDist), 1, 5);
                const r = newScale / pinchStartScale;
                this.scale = newScale;
                this.tx = (pinchMidX - pinchCx) * (1 - r) + pinchStartTx * r;
                this.ty = (pinchMidY - pinchCy) * (1 - r) + pinchStartTy * r;
                applyTransform();
            } else if (e.touches.length === 1 && !wasPinching) {
                const dx = e.touches[0].clientX - dragStartX;
                const dy = e.touches[0].clientY - dragStartY;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasDragged = true;

                if (this.scale > 1) {
                    this.tx = lastTx + dx;
                    this.ty = lastTy + dy;
                    applyTransform();
                } else {
                    if (this.img) this.img.style.transform = `translateX(${dx * 0.25}px)`;
                }
            }
        }, { passive: true });

        this.modal.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                if (!wasPinching && this.scale <= 1) {
                    const dx = e.changedTouches[0].clientX - dragStartX;
                    const dy = e.changedTouches[0].clientY - dragStartY;
                    if (this.img) {
                        this.img.style.transition = 'transform 0.25s ease';
                        this.img.style.transform = '';
                        this.img.addEventListener('transitionend', () => {
                            if (this.img) this.img.style.transition = '';
                        }, { once: true });
                    }
                    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy))
                        this.navigate(dx < 0 ? 1 : -1);
                }
                wasPinching = false;
            } else if (e.touches.length === 1) {
                dragStartX = e.touches[0].clientX;
                dragStartY = e.touches[0].clientY;
                lastTx = this.tx; lastTy = this.ty;
            }
        }, { passive: true });

        this.modal.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isMouseDown = true;
            dragStartX = e.clientX; dragStartY = e.clientY;
            lastTx = this.tx; lastTy = this.ty;
            hasDragged = false;
        });
        window.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasDragged = true;
            if (this.scale > 1) {
                this.tx = lastTx + dx; this.ty = lastTy + dy;
                applyTransform();
            } else {
                if (this.img) this.img.style.transform = `translateX(${dx * 0.25}px)`;
            }
        });
        window.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            isMouseDown = false;
            if (this.scale <= 1) {
                const dx = e.clientX - dragStartX;
                const dy = e.clientY - dragStartY;
                if (this.img) {
                    this.img.style.transition = 'transform 0.25s ease';
                    this.img.style.transform = '';
                    this.img.addEventListener('transitionend', () => {
                        if (this.img) this.img.style.transition = '';
                    }, { once: true });
                }
                if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy))
                    this.navigate(dx < 0 ? 1 : -1);
            }
        });

        this.modal.addEventListener('wheel', (e) => {
            e.preventDefault();
            zoomAt(e.clientX, e.clientY, this.scale * (e.deltaY < 0 ? 1.15 : 0.87));
        }, { passive: false });

        if (this.prevBtn) this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); this.navigate(-1);
        });
        if (this.nextBtn) this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); this.navigate(1);
        });
        document.addEventListener('keydown', (e) => {
            if (!this.modal?.classList.contains('is-active')) return;
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
            if (e.key === 'Escape') this.close();
        });
    }

    open(gallery, index) {
        this.activeGallery = gallery;
        this.currentIndex = this._clampIndex(index, gallery.images.length);
        this.updateImage();
        this.modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        gallery.pause?.();
        history.pushState({ modal: 'lightbox' }, '');
    }

    _doClose() {
        this.activeGallery?.resume?.();
        this.modal.classList.remove('is-active');
        this.scale = 1; this.tx = 0; this.ty = 0;
        if (this.img) { this.img.style.transform = ''; this.img.style.transition = ''; }
        if (!document.getElementById('photoGalleryModal')?.classList.contains('is-active'))
            document.body.style.overflow = '';
        this.activeGallery = null;
    }

    close() {
        if (history.state?.modal === 'lightbox') {
            history.back();
        } else {
            this._doClose();
        }
    }

    navigate(direction) {
        if (!this.activeGallery) return;
        const count = this.activeGallery.images.length;
        this.currentIndex = (this.currentIndex + direction + count) % count;
        this.updateImage();
    }

    updateImage() {
        if (this.img) {
            this.scale = 1; this.tx = 0; this.ty = 0;
            this.img.style.transform = '';
            this.img.style.transition = '';
            this.img.src = this.activeGallery.images[this.currentIndex];
        }
        if (this.counter) this.counter.textContent = `${this.currentIndex + 1} / ${this.activeGallery.images.length}`;
    }

    _clampIndex(index, length) {
        const parsed = parseInt(index, 10);
        if (Number.isNaN(parsed) || parsed < 0) return 0;
        return Math.min(parsed, length - 1);
    }
}
