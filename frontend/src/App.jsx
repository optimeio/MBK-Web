import Icon from './components/Icon';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load heavy pages to reduce initial bundle & speed up first paint
const Courses = lazy(() => import('./pages/Courses'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LMSLogin = lazy(() => import('./pages/LMSLogin'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1rem' }}>
    Loading...
  </div>
);

function App() {
  useEffect(() => {
    const loader = document.getElementById('page-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
          document.body.classList.add('loaded');
        }, 600);
      }, 400);
    }

    // Cursor glow
    const glow = document.getElementById('cursor-glow');
    if (glow) {
      const handleMove = (e) => {
        glow.style.transform = `translate(${e.clientX - 160}px, ${e.clientY - 160}px)`;
      };
      window.addEventListener('mousemove', handleMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMove);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div id="cursor-glow" style={{ position: 'fixed', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 1, transition: 'transform 0.08s linear' }}></div>
      <Navbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lms" element={<LMSLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>

      <Footer />
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>

      <button id="scrollTop" aria-label="Scroll to top"><Icon name="chevron-up" style={{ width: '20px', height: '20px' }} /></button>
    </Router>
  );
}

export default App;
