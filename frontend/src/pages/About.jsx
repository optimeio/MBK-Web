import Icon from '../components/Icon';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

function About({ id, hideHero }) {
  useEffect(() => {
    // Reveal Observer
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

    // Particles (Background)
    const canvas = !hideHero ? document.getElementById('particle-canvas') : null;
    let animationId;
    if (canvas) {
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
        animationId = requestAnimationFrame(animate);
      }
      animate();

      const handleResize = () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        revealObserver.disconnect();
      };
    } else {
        return () => revealObserver.disconnect();
    }
  }, []);

  return (
    <main id={id}>
      {!hideHero && (
        <>
          <Helmet>
            <title>About Us | MBK Technology - Engineering Excellence in Salem</title>
            <meta name="description" content="Learn about MBK Technology, Salem's premier technical training organization. We specialize in Industry 4.0, AI, Electric Vehicles, and Skill Development aligned with Naan Mudhalvan." />
            <link rel="canonical" href="https://mbktechnologies.info/about" />
          </Helmet>
          <canvas id="particle-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}></canvas>
        </>
      )}

      {/* HERO */}
      {!hideHero && (
        <header className="hero" style={{ minHeight: '55vh', paddingTop: '9rem', paddingBottom: '4rem' }}>
          <div className="hero-bg">
            <div className="hero-orb hero-orb-1"></div>
            <div className="hero-orb hero-orb-2"></div>
            <div className="hero-grid"></div>
          </div>
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="hero-badge reveal"><span className="dot"></span>About Us</div>
            <h1 className="reveal"
                style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, background: 'linear-gradient(160deg,#fff 0%,#e2e8f0 40%,#94a3b8 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px', marginBottom: '1.2rem' }}>
                About MBK Technology</h1>
            <p className="reveal delay-1"
                style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '580px', lineHeight: 1.85 }}>
                A State-Level technical training organization based in Salem, Tamil Nadu — driven by excellence, innovation, and measurable impact.
            </p>
          </div>
        </header>
      )}

      {/* AUTHORITY */}
      <section style={{ paddingTop: hideHero ? '2rem' : '5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }} className="reveal">
            <div>
                <span className="section-label">Our Identity</span>
                <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', margin: '1rem 0 1.5rem', background: 'linear-gradient(135deg,var(--text-main),var(--text-soft))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
                    Authority &amp; Excellence</h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '1.4rem', lineHeight: 1.85, textAlign: 'justify' }}>
                    MBK Technology maintains a verified network of qualified technical trainers delivering domain-specific training and practical hands-on sessions. We specialize in providing structured, measurable, and scalable training models.
                </p>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.85, textAlign: 'justify' }}>
                    We support <strong style={{ color: 'var(--primary-light)' }}>Naan Mudhalvan</strong> and similar government initiatives with job-oriented skill modules aligned with current industry requirements.
                </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="card reveal delay-1" style={{ padding: '1.8rem', background: 'rgba(249,115,22,0.05)' }}>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                        <Icon name="target" style={{ width: '18px', marginRight: '10px', verticalAlign: 'middle', color: 'var(--primary)' }} />
                        Domain Specific
                    </h4>
                    <p style={{ fontSize: '0.9rem' }}>Modules designed for Civil, Mechanical, EV, and IT engineering domains.</p>
                </div>
                <div className="card reveal delay-2" style={{ padding: '1.8rem', background: 'rgba(139,92,246,0.05)' }}>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                        <Icon name="shield-check" style={{ width: '18px', marginRight: '10px', verticalAlign: 'middle', color: 'var(--accent)' }} /> 
                        Gov Aligned
                    </h4>
                    <p style={{ fontSize: '0.9rem' }}>Deployment partner supporting state-level skill development initiatives.</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section>
        <div className="container">
          <div className="section-title reveal"><span className="section-label">Our Pillars</span>
            <h2>What Makes Us Different</h2>
            <div className="section-divider"></div>
          </div>
          <div className="about-pillars" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="about-pillar reveal delay-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
              <div className="about-pillar-icon" style={{ background: 'rgba(249,115,22,0.1)', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px', color: 'var(--primary)', marginBottom: '1.5rem' }}><Icon name="award" /></div>
              <h3 style={{ marginBottom: '1rem' }}>Industry Certified</h3>
              <p style={{ color: 'var(--text-muted)' }}>All trainers hold industry certifications and meet latest standards.</p>
            </div>
            <div className="about-pillar reveal delay-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
              <div className="about-pillar-icon" style={{ background: 'rgba(249,115,22,0.1)', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px', color: 'var(--primary)', marginBottom: '1.5rem' }}><Icon name="layers" /></div>
              <h3 style={{ marginBottom: '1rem' }}>Structured</h3>
              <p style={{ color: 'var(--text-muted)' }}>Meticulously designed syllabi ensuring theory meets practical application.</p>
            </div>
            <div className="about-pillar reveal delay-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
              <div className="about-pillar-icon" style={{ background: 'rgba(249,115,22,0.1)', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px', color: 'var(--primary)', marginBottom: '1.5rem' }}><Icon name="map" /></div>
              <h3 style={{ marginBottom: '1rem' }}>Pan-TN Reach</h3>
              <p style={{ color: 'var(--text-muted)' }}>Deployment network spanning colleges across all districts of Tamil Nadu.</p>
            </div>
            <div className="about-pillar reveal delay-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
              <div className="about-pillar-icon" style={{ background: 'rgba(249,115,22,0.1)', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px', color: 'var(--primary)', marginBottom: '1.5rem' }}><Icon name="bar-chart-2" /></div>
              <h3 style={{ marginBottom: '1rem' }}>Measurable</h3>
              <p style={{ color: 'var(--text-muted)' }}>Data-driven tracking of student engagement and employability scores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section style={{ background: 'rgba(139,92,246,0.03)', borderTop: '1px solid rgba(139,92,246,0.08)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="card reveal delay-1" style={{ padding: '4rem' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><Icon name="rocket" style={{ width: '40px', height: '40px' }} /></div>
                <h3 style={{ marginBottom: '1.5rem' }}>Our Mission</h3>
                <p style={{ textAlign: 'justify', color: 'var(--text-muted)', lineHeight: 1.7 }}>To empower engineering students, working professionals, and institutions with structured, industry-relevant training that builds confidence, competence, and career readiness aligned with Industry 4.0.</p>
            </div>
            <div className="card reveal delay-2" style={{ padding: '4rem' }}>
                <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}><Icon name="eye" style={{ width: '40px', height: '40px' }} /></div>
                <h3 style={{ marginBottom: '1.5rem' }}>Our Vision</h3>
                <p style={{ textAlign: 'justify', color: 'var(--text-muted)', lineHeight: 1.7 }}>To become Tamil Nadu's most trusted technical training partner by 2030 — recognized for measurable outcomes, certified quality, and scalable solutions.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
