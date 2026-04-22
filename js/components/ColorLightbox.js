export class ColorLightbox {
    constructor() {
        this.lightbox = document.getElementById('colorLightbox');
        this.swatch = document.getElementById('colorMsgSwatch');
    }

    init() {
        document.querySelectorAll('.theme-palette__item').forEach(item => {
            item.addEventListener('click', () => {
                const color = item.dataset.color;
                if (color && this.swatch) {
                    this.swatch.style.backgroundColor = color;
                }
                if (this.lightbox) {
                    this.lightbox.classList.add('is-active');
                    document.body.style.overflow = 'hidden';
                    history.pushState({ modal: 'colorLightbox' }, '');
                }
            });
        });

        if (this.lightbox) {
            this.lightbox.addEventListener('click', () => {
                if (history.state?.modal === 'colorLightbox') {
                    history.back();
                } else {
                    this._doClose();
                }
            });
        }
    }

    _doClose() {
        if (this.lightbox) {
            this.lightbox.classList.remove('is-active');
        }
        document.body.style.overflow = '';
    }
}
