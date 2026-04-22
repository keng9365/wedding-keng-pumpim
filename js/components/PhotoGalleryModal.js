export class PhotoGalleryModal {
    constructor(images, lightbox) {
        this.modal = document.getElementById('photoGalleryModal');
        this.grid = document.getElementById('photoGalleryGrid');
        this.openBtn = document.getElementById('openPhotoGallery');
        this.closeBtn = document.getElementById('photoGalleryClose');
        this.backdrop = document.getElementById('photoGalleryBackdrop');
        this.images = images;
        this.lightbox = lightbox;

        if (this.grid) this._buildGrid();
        this._bindEvents();
    }

    _buildGrid() {
        const leftImages = this.images.filter((_, i) => i % 2 === 0);
        const rightImages = this.images.filter((_, i) => i % 2 !== 0);

        const createColumn = (imgs, offset) => {
            const col = document.createElement('div');
            col.className = 'photo-gallery-modal__col';

            imgs.forEach((src, i) => {
                const item = document.createElement('div');
                item.className = 'photo-gallery-modal__item';
                item.dataset.index = String(offset + i * 2);

                const img = document.createElement('img');
                img.src = src;
                img.alt = `Pre-Wedding-PumKeng ${offset + i * 2 + 1}`;
                img.loading = 'lazy';
                img.decoding = 'async';

                item.appendChild(img);
                col.appendChild(item);
            });

            return col;
        };

        this.grid.textContent = '';
        this.grid.appendChild(createColumn(leftImages, 0));
        this.grid.appendChild(createColumn(rightImages, 1));

        this.grid.addEventListener('click', (e) => {
            const item = e.target.closest('.photo-gallery-modal__item');
            if (!item) return;
            const index = this.lightbox._clampIndex(item.dataset.index, this.images.length);
            this.lightbox.open(
                { images: this.images, pause: () => { }, resume: () => { } },
                index
            );
        });
    }

    _bindEvents() {
        if (this.openBtn) this.openBtn.addEventListener('click', () => this.open());
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
        if (this.backdrop) this.backdrop.addEventListener('click', () => this.close());
    }

    open() {
        if (!this.modal) return;
        document.documentElement.style.overflow = 'hidden';
        this.modal.classList.add('is-active');
        this.modal.setAttribute('aria-hidden', 'false');
        history.pushState({ modal: 'photoGallery' }, '');
    }

    _doClose() {
        if (!this.modal) return;
        this.modal.classList.remove('is-active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }

    close() {
        if (history.state?.modal === 'photoGallery') {
            history.back();
        } else {
            this._doClose();
        }
    }
}
