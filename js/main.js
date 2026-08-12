/**
 * KROVANA — Main JavaScript
 */

(function() {
    'use strict';

    // ---- NAVIGATION ----
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Hamburger toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
    }

    // Close mobile menu on link click
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---- NETWORK CANVAS (Homepage only) ----
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let nodes = [];
        const numNodes = 55;
        const connectionDistance = 150;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            width = canvas.width;
            height = canvas.height;
        }

        function initNodes() {
            nodes = [];
            for (let i = 0; i < numNodes; i++) {
                nodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    radius: 1.2 + Math.random() * 2
                });
            }
        }

        function animateNetwork() {
            ctx.clearRect(0, 0, width, height);

            // Update positions
            for (let n = 0; n < nodes.length; n++) {
                const node = nodes[n];
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;
                node.x = Math.max(0, Math.min(width, node.x));
                node.y = Math.max(0, Math.min(height, node.y));
            }

            // Draw connections
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 0.6;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        const alpha = 1 - (dist / connectionDistance);
                        ctx.globalAlpha = alpha * 0.35;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            for (let k = 0; k < nodes.length; k++) {
                const n2 = nodes[k];
                ctx.globalAlpha = 0.4 + 0.25 * (n2.radius / 3);
                ctx.beginPath();
                ctx.arc(n2.x, n2.y, n2.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#F4F1EA';
                ctx.fill();
                if (n2.radius > 2.2) {
                    ctx.shadowColor = 'rgba(201, 162, 39, 0.06)';
                    ctx.shadowBlur = 12;
                    ctx.beginPath();
                    ctx.arc(n2.x, n2.y, n2.radius * 1.8, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(201, 162, 39, 0.03)';
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(animateNetwork);
        }

        function initCanvas() {
            resize();
            initNodes();
            animateNetwork();
        }

        window.addEventListener('resize', function() {
            resize();
            initNodes();
        });

        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                resize();
                initNodes();
            }, 300);
        });

        initCanvas();
    }

    // ---- SCROLL REVEAL ----
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

    reveals.forEach(function(el) {
        observer.observe(el);
    });

    // ---- CONTACT FORM ----
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            // Simulate sending
            setTimeout(function() {
                formFeedback.innerHTML = `
                    <div style="background: rgba(201, 162, 39, 0.10); color: var(--gold); padding: 14px 20px; border-radius: 12px; border: 1px solid rgba(201, 162, 39, 0.12);">
                        ✓ Thank you! Your message has been received. We'll be in touch within 24 hours.
                    </div>
                `;
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                setTimeout(function() {
                    formFeedback.innerHTML = '';
                }, 6000);
            }, 1500);
        });
    }

})();
