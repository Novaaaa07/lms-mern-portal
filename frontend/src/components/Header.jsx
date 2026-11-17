import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
      setShowScrollBtn(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className={`scroll-up-btn ${showScrollBtn ? 'show' : ''}`} onClick={scrollToTop}>
        &#8593;
      </div>
      <nav className={`navbar ${isSticky ? 'sticky' : ''}`}>
        <div className="max-width">
          <div className="logo">
            <Link to="/">LMS<span>Software</span></Link>
          </div>
          <ul className="menu">
            <li><Link to="/" className="menu-btn">Home</Link></li>
            <li><Link to="/login" className="menu-btn">Login</Link></li>
            <li><Link to="/register" className="menu-btn">Registration</Link></li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export const Footer = () => (
  <footer>
    <span>
      Created By <a href="https://www.facebook.com/share/14vPaJk6eaf/" target="_blank" rel="noreferrer">Priyanshu Shukla</a> | 
      <span> &copy; </span> 2026 All rights reserved.
    </span>
  </footer>
);