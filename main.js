document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       0. Active Page Highlighting & Sliding Hover Pill
       ============================================ */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
        const hoverPill = document.createElement('div');
        hoverPill.className = 'nav-hover-pill';
        navLinksContainer.appendChild(hoverPill);
        
        const desktopLinks = navLinksContainer.querySelectorAll('a');
        desktopLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const linkRect = link.getBoundingClientRect();
                const containerRect = navLinksContainer.getBoundingClientRect();
                
                hoverPill.style.left = `${linkRect.left - containerRect.left}px`;
                hoverPill.style.width = `${linkRect.width}px`;
                hoverPill.style.opacity = '1';
            });
        });
        
        navLinksContainer.addEventListener('mouseleave', () => {
            hoverPill.style.opacity = '0';
        });
    }

    /* ============================================
       0b. 3D Tilt Tracking for Premium Cards
       ============================================ */
    const tiltCards = document.querySelectorAll('.card, .event-card, .department-card, .profile-card');
    const isTouchDevice = matchMedia('(hover: none)').matches;
    
    if (!isTouchDevice) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const tiltX = (0.5 - y) * 6; // max 3deg
                const tiltY = (x - 0.5) * 6;
                card.style.setProperty('--tilt-x', `${tiltX}deg`);
                card.style.setProperty('--tilt-y', `${tiltY}deg`);
            });
            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        });
    }

    /* ============================================
       0c. Stagger Index Assignment for Card Grids
       ============================================ */
    document.querySelectorAll('.grid-container, .event-grid, .profile-grid, .gallery-grid').forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            child.style.setProperty('--stagger', i);
        });
    });

    /* ============================================
       1. Preloader + Scroll-Driven Frame Animation
       ============================================ */
    const scrollContainer = document.querySelector('.scroll-container');
    const canvas = document.getElementById('scroll-canvas');
    const preloader = document.querySelector('.preloader');
    const preloaderBar = document.querySelector('.preloader-bar-fill');

    if (scrollContainer && canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 176;
        const currentFrame = index => `frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
        const images = [];
        let loadedImages = 0;

        const updatePreloader = () => {
            const pct = Math.round((loadedImages / frameCount) * 100);
            if (preloaderBar) preloaderBar.style.width = pct + '%';
            if (loadedImages >= frameCount && preloader) {
                preloader.classList.add('is-hidden');
            }
        };

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
                updatePreloader();
            };
            img.onerror = () => {
                loadedImages++;
                updatePreloader();
            };
            images.push(img);
        }

        // Safety net: hide preloader after 4s regardless, so a slow/broken
        // asset never traps the visitor on a blank screen.
        setTimeout(() => {
            if (preloader) preloader.classList.add('is-hidden');
        }, 4000);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const maxScroll = scrollContainer.offsetHeight - window.innerHeight;

                let scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;
                scrollFraction = Math.max(0, Math.min(1, scrollFraction));

                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.floor(scrollFraction * frameCount)
                );

                if (images[frameIndex] && images[frameIndex].complete && images[frameIndex].naturalWidth > 0) {
                    context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
                }
                ticking = false;
            });
        });
    } else if (preloader) {
        // No frame sequence on this page — don't block on it.
        preloader.classList.add('is-hidden');
    }

    /* ============================================
       2. Theme Toggle Logic
       ============================================ */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    const body = document.body;

    if (themeToggleBtn) {
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

    /* ============================================
       3. Hamburger Menu Logic
       ============================================ */
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

    /* ============================================
       4. Scroll Reveal Animation using Intersection Observer
       ============================================ */
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

    /* ============================================
       5. Count-Up Animation for "Our Impact" section
       ============================================ */
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        let hasAnimated = false;

        const easeOutQuad = t => t * (2 - t);

        const countUpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    statNumbers.forEach(stat => {
                        const target = +stat.getAttribute('data-target');
                        const duration = 1600;
                        const startTime = performance.now();

                        const updateCount = (now) => {
                            const elapsed = now - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = easeOutQuad(progress);
                            const current = Math.floor(eased * target);
                            stat.innerText = current;
                            if (progress < 1) {
                                requestAnimationFrame(updateCount);
                            } else {
                                stat.innerText = target;
                            }
                        };
                        requestAnimationFrame(updateCount);
                    });
                }
            });
        }, { threshold: 0.4 });

        const impactContainer = document.querySelector('.impact-container');
        if (impactContainer) {
            countUpObserver.observe(impactContainer);
        }
    }

    /* ============================================
       6. Navbar scroll state + scroll progress bar
       ============================================ */
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.querySelector('.scroll-progress');

    const updateNavOnScroll = () => {
        const scrollY = window.scrollY;
        if (navbar) {
            navbar.classList.toggle('is-scrolled', scrollY > 20);
        }
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            scrollProgress.style.width = Math.min(100, Math.max(0, pct)) + '%';
        }
    };
    window.addEventListener('scroll', updateNavOnScroll, { passive: true });
    updateNavOnScroll();

    /* ============================================
       7. Custom Cursor (desktop / mouse only)
       ============================================ */
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (supportsHover) {
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        const cursorRing = document.createElement('div');
        cursorRing.className = 'cursor-ring';
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorRing);
        document.body.classList.add('cursor-active');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateRing);
        };
        requestAnimationFrame(animateRing);

        const hoverTargets = 'a, button, .card, .event-card, .department-card, .profile-card, .gallery-item, .carousel-item, input, textarea';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                cursorRing.classList.add('is-hovering');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                cursorRing.classList.remove('is-hovering');
            }
        });

        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
        });
    }

    /* ============================================
       8. Page Transitions (Premium Multi-Panel Slide)
       ============================================ */
    const panel1 = document.createElement('div');
    panel1.className = 'transition-panel panel-copper';
    const panel2 = document.createElement('div');
    panel2.className = 'transition-panel panel-dark';
    
    document.body.appendChild(panel1);
    document.body.appendChild(panel2);

    // Entrance animation: panels slide out of view.
    requestAnimationFrame(() => {
        panel1.classList.add('is-entering');
        panel2.classList.add('is-entering');
        document.body.classList.add('is-page-ready');
    });

    const isInternalLink = (link) => {
        if (!link) return false;
        const href = link.getAttribute('href');
        if (!href) return false;
        if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
        if (link.target === '_blank') return false;
        return href.endsWith('.html') || href === '/' || href === '';
    };

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!isInternalLink(link)) return;
            const destination = link.getAttribute('href');
            if (destination === currentPage) return;
            e.preventDefault();
            
            panel1.classList.remove('is-entering');
            panel2.classList.remove('is-entering');
            
            panel1.classList.add('is-leaving');
            panel2.classList.add('is-leaving');
            
            setTimeout(() => {
                window.location.href = destination;
            }, 680); // Match transition duration (600ms) plus a tiny buffer
        });
    });

    /* ============================================
       9. Contact Form Handling
       ============================================ */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        let statusEl = contactForm.querySelector('.form-status');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.className = 'form-status';
            contactForm.appendChild(statusEl);
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const requiredFields = contactForm.querySelectorAll('[required]');
            let allFilled = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) allFilled = false;
            });

            if (!allFilled) {
                statusEl.textContent = 'Please fill in all fields before sending.';
                statusEl.className = 'form-status error is-visible';
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.dataset.originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
            }

            // NOTE: This currently simulates a send. Once a backend endpoint
            // exists (e.g. POST /api/contact), replace this timeout with a
            // fetch() call to that endpoint and handle the real response.
            setTimeout(() => {
                statusEl.textContent = "Message sent — we'll get back to you soon.";
                statusEl.className = 'form-status success is-visible';
                contactForm.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText || 'Send Message';
                }
            }, 900);
        });
    }

    /* ============================================
       10. Announcements: Search + Category Filter
       ============================================ */
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
        const filterInput = filterBar.querySelector('.filter-input');
        const filterBtns = filterBar.querySelectorAll('.filter-btn');
        const announcementCards = document.querySelectorAll('.announcement-card');
        const announcementList = document.querySelector('.announcement-list');

        let noResultsEl = document.querySelector('.no-results');
        if (!noResultsEl && announcementList) {
            noResultsEl = document.createElement('div');
            noResultsEl.className = 'no-results';
            noResultsEl.textContent = 'No announcements match your search.';
            announcementList.insertAdjacentElement('afterend', noResultsEl);
        }

        let activeCategory = 'All';

        const applyFilters = () => {
            const query = (filterInput ? filterInput.value : '').trim().toLowerCase();
            let visibleCount = 0;

            announcementCards.forEach(card => {
                const categoryEl = card.querySelector('.category');
                const cardCategory = categoryEl ? categoryEl.textContent.trim() : '';
                const text = card.textContent.toLowerCase();

                const matchesCategory = activeCategory === 'All' || cardCategory === activeCategory;
                const matchesQuery = !query || text.includes(query);

                const shouldShow = matchesCategory && matchesQuery;
                card.classList.toggle('is-filtered-out', !shouldShow);
                if (shouldShow) visibleCount++;
            });

            if (noResultsEl) {
                noResultsEl.classList.toggle('is-visible', visibleCount === 0);
            }
        };

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = btn.textContent.trim();
                applyFilters();
            });
        });

        if (filterInput) {
            filterInput.addEventListener('input', applyFilters);
        }
    }
    /* ============================================
       11. Timeline Scroll-bound Line Drawing
       ============================================ */
    const timelines = document.querySelectorAll('.timeline');
    if (timelines.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in-view');
                } else {
                    entry.target.classList.remove('is-in-view');
                }
            });
        }, observerOptions);
        
        timelines.forEach(t => observer.observe(t));
        
        const animateTimelineLines = () => {
            timelines.forEach(t => {
                if (!t.classList.contains('is-in-view')) return;
                const rect = t.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                const start = rect.top - windowHeight;
                const total = rect.height;
                const scrolled = -start;
                
                let progress = total > 0 ? (scrolled / total) : 0;
                progress = Math.max(0, Math.min(1, progress));
                
                t.style.setProperty('--timeline-line-height', `${progress * 100}%`);
            });
        };
        
        window.addEventListener('scroll', animateTimelineLines, { passive: true });
        animateTimelineLines();
    }

});
