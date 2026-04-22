export function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const PARTICLE_COUNT = 30;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
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

        particle.style.setProperty('--opacity', String(opacity));
        particle.style.setProperty('--translateX', `${translateX}px`);
        particle.style.animation = `float-up ${duration}s linear ${delay}s infinite`;

        container.appendChild(particle);
    }
}

export function initScrollAnimations() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    const cardObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('is-visible'), 100);
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    document.querySelectorAll('.card-section__card').forEach(card => cardObserver.observe(card));
}

export function initSmoothScroll(navbar) {
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
}
