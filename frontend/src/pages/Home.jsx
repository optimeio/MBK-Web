import Icon from '../components/Icon';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Particle } from '../utils/Particle';
import axios from 'axios';

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [formData, setFormData] = useState({
    studentName: '',
    phone: '',
    email: '',
    qualification: '',
    timing: '',
    mode: 'Offline',
  });

  useEffect(() => {
    const fetchCourses = async (retries = 3) => {
      try {
        const res = await axios.get('/api/courses', { timeout: 30000 });
        setCourses(res.data);
      } catch (err) {
        if (retries > 0) {
          console.log(`Retrying courses fetch... (${retries} left)`);
          setTimeout(() => fetchCourses(retries - 1), 3000);
        } else {
          console.error('Error fetching courses:', err);
          setLoading(false);
        }
        return;
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  // Re-run reveal observer whenever courses load so cards animate in
  useEffect(() => {
    if (courses.length === 0) return;
    const timer = setTimeout(() => {
      const revealEls = document.querySelectorAll('.reveal:not(.active), .reveal-left:not(.active), .reveal-right:not(.active), .reveal-scale:not(.active)');
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
      revealEls.forEach(el => obs.observe(el));
    }, 100);
    return () => clearTimeout(timer);
  }, [courses]);

  const openRegisterModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeRegisterModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setFormData({ studentName: '', phone: '', email: '', qualification: '', timing: '', mode: 'Offline' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register', {
        ...formData,
        courseId: selectedCourse._id
      });
      alert('Registration successful! We will contact you soon.');
      closeRegisterModal();
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Failed to register. Please try again later.');
    }
  };

  useEffect(() => {
    // Reveal script
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

    // Particle script - disabled on mobile for performance
    const canvas = document.getElementById('particle-canvas');
    const isMobile = window.innerWidth < 768;
    if (canvas && !isMobile) {
      const ctx = canvas.getContext('2d');
      let W = canvas.width = window.innerWidth;
      let H = canvas.height = window.innerHeight;

      const particles = [];
      const count = Math.min(70, Math.floor(W * H / 18000));

      for (let i = 0; i < count; i++) particles.push(new Particle(ctx, W, H));

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

      let animationId;
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
        particles.forEach(p => p.setBounds(W, H));
      };
      window.addEventListener('resize', handleResize);

      // Counters Note: to prevent leak
      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        revealObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    // Animated Counters
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

    // Typed Text
    const typedEl = document.getElementById('typed-text');
    let timeoutId;
    if (typedEl) {
      const phrases = typedEl.getAttribute('data-phrases').split('|');
      let phraseIndex = 0, charIndex = 0, deleting = false;

      function type() {
        const current = phrases[phraseIndex % phrases.length];
        if (deleting) {
          typedEl.textContent = current.substring(0, charIndex--);
        } else {
          typedEl.textContent = current.substring(0, charIndex++);
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
        timeoutId = setTimeout(type, speed);
      }
      type();
    }

    // Magnetic Buttons
    const handleMouseMove = (e) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translateY(-3px) translate(${x * 0.12}px, ${y * 0.12}px)`;
    };
    const handleMouseLeave = (e) => {
      e.currentTarget.style.transform = '';
    };

    const mBtns = document.querySelectorAll('.btn-primary, .nav-btn');
    mBtns.forEach(btn => {
      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      counterObserver.disconnect();
      clearTimeout(timeoutId);
      mBtns.forEach(btn => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Toggle FAQ
  const toggleFaq = (e) => {
    const btn = e.currentTarget;
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
  };

  return (
    <main>
      <Helmet>
        <title>MBK Technology | Best Technical Training Institute in Salem</title>
        <meta name="description" content="MBK Technology is Salem's top futuristic training academy offering expert-led programs in Full Stack Development, UI/UX Design, Electric Vehicles, AI, and Engineering. Job-ready skills with Naan Mudhalvan alignment." />
        <meta name="keywords" content="MBK Technology Salem, technical training Salem, Full Stack developer course, UI/UX design institute, AI training Salem, EV technology courses, engineering skills, Naan Mudhalvan trainer, best academy Salem" />
        <link rel="canonical" href="https://website.mbktechnologies.info/" />
        <meta property="og:title" content="MBK Technology | Knowledge to Success" />
        <meta property="og:description" content="Empowering engineers with high-end, industry-aligned skill transformation. Leading the future of technical education in Salem." />
        <meta property="og:url" content="https://website.mbktechnologies.info/" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      {/* Particle Canvas behind hero */}
      <canvas id="particle-canvas"></canvas>

      {/* HERO SECTION */}
      <header className="hero" style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(4,4,4,0.65), rgba(4,4,4,0.95)), url("/assets/high_end_hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="orbit-container">
          <div className="orbit-ring orbit-ring-1"><div className="orbit-dot" style={{ top: '0', left: '50%' }}></div></div>
          <div className="orbit-ring orbit-ring-2"><div className="orbit-dot" style={{ top: '50%', right: '0' }}></div></div>
          <div className="orbit-ring orbit-ring-3"><div className="orbit-dot" style={{ bottom: '0', left: '50%' }}></div></div>
        </div>

        <div className="container hero-content" style={{ textAlign: 'left', position: 'relative', zIndex: 10 }}>
          <div className="hero-badge reveal" style={{ background: 'rgba(249, 115, 22, 0.15)', borderColor: 'rgba(249, 115, 22, 0.3)' }} aria-label="Salem's Number 1 Technical Training Organization">
            <span className="dot"></span>
            <span style={{ color: 'var(--primary)', letterSpacing: '1.5px', fontWeight: 800 }}>THE FUTURE OF TECHNICAL EDUCATION</span>
          </div>

          <h1 className="reveal" style={{ fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', fontWeight: 900, maxWidth: '1000px', marginBottom: '1.8rem', letterSpacing: '-2.5px' }}>
            Transforming <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Knowledge</span> into<br />
            Real-World <span className="wavy-text" style={{ color: 'var(--text-main)', position: 'relative' }}>
              {"Success".split("").map((char, i) => (
                <span key={i} style={{ "--i": i }}>{char}</span>
              ))}
              <span style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%', height: '4px', background: 'var(--primary)', borderRadius: '10px' }}></span>
            </span>
          </h1>

          <p className="reveal delay-1" style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginBottom: '3rem', maxWidth: '750px', lineHeight: 1.6 }}>
            Empowering the next generation of engineers with high-end, industry-aligned skill transformation. <span style={{ color: 'var(--primary)' }}>Learn. Build. Lead.</span>
          </p>

          <div className="hero-btns reveal delay-2">
            <button className="btn btn-primary" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Explore Technical Training Programs">
              Explore Programs <Icon name="graduation-cap" style={{ width: '20px' }} />
            </button>
            <button className="btn btn-outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)' }} aria-label="Submit Admission Inquiry">
              Admission Inquiry <Icon name="arrow-right" style={{ width: '20px' }} />
            </button>
          </div>

          <div className="hero-stats reveal delay-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '5rem', paddingTop: '4rem', display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
            <div className="stat-item" style={{ background: 'transparent', border: 'none', padding: '0' }}>
              <span className="stat-num counter-num" data-target="5000" data-suffix="+" style={{ fontSize: '3rem' }}>0+</span>
              <span className="stat-label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Alumni Network</span>
            </div>
            <div className="stat-item" style={{ background: 'transparent', border: 'none', padding: '0' }}>
              <span className="stat-num counter-num" data-target="50" data-suffix="+" style={{ fontSize: '3rem' }}>0+</span>
              <span className="stat-label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Partner Institutes</span>
            </div>
            <div className="stat-item" style={{ background: 'transparent', border: 'none', padding: '0' }}>
              <span className="stat-num counter-num" data-target="100" data-suffix="%" style={{ fontSize: '3rem' }}>0%</span>
              <span className="stat-label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Placement Support</span>
            </div>
          </div>
        </div>
      </header>

      {/* MISSION & VISION */}
      <section className="mission-vision" style={{ background: 'var(--bg-black)', padding: '8rem 0', position: 'relative' }}>
        <div className="container">
          <div className="section-title reveal" style={{ textAlign: 'center', margin: '0 auto 4rem' }}>
            <span className="section-label">Foundational Core</span>
            <h2 style={{ fontSize: '3.5rem' }}>Mission & Vision</h2>
            <div className="section-divider" style={{ margin: '1.5rem auto' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '3rem' }}>
            <div className="glass-card reveal-left" style={{ padding: '3rem', borderLeft: '4px solid var(--primary)' }}>
              <div className="aura-glow" style={{ background: 'rgba(249, 115, 22, 0.1)' }}></div>
              <div className="card-icon" style={{ marginBottom: '2rem', width: '70px', height: '70px' }}>
                <Icon name="target" style={{ width: '35px', height: '35px' }} />
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Our Mission</h3>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.8', textAlign: 'justify' }}>
                To revolutionize technical training by delivering high-caliber, practical education that bridges the divide between theory and practice. We are committed to empowering students with industry-validated skills that translate directly into career success.
              </p>
            </div>

            <div className="glass-card reveal-right" style={{ padding: '3rem', borderLeft: '4px solid var(--primary-alt)' }}>
              <div className="aura-glow" style={{ background: 'rgba(236, 72, 153, 0.1)' }}></div>
              <div className="card-icon" style={{ marginBottom: '2rem', width: '70px', height: '70px', color: 'var(--primary-alt)' }}>
                <Icon name="eye" style={{ width: '35px', height: '35px' }} />
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Our Vision</h3>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.8', textAlign: 'justify' }}>
                To become the global gold standard for technical excellence and skill transformation. By 2030, MBK Technology aims to be the architecture of innovation, shaping a future where every learner is equipped to lead the technological frontier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY (TRAINING FOCUSED) */}
      <section className="our-story" id="journey" style={{
        backgroundColor: '#050505',
        backgroundImage: 'url("/assets/journey_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '8rem 0',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--bg-black), transparent, var(--bg-black))', pointerEvents: 'none' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-title reveal" style={{ textAlign: 'center', margin: '0 auto 6rem' }}>
            <span className="section-label">Evolutionary Path</span>
            <h2 style={{ fontSize: '3.5rem' }}>Our Journey</h2>
            <div className="section-divider" style={{ margin: '1.5rem auto' }}></div>
          </div>

          <div className="timeline-container" style={{ position: 'relative', minHeight: '400px' }}>
            <div className="timeline-line" style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(to bottom, transparent, var(--primary), var(--primary-alt), transparent)',
              transform: 'translateX(-50%)',
              zIndex: 0
            }}></div>

            <div className="timeline-item active" style={{ display: 'flex', opacity: 1 }}>
              <div className="timeline-dot" style={{ backgroundColor: 'var(--primary)', boxShadow: '0 0 20px var(--primary)' }}></div>
              <div className="timeline-content glass-card" style={{ padding: '2rem', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'rgba(249, 115, 22, 0.2)' }}>2018</span>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>The Ignition</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>The inception of MBK Technology in Salem, founded on the principle of bridging the severe gap between academic engineering and industry application.</p>
              </div>
            </div>

            <div className="timeline-item active" style={{ display: 'flex', opacity: 1 }}>
              <div className="timeline-dot" style={{ backgroundColor: 'var(--primary-alt)', boxShadow: '0 0 20px var(--primary-alt)' }}></div>
              <div className="timeline-content glass-card" style={{ padding: '2rem', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'rgba(236, 72, 153, 0.2)' }}>2020</span>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>Digital Transformation</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>Successfully launched comprehensive Full Stack, UI/UX, and AI training modules, training over 1,000+ students during the global digital shift.</p>
              </div>
            </div>

            <div className="timeline-item active" style={{ display: 'flex', opacity: 1 }}>
              <div className="timeline-dot" style={{ backgroundColor: 'var(--secondary)', boxShadow: '0 0 20px var(--secondary)' }}></div>
              <div className="timeline-content glass-card" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'rgba(239, 68, 68, 0.2)' }}>2022</span>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>Strategic Expansion</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>Forged strategic alliances with government skill development councils and state-level initiatives, becoming a trusted regional trainer deployment partner.</p>
              </div>
            </div>

            <div className="timeline-item active" style={{ display: 'flex', opacity: 1 }}>
              <div className="timeline-dot" style={{ backgroundColor: 'var(--primary)', boxShadow: '0 0 20px var(--primary)' }}></div>
              <div className="timeline-content glass-card" style={{ padding: '2rem', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'rgba(249, 115, 22, 0.2)' }}>2025</span>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>Global Readiness</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>Now a premier technical academy with a network of 50+ partner institutions, consistently delivering job-ready talent to the global tech ecosystem.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP SECTION */}
      <section className="leadership" id="leadership" style={{
        backgroundColor: '#080808',
        backgroundImage: 'url("/assets/leadership_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '8rem 0',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent, var(--bg-black))', pointerEvents: 'none' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-title" style={{ textAlign: 'center', margin: '0 auto 6rem' }}>
            <span className="section-label">THE VISIONARIES</span>
            <h2 style={{ fontSize: '3.5rem' }}>Meet Our Leadership</h2>
            <div className="section-divider" style={{ margin: '1.5rem auto' }}></div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
            {/* CEO */}
            <div className="glass-card leader-card active">
              <div className="aura-glow" style={{ opacity: 0.3, background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(239, 68, 68, 0.1))' }}></div>
              <div className="leader-img-wrapper">
                <div className="leader-ring" style={{ borderColor: 'rgba(249, 115, 22, 0.4)' }}></div>
                <img src="/assets/sankarganesh.png" alt="Sankarganesh R - CEO & Founder" className="leader-img" loading="lazy" />
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>Sankarganesh R</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
                CEO & Founder | Visionary Leader
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem' }}>
                <span className="hero-tag" style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--primary)' }}>Project Head</span>
                <span className="hero-tag" style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--primary)' }}>Master Trainer</span>
              </div>
              <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 500 }}>
                "Engineering Excellence, Accelerating Innovation"
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                An accomplished mechanical engineer and visionary entrepreneur who founded MBK Technology to transform industry standards through technological innovation.
              </p>
            </div>

            {/* MD */}
            <div className="glass-card leader-card active">
              <div className="aura-glow" style={{ opacity: 0.3, background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))' }}></div>
              <div className="leader-img-wrapper">
                <div className="leader-ring" style={{ borderColor: 'rgba(236, 72, 153, 0.4)', animationDirection: 'reverse' }}></div>
                <img src="/assets/ganga.jpg" alt="Ganga P - Managing Director" className="leader-img" loading="lazy" />
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>Ganga P</h3>
              <p style={{ color: 'var(--primary-alt)', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
                Managing Director | Strategic Operations
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem' }}>
                <span className="hero-tag" style={{ background: 'rgba(236,72,153,0.1)', color: 'var(--primary-alt)' }}>Brand Management</span>
                <span className="hero-tag" style={{ background: 'rgba(236,72,153,0.1)', color: 'var(--primary-alt)' }}>Business Strategy</span>
              </div>
              <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 500 }}>
                "Innovation, Sustainability & Excellence"
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                A commerce-driven visionary leading operations and strategy, ensuring excellence, scalability, and long-term impact under the MBK Technology umbrella.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section" style={{ padding: '2rem 0' }}>
        <div className="marquee-inner">
          <span>Industry 4.0</span><span>AI &amp; Data Analytics</span><span>Electric Vehicles</span>
          <span>Civil Engineering</span><span>Mechanical Engineering</span><span>Naan Mudhalvan</span>
          <span>Smart Infrastructure</span><span>Embedded Systems</span><span>Corporate Excellence</span>
          <span>Industry 4.0</span><span>AI &amp; Data Analytics</span><span>Electric Vehicles</span>
        </div>
      </div>


      {/* COURSES (DYNAMIC) */}
      <section id="courses" className="courses-section" style={{ background: 'rgba(249,115,22,0.02)', borderTop: '1px solid var(--border)', padding: '6rem 0' }}>
        <div className="container">
          <div className="section-title reveal">
            <span className="section-label">Enroll Now</span>
            <h2>Available Training Programs</h2>
            <div className="section-divider"></div>
            <p>Explore our wide range of technical and engineering courses.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
              <p style={{ color: 'var(--text-muted)' }}>Loading courses...</p>
            </div>
          ) : (
            <>
              <div className="grid">
                {courses.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No active courses available at the moment.</div>
                ) : (
                  courses.slice(0, visibleCount).map((course, index) => (
                    <div
                      className="card"
                      key={course._id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 0,
                        overflow: 'hidden',
                        animation: `fadeInUp 0.4s ease ${(index % 4) * 0.08}s both`,
                      }}
                    >
                      {/* Course Image */}
                      <div style={{ width: '100%', height: '180px', overflow: 'hidden', flexShrink: 0 }}>
                        {course.image ? (
                          <img
                            src={course.image}
                            alt={course.title}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary), #b45309)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="book-open" style={{ width: '40px', height: '40px', color: 'white', opacity: 0.7 }} />
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.6rem', lineHeight: 1.4, color: 'var(--text-main)' }}>
                          {course.title}
                        </h3>

                        {/* Meta Row */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                          {course.duration && (
                            <span style={{ fontSize: '0.82rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name="clock" style={{ width: '13px', height: '13px' }} /> {course.duration}
                            </span>
                          )}
                          {course.price && (
                            <span style={{ fontSize: '0.82rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name="tag" style={{ width: '13px', height: '13px' }} /> {course.price}
                            </span>
                          )}
                        </div>

                        {/* Description — truncated to 3 lines */}
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.6,
                          flexGrow: 1,
                          marginBottom: '1.2rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {course.description || 'A comprehensive training program designed for industry readiness.'}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                          <Link to={`/course/${course._id}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center', fontSize: '0.9rem', padding: '0.75rem' }}>
                            Details
                          </Link>
                          <button
                            className="btn btn-primary"
                            onClick={() => openRegisterModal(course)}
                            style={{ flex: 1, justifyContent: 'center', fontSize: '0.9rem', padding: '0.75rem' }}
                          >
                            Register
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {visibleCount < courses.length && (
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <button className="btn btn-outline" onClick={() => setVisibleCount(courses.length)}>
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>


      {/* REVIEWS */}
      <section className="google-review-section" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="section-title reveal" style={{ textAlign: 'center' }}>
            <span className="section-label">Testimonials</span>
            <h2>Trusted by Thousands</h2>
            <div className="section-divider" style={{ margin: '1rem auto' }}></div>
          </div>
          <div className="google-card reveal-scale" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google Reviews" loading="lazy" className="google-logo" />
            <div className="stars">
              <Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" />
            </div>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.7' }}>
              "Best technical training and government initiative aligned institute in Salem. Highly recommended for institutional partnerships."
            </p>
            <a href="https://g.page/r/CWnSIgOkZnoGEAE/review" target="_blank" rel="noopener noreferrer" className="btn btn-google" aria-label="Write a Google Review for MBK Technology">
              <Icon name="edit-3" style={{ width: '18px', height: '18px' }} /> Review Us on Google
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" style={{ padding: '6rem 0', background: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="section-title reveal" style={{ textAlign: 'center' }}>
            <span className="section-label">FAQ</span>
            <h2>Common Questions</h2>
            <div className="section-divider" style={{ margin: '1rem auto' }}></div>
          </div>
          <div className="faq-list" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="faq-item reveal delay-1">
              <button className="faq-question" onClick={toggleFaq}>What courses do you offer?<span className="faq-icon">+</span></button>
              <div className="faq-answer">
                <p>We offer Engineering, AI, EV, Industry 4.0, Embedded Systems, and Corporate Excellence programs.</p>
              </div>
            </div>
            <div className="faq-item reveal delay-2">
              <button className="faq-question" onClick={toggleFaq}>Support for Naan Mudhalvan?<span className="faq-icon">+</span></button>
              <div className="faq-answer">
                <p>Yes, we are official trainer deployment partners for Naan Mudhalvan initiatives.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CTA (Streamlined) */}
      <section id="contact" style={{ padding: '6rem 0', background: 'linear-gradient(rgba(4,4,4,0.8), rgba(4,4,4,0.8)), url("/assets/tech_landing_bg.png")', backgroundSize: 'cover' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label">Get Started</span>
            <h2>Ready to Transform Your Career?</h2>
            <div className="section-divider" style={{ margin: '1rem auto' }}></div>
            <p style={{ maxWidth: '600px', margin: '0 auto 3rem', color: 'var(--text-muted)' }}>
              Join thousands of students and institutions partnering with MBK Technology for excellence in engineering and technical training.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:+918807653965" className="btn btn-primary">
                <Icon name="phone" style={{ width: '18px' }} /> Call Us Now
              </a>
              <a href="https://wa.me/918807653965" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ borderColor: '#25D366', color: '#25D366' }}>
                <Icon name="message-circle" style={{ width: '18px' }} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={closeRegisterModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text)' }}>&times;</button>
            <h3 style={{ marginBottom: '1rem' }}>Register for {selectedCourse?.title}</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="reg-name" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--text)' }}>Student Name</label>
                <input id="reg-name" required type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
                <div>
                  <label htmlFor="reg-phone" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--text)' }}>Phone Number</label>
                  <input id="reg-phone" required type="text" name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }} />
                </div>
                <div>
                  <label htmlFor="reg-email" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--text)' }}>Email</label>
                  <input id="reg-email" required type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }} />
                </div>
              </div>
              <div>
                <label htmlFor="reg-qual" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--text)' }}>Qualification</label>
                <input id="reg-qual" required type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
                <div>
                  <label htmlFor="reg-timing" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--text)' }}>Preferred Timing</label>
                  <input id="reg-timing" required type="text" name="timing" value={formData.timing} onChange={handleInputChange} placeholder="E.g. Morning, 6 PM" style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }} />
                </div>
                <div>
                  <label htmlFor="reg-mode" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--text)' }}>Mode</label>
                  <select id="reg-mode" name="mode" value={formData.mode} onChange={handleInputChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }}>
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', display: 'block', width: '100%', textAlign: 'center' }}>Submit Registration</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
