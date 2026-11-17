import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/Header';

const PortalLanding = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />

      {/* Hero Section with Library Background Image */}
      <section
        style={{
         background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url("/banner.jpg") center/cover no-repeat',
          color: '#fff',
          textAlign: 'center',
          padding: '170px 20px 110px 20px'
        }}
      >
        <h1 style={{ fontSize: '46px', fontFamily: 'Ubuntu, sans-serif', marginBottom: '12px' }}>
          Digital <span style={{ color: 'crimson' }}>Library Management</span> System
        </h1>
        <p style={{ fontSize: '18px', maxWidth: '700px', margin: '0 auto 28px auto', color: '#ddd' }}>
          Manage books, student enrollments, issue tracking, and automated late penalties in one unified MERN portal.
        </p>
        <button className="btn" style={{ fontSize: '18px', padding: '12px 30px' }} onClick={() => navigate('/login')}>
          Get Started
        </button>
      </section>

      {/* Services Section */}
      <section className="services" id="services" style={{ paddingTop: '80px', paddingBottom: '90px' }}>
        <div className="max-width">
          <h2 className="title">My services</h2>
          <div className="serv-content">
            <div className="card" onClick={() => navigate('/login')}>
              <div className="box">
                <i className="fas fa-user-graduate"></i>
                <div className="text">STUDENT PORTAL</div>
                <p>User friendly student portal with integrated features like issued book tracking, due dates, and catalog search.</p>
              </div>
            </div>

            <div className="card" onClick={() => navigate('/login')}>
              <div className="box">
                <i className="fas fa-book-reader"></i>
                <div className="text">Library Portal</div>
                <p>Library Management module with integrated features like book inventory, issuing, returns, and penalty reports.</p>
              </div>
            </div>

            <div className="card" onClick={() => navigate('/register')}>
              <div className="box">
                <i className="fas fa-id-card"></i>
                <div className="text">REGISTRATION</div>
                <p>Register or enroll new students directly into the digital records and access instant portal credentials.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PortalLanding;