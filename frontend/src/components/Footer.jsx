import Icon from './Icon';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img src="/assets/training.png" alt="MBK Logo" className="logo-img" style={{ height: '60px', filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.4))' }} />
              <div className="logo-text">
                <span>MBK TECHNOLOGY</span>
                <div className="tagline">Knowledge to Success</div>
              </div>
            </Link>
            <p style={{ marginBottom: '1.5rem' }}>Premium Technical Training &amp; Skill Development in Salem, Tamil Nadu. Official trainer deployment partner for Naan Mudhalvan &amp; government initiatives.</p>
            <a href="https://g.page/r/CWnSIgOkZnoGEAE/review" target="_blank" rel="noopener noreferrer" className="btn btn-google" style={{ display: 'inline-flex', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
              <Icon name="star" style={{ width: '14px', height: '14px', fill: '#FBBC05', color: '#FBBC05' }} /> Review Us on Google
            </a>
          </div>
          <div className="footer-links">
            <h4>Core Programs</h4>
            <ul>
              <li><Link to="/courses">Industry 4.0</Link></li>
              <li><Link to="/courses">EV Technology</Link></li>
              <li><Link to="/courses">AI &amp; Data Analytics</Link></li>
              <li><Link to="/courses">Smart Infrastructure</Link></li>
              <li><Link to="/services">Institutional Services</Link></li>
            </ul>
          </div>
          <div className="footer-links" id="contact-info">
            <h4>Contact Us</h4>
            <a href="https://maps.google.com/?q=MBK+Technology+Salem" target="_blank" rel="noopener noreferrer" className="footer-contact-item" style={{ textDecoration: 'none', color: 'inherit' }}><Icon name="map-pin" style={{ width: '16px', height: '16px' }} /><span>259-B, III Floor, OM Shiva Towers, Near DNC Mall, Fairlands, Salem – 636004</span></a>
            <a href="tel:+918807653965" className="footer-contact-item" style={{ textDecoration: 'none', color: 'inherit' }}><Icon name="phone" style={{ width: '16px', height: '16px' }} /><span>+91 88076 53965</span></a>
            <a href="mailto:mbktechnologies8@gmail.com" className="footer-contact-item" style={{ textDecoration: 'none', color: 'inherit' }}><Icon name="mail" style={{ width: '16px', height: '16px' }} /><span>mbktechnologies8@gmail.com</span></a>

            <h4 style={{ marginTop: '1.5rem', marginBottom: '0.8rem' }}>Follow Us</h4>
            <div className="social-links" style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://instagram.com/mbktechnology" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }} aria-label="Instagram"><Icon name="instagram" /></a>
              <a href="https://facebook.com/mbktechnology" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }} aria-label="Facebook"><Icon name="facebook" /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 MBK Technology. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
