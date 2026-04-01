import Icon from './components/Icon';
import { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import LMSLogin from './pages/LMSLogin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    // 1. Unmount original page loader smoothly on first render
    const loader = document.getElementById('page-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
          document.body.classList.add('loaded'); // Activates initial CSS reveals
        }, 800);
      }, 500); // Give React 500ms to paint DOM
    }
  }, []);

  if (window.location.pathname.startsWith('/admin')) {
    return <AdminDashboard />;
  }

  return (
    <Router>
      <ScrollToTop />
      {/* Global Elements */}
      <div id="cursor-glow" style={{ position: 'fixed', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 1, transition: 'transform 0.08s linear' }}></div>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/lms" element={<LMSLogin />} />
      </Routes>

      <Footer />
      <ChatWidget />

      <button id="scrollTop" aria-label="Scroll to top"><Icon name="chevron-up" style={{ width: '20px', height: '20px' }} /></button>
    </Router>
  );
}

export default App;
