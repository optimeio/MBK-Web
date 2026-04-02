import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Icon from '../components/Icon';
import { Helmet } from 'react-helmet-async';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCourse = async () => {
      try {
        const res = await axios.get('/api/courses');
        const found = res.data.find(c => c._id === id);
        setCourse(found);
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Course Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>Go Back</button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{course.title} | MBK Technology</title>
        <meta name="description" content={course.description.substring(0, 150)} />
      </Helmet>
      
      <div style={{ paddingTop: '120px', paddingBottom: '80px', background: 'var(--bg-main)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontSize: '1.05rem', fontWeight: 'bold', padding: 0 }}>
            {/* simple SVG arrow so we don't rely on Icon matching perfectly if not updated */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Courses
          </button>

          <div style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {course.image && (
              <div style={{ width: '100%', maxHeight: '450px', overflow: 'hidden' }}>
                <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            )}
            
            <div style={{ padding: '3rem' }}>
              <h1 style={{ fontSize: '2.4rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: '800', lineHeight: 1.2 }}>{course.title}</h1>
              
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                {course.duration && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '50%' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Duration</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>{course.duration}</div>
                    </div>
                  </div>
                )}
                
                {course.price && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '12px', borderRadius: '50%' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Price</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.15rem', color: '#4ade80' }}>{course.price}</div>
                    </div>
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.2rem', color: 'var(--text-main)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Course Overview</h3>
              <div style={{ color: 'var(--text-soft)', lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                {course.description}
              </div>

              <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                <button onClick={() => navigate('/?enroll=' + course._id)} className="btn btn-primary" style={{ padding: '1.2rem 3.5rem', fontSize: '1.15rem', borderRadius: '50px' }}>
                  Enroll in this Course
                </button>
                <p style={{ marginTop: '1.2rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Ready to start? Registration is quick and easy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetails;
