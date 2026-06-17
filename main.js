document.addEventListener('DOMContentLoaded', () => {
    // 0. Active Page Highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 1. Scroll Animation Logic
    const scrollContainer = document.querySelector('.scroll-container');
    const canvas = document.getElementById('scroll-canvas');
    if (scrollContainer && canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 176;
        const currentFrame = index => `frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
        const images = [];
        let loadedImages = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                loadedImages++;
                if (loadedImages === 1) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);
                }
            };
            images.push(img);
        }

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const maxScroll = scrollContainer.offsetHeight - window.innerHeight;
            
            let scrollFraction = scrollTop / maxScroll;
            scrollFraction = Math.max(0, Math.min(1, scrollFraction));

            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(scrollFraction * frameCount)
            );

            requestAnimationFrame(() => {
                if (images[frameIndex] && images[frameIndex].complete) {
                    context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
                }
            });
        });
    }

    // 2. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    const body = document.body;

    if (themeToggleBtn) {
        // Load theme from localStorage if preferred
        const savedTheme = localStorage.getItem('vvisc-theme');
        if (savedTheme) {
            body.classList.remove('light-mode', 'dark-mode');
            body.classList.add(savedTheme);
            if (themeLabel) themeLabel.textContent = savedTheme === 'dark-mode' ? 'Dark Mode' : 'Light Mode';
        }

        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                body.classList.replace('light-mode', 'dark-mode');
                if (themeLabel) themeLabel.textContent = 'Dark Mode';
                localStorage.setItem('vvisc-theme', 'dark-mode');
            } else {
                body.classList.replace('dark-mode', 'light-mode');
                if (themeLabel) themeLabel.textContent = 'Light Mode';
                localStorage.setItem('vvisc-theme', 'light-mode');
            }
        });
    }

    // 3. Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (hamburger && mobileMenu) {
        const toggleMenu = () => {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        };

        hamburger.addEventListener('click', toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // 4. Scroll Reveal Animation using Intersection Observer
    const fadeElements = document.querySelectorAll('.fade-in, .reveal-left, .reveal-right, .reveal-up, .reveal-down, .reveal-scale, .reveal-zoom');
    if (fadeElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => observer.observe(el));
    }

    // 5. Count-Up Animation for "Our Impact" section
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        let hasAnimated = false;

        const countUpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    statNumbers.forEach(stat => {
                        const target = +stat.getAttribute('data-target');
                        const duration = 2000; // 2 seconds
                        const increment = target / (duration / 16); // ~60fps

                        let current = 0;
                        const updateCount = () => {
                            current += increment;
                            if (current < target) {
                                stat.innerText = Math.ceil(current);
                                requestAnimationFrame(updateCount);
                            } else {
                                stat.innerText = target;
                            }
                        };
                        updateCount();
                    });
                }
            });
        }, { threshold: 0.5 });

        const impactContainer = document.querySelector('.impact-container');
        if (impactContainer) {
            countUpObserver.observe(impactContainer);
        }
    }
});
