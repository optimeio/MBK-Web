import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (window.scrollY > 60) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    hamburger?.classList.toggle('active');
    mobileNav?.classList.toggle('active');
    document.body.style.overflow = mobileNav?.classList.contains('active') ? 'hidden' : '';
  };

  const closeMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    hamburger?.classList.remove('active');
    mobileNav?.classList.remove('active');
    document.body.style.overflow = '';
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    closeMenu();
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        if (targetId === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
        else document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      if (targetId === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav id="navbar">
        <div className="container nav-content">
          <Link to="/" className="logo" onClick={(e) => handleNavClick(e, 'home')}>
            <div className="logo-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <img src="/assets/training.png" alt="MBK Logo" className="logo-img" style={{
                filter: 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.6))',
                height: '55px',
                transition: 'var(--transition)'
              }} />
              <div className="logo-glow" style={{ position: 'absolute', inset: '-5px', background: 'var(--primary)', filter: 'blur(20px)', opacity: '0.15', borderRadius: '50%', zIndex: -1 }}></div>
            </div>
            <div className="logo-text">
              <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900 }}>MBK TECHNOLOGY</span>
              <div className="tagline">Knowledge to Success</div>
            </div>
          </Link>
          <div className="nav-links">
            <a href="/" onClick={(e) => handleNavClick(e, 'home')} className={currentPath === '/' ? 'active' : ''}>Home</a>
            <a href="/courses" onClick={(e) => handleNavClick(e, 'courses')} className={currentPath === '/courses' ? 'active' : ''}>Courses</a>
            <Link to="/about" onClick={closeMenu} className={currentPath === '/about' ? 'active' : ''}>About</Link>
            <a href="/contact" onClick={(e) => handleNavClick(e, 'contact')} className={currentPath === '/contact' ? 'active' : ''}>Contact</a>
            <Link to="/lms" className="nav-btn" onClick={closeMenu}>LMS Login</Link>
          </div>
          <button className="hamburger" id="hamburger" aria-label="Menu" onClick={toggleMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div className="mobile-nav" id="mobile-nav">
        <a href="/" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
        <a href="/courses" onClick={(e) => handleNavClick(e, 'courses')}>Courses</a>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <a href="/contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
        <Link to="/lms" className="nav-btn" onClick={closeMenu} style={{ marginTop: '20px' }}>LMS Login</Link>
      </div>
    </>
  );
}

export default Navbar;
