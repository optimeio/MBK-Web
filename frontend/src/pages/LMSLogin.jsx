import React, { useEffect } from 'react';

const LMSLogin = () => {
  useEffect(() => {
    document.title = "LMS Login - MBKHackathon";
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main, #0f172a)',
      padding: '120px 20px 60px',
      position: 'relative'
    }}>
      {/* Background decorations matching the typical theme */}
      <div className="blob blob-1" style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>
      <div className="blob blob-2" style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>

      <img 
        src="https://i.ibb.co/4wmJCKRq/training.png" 
        alt="MBK Logo" 
        style={{ 
          height: '100px', 
          marginBottom: '50px', 
          zIndex: 1,
          animation: 'fadeInDown 0.8s ease backwards'
        }} 
      />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '40px', 
        width: '100%', 
        maxWidth: '900px',
        zIndex: 1 
      }}>
        
        {/* Card 1: Employability Skills */}
        <div style={{ 
          background: 'rgba(30, 41, 59, 0.7)', 
          backdropFilter: 'blur(10px)',
          padding: '50px 30px', 
          borderRadius: '20px', 
          border: '1px solid rgba(249,115,22,0.2)', 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '320px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(249,115,22,0.05)',
          animation: 'fadeInUp 0.8s ease 0.2s backwards',
          transition: 'transform 0.4s ease, box-shadow 0.4s ease'
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-10px)';
          e.currentTarget.style.boxShadow = '0 30px 50px rgba(0,0,0,0.4), inset 0 0 30px rgba(249,115,22,0.1)';
          e.currentTarget.style.border = '1px solid rgba(249,115,22,0.5)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(249,115,22,0.05)';
          e.currentTarget.style.border = '1px solid rgba(249,115,22,0.2)';
        }}>
          <h2 style={{ 
            color: '#fff', 
            fontSize: '1.8rem', 
            marginBottom: '30px', 
            lineHeight: '1.4',
            fontWeight: '600'
          }}>MBK Hackathon -<br/><span style={{ background: 'linear-gradient(45deg, #f97316, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Employability Skills</span></h2>
          
          <a 
            href="https://script.google.com/macros/s/AKfycbxsJdlbox8bd_HTAyS0bpitiM6ngz3xnvlyQvVV2qB5Y5qWJMBb5PZZN-R3uxzDqWYTNw/exec" 
            style={{ 
              background: 'linear-gradient(45deg, #f97316, #ea580c)', 
              color: '#fff', 
              padding: '16px 36px', 
              borderRadius: '50px', 
              textDecoration: 'none', 
              fontWeight: '600', 
              fontSize: '1.1rem', 
              transition: 'all 0.3s', 
              display: 'inline-block', 
              cursor: 'pointer', 
              width: '100%', 
              maxWidth: '280px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 15px rgba(249,115,22,0.3)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(249,115,22,0.5)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(249,115,22,0.3)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            target="_blank" 
            rel="noopener noreferrer"
          >
            Enter Exam Portal
          </a>
        </div>

        {/* Card 2: IOT */}
        <div style={{ 
          background: 'rgba(30, 41, 59, 0.7)', 
          backdropFilter: 'blur(10px)',
          padding: '50px 30px', 
          borderRadius: '20px', 
          border: '1px solid rgba(168,85,247,0.2)', 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '320px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(168,85,247,0.05)',
          animation: 'fadeInUp 0.8s ease 0.4s backwards',
          transition: 'transform 0.4s ease, box-shadow 0.4s ease'
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-10px)';
          e.currentTarget.style.boxShadow = '0 30px 50px rgba(0,0,0,0.4), inset 0 0 30px rgba(168,85,247,0.1)';
          e.currentTarget.style.border = '1px solid rgba(168,85,247,0.5)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(168,85,247,0.05)';
          e.currentTarget.style.border = '1px solid rgba(168,85,247,0.2)';
        }}>
          <h2 style={{ 
            color: '#fff', 
            fontSize: '1.8rem', 
            marginBottom: '30px', 
            lineHeight: '1.4',
            fontWeight: '600'
          }}>MBK Hackathon -<br/><span style={{ background: 'linear-gradient(45deg, #a855f7, #d946ef)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IOT</span></h2>
          
          <a 
            href="https://script.google.com/macros/s/AKfycbyIQU-1x1V7tVvBE6Kr8a1-SSeWJzsNQqoq7qsQhHcIikyXNCgWlsBHwWAAcgeEUYM/exec" 
            style={{ 
              background: 'linear-gradient(45deg, #a855f7, #c026d3)', 
              color: '#fff', 
              padding: '16px 36px', 
              borderRadius: '50px', 
              textDecoration: 'none', 
              fontWeight: '600', 
              fontSize: '1.1rem', 
              transition: 'all 0.3s', 
              display: 'inline-block', 
              cursor: 'pointer', 
              width: '100%', 
              maxWidth: '280px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 15px rgba(168,85,247,0.3)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(168,85,247,0.5)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(168,85,247,0.3)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            target="_blank" 
            rel="noopener noreferrer"
          >
            Enter Exam Portal
          </a>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Mobile Specific adjustments */
        @media (max-width: 768px) {
          .blob-1, .blob-2 { display: none; }
        }
      `}} />
    </div>
  );
};

export default LMSLogin;
