export function initNavbar() {
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

    const sections = document.querySelectorAll('section[id], footer[id]');

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

    return navbar;
}
