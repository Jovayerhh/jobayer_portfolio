        // Custom Cursor - Optimized
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');

        if (cursor && follower && window.innerWidth > 768) {
            let mouseX = 0, mouseY = 0;
            let followerX = 0, followerY = 0;
            let cursorVisible = false;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                if (!cursorVisible) {
                    cursor.style.display = 'block';
                    follower.style.display = 'block';
                    cursorVisible = true;
                }
                
                cursor.style.left = mouseX + 'px';
                cursor.style.top = mouseY + 'px';
            });

            function animateFollower() {
                const dx = mouseX - followerX;
                const dy = mouseY - followerY;
                
                followerX += dx * 0.1;
                followerY += dy * 0.1;
                
                follower.style.left = followerX + 'px';
                follower.style.top = followerY + 'px';
                
                requestAnimationFrame(animateFollower);
            }
            animateFollower();

            // Cursor hover effects
            const interactiveElements = document.querySelectorAll('a, button, .project-card');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
                });
                el.addEventListener('mouseleave', () => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                    follower.style.transform = 'translate(-50%, -50%) scale(1)';
                });
            });
        }

        // Optimized Parallax Effect
        let ticking = false;

        function updateParallax() {
            const scrollPos = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            const heroGrid = document.querySelector('.hero-grid');
            const heroBg = document.querySelector('.hero-bg');

            if (scrollPos < window.innerHeight) {
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrollPos * 0.5}px)`;
                    heroContent.style.opacity = 1 - scrollPos / 700;
                }

                if (heroGrid) {
                    heroGrid.style.transform = `translateY(${scrollPos * 0.3}px)`;
                }

                if (heroBg) {
                    heroBg.style.transform = `translateY(${scrollPos * 0.2}px)`;
                }
            }

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });

        // Scroll reveal animations - Optimized
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.project-card, .skill-card');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Form submission
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = form.querySelector('.submit-btn');
                const originalText = btn.textContent;
                btn.textContent = 'Sending...';
                btn.disabled = true;
                btn.style.background = 'linear-gradient(135deg, var(--secondary), var(--accent))';
                
                setTimeout(() => {
                    btn.textContent = 'Message Sent! ✓';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.background = 'linear-gradient(135deg, var(--primary), var(--accent))';
                        form.reset();
                    }, 2000);
                }, 1500);
            });
        }

        // Navigation background on scroll
        const nav = document.querySelector('nav');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.style.background = 'rgba(10, 10, 15, 0.95)';
                nav.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.3)';
            } else {
                nav.style.background = 'rgba(10, 10, 15, 0.8)';
                nav.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        });

        // Performance: Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('*').forEach(el => {
                const computedStyle = window.getComputedStyle(el);
                if (computedStyle.animationName !== 'none') {
                    el.style.animation = 'none';
                }
                el.style.transition = 'none';
            });
        }

        console.log('%c🚀 Portfolio Loaded Successfully', 'color: #00f5ff; font-size: 16px; font-weight: bold;');
        console.log('%cDesigned with passion, built with precision.', 'color: #ff2d95; font-size: 12px;');
    