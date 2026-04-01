/* ==========================================
   MBK Technology — Premium Portal Script
   ========================================== */

/* ---- Page Loader ---- */
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('page-loader');
        if (loader) loader.classList.add('hidden');
    }, 1100);
});

/* ---- Particle Canvas ---- */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = [];
    const count = Math.min(70, Math.floor(W * H / 18000));

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.size = Math.random() * 1.5 + 0.4;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            const colors = ['249,115,22', '225,29,72', '139,92,246', '255,255,255'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < count; i++) particles.push(new Particle());

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.strokeStyle = `rgba(249,115,22,${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });
})();

/* ---- Navbar Scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar && navbar.classList.add('scrolled');
    } else {
        navbar && navbar.classList.remove('scrolled');
    }
});

/* ---- Active Nav Link ---- */
(function setActiveNav() {
    const links = document.querySelectorAll('.nav-links a, .mobile-nav a');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === current || (current === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
})();

/* ---- Hamburger Menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ---- Scroll Reveal ---- */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Animated Counter ---- */
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-num[data-target]').forEach(el => counterObserver.observe(el));

/* ---- Typed Text ---- */
(function typedText() {
    const el = document.getElementById('typed-text');
    if (!el) return;
    const phrases = el.getAttribute('data-phrases').split('|');
    let phraseIndex = 0, charIndex = 0, deleting = false;

    function type() {
        const current = phrases[phraseIndex % phrases.length];
        if (deleting) {
            el.textContent = current.substring(0, charIndex--);
        } else {
            el.textContent = current.substring(0, charIndex++);
        }

        let speed = deleting ? 40 : 90;

        if (!deleting && charIndex > current.length) {
            deleting = true;
            speed = 1800;
        } else if (deleting && charIndex < 0) {
            deleting = false;
            phraseIndex++;
            speed = 400;
        }
        setTimeout(type, speed);
    }
    type();
})();

/* ---- FAQ Accordion ---- */
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const isOpen = btn.classList.contains('active');

        document.querySelectorAll('.faq-question').forEach(b => {
            b.classList.remove('active');
            b.nextElementSibling.classList.remove('active');
        });

        if (!isOpen) {
            btn.classList.add('active');
            answer.classList.add('active');
        }
    });
});

/* ---- Chat Widget ---- */
const chatBtn = document.getElementById('chatBtn');
const chatWindow = document.getElementById('chatWindow');
if (chatBtn && chatWindow) {
    chatBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatWindow.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!chatBtn.contains(e.target) && !chatWindow.contains(e.target)) {
            chatWindow.classList.remove('active');
        }
    });
}

/* ---- Scroll to Top ---- */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---- Cursor Glow ---- */
(function cursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    let mx = -200, my = -200;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        glow.style.transform = `translate(${mx - 150}px, ${my - 150}px)`;
    });
})();

/* ---- Magnetic Buttons ---- */
document.querySelectorAll('.btn-primary, .nav-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translateY(-3px) translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});
