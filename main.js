document.addEventListener('DOMContentLoaded', () => {
    // 0. Scroll Animation Logic
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

    // 1. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    const body = document.body;

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            if (themeLabel) themeLabel.textContent = 'Dark Mode';
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            if (themeLabel) themeLabel.textContent = 'Light Mode';
        }
    });

    // 2. Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('active');
        // Simple animation for hamburger bars can be added via CSS
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // 3. Scroll Reveal Animation using Intersection Observer
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // 4. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
