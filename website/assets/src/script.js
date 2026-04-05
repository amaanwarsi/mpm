 // NAV SCROLL
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // MOBILE MENU
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        // Close mobile menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });

        // COPY COMMAND
        function copyCommand(btn) {
            const text = 'npm install -g @amaanwarsi/mpm';
            navigator.clipboard.writeText(text).then(() => {
                btn.classList.add('copied');
                btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
                }, 2000);
            });
        }

        // COPY JSON
        function copyJSON(btn) {
            const text = `{
  "name": "my-project",
  "assets": {
    "preline": {
      "version": "2.0.1",
      "files": ["dist/preline.min.js"],
      "type": "js",
      "out": "assets/ui.js"
    },
    "bootstrap": {
      "version": "5.3.0",
      "files": ["dist/css/bootstrap.min.css"],
      "type": "css",
      "out": "assets/bootstrap.css"
    }
  }
}`;
            navigator.clipboard.writeText(text).then(() => {
                btn.classList.add('copied');
                btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
                }, 2000);
            });
        }

        // INTERSECTION OBSERVER
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.dataset.delay || '0');
                    setTimeout(() => {
                        el.classList.add('visible');

                        // Animate ranking bars
                        if (el.id === 'rankingDisplay') {
                            el.querySelectorAll('.ranking-bar-fill').forEach((bar, i) => {
                                setTimeout(() => {
                                    bar.style.width = bar.dataset.width;
                                }, i * 100);
                            });
                        }
                    }, delay);
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.fade-in, .feature-card, .how-step, .command-card, .flag-row, .integration-item, .flow-item, .terminal-section').forEach(el => {
            observer.observe(el);
        });

        // Observe ranking display specifically
        const rankingDisplay = document.getElementById('rankingDisplay');
        if (rankingDisplay) {
            const rankingObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.ranking-bar-fill').forEach((bar, i) => {
                            setTimeout(() => {
                                bar.style.width = bar.dataset.width;
                            }, i * 120);
                        });
                        rankingObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            rankingObserver.observe(rankingDisplay);
        }

        // SMOOTH SCROLL
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
