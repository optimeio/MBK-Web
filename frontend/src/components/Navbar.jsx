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
            <img src="https://i.ibb.co/4wmJCKRq/training.png" alt="MBK Logo" className="logo-img" />
            <div className="logo-text">
              <span>MBK TECHNOLOGY</span>
              <div className="tagline">Skills to Success</div>
            </div>
          </Link>
          <div className="nav-links">
            <a href="/" onClick={(e) => handleNavClick(e, 'home')} className={currentPath === '/' ? 'active' : ''}>Home</a>
            <a href="/courses" onClick={(e) => handleNavClick(e, 'courses')} className={currentPath === '/courses' ? 'active' : ''}>Courses</a>
            <a href="/services" onClick={(e) => handleNavClick(e, 'services')} className={currentPath === '/services' ? 'active' : ''}>Services</a>
            <a href="/about" onClick={(e) => handleNavClick(e, 'about')} className={currentPath === '/about' ? 'active' : ''}>About</a>
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
        <a href="/services" onClick={(e) => handleNavClick(e, 'services')}>Services</a>
        <a href="/about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
        <a href="/contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
        <Link to="/lms" className="nav-btn" onClick={closeMenu} style={{ marginTop: '20px' }}>LMS Login</Link>
      </div>
    </>
  );
}

export default Navbar;
