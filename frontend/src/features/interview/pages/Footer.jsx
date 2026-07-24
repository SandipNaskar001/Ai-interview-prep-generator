import React from 'react';
import '../styles/home.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} All Rights Reserved.</p>
        <p className="credit">
          Design & Code by <span>Sandip Naskar</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;