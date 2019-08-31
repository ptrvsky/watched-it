import React from 'react';
import './Footer.scss';
import { Facebook, Twitter, Instagram } from 'react-feather';

function Footer() {
  return (
    <div>
      <div className="footer-overline" />
      <div className="footer-container">
        <div className="footer-flexbox">

          <div className="about flexbox-item">
            <img
              src="/logo192.png"
              width="30"
              height="30"
              className="d-inline-block align-top logo-gray"
              alt="Watched It logo"
            />
            <div className="footer-title footer-title--logo d-inline-block align-top">watchedit</div>
            <div className="about-text">
              Watched It is a free website that let you discover information about movies, TV series and people that create them. 
              Rate productions, track your progress and check at which platform you can watch your favorite TV show. All in one place.
            </div>
          </div>

          <div className="footer-links flexbox-item">
            <div className="footer-links-item"><div className="footer-title">Categories</div>
              <ul>
                <li>Movies</li>
                <li>TV Series</li>
                <li>People</li>
                <li>Rankings</li>
              </ul>
            </div>
            <div className="footer-links-item">
              <div className="footer-title">Links</div>
              <ul>
                <li>About us</li>
                <li>Terms of Service</li>
                <li>Contact</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div className="footer-links-item socials">
              <div className="footer-title">Social media</div>
              <a href="#"><Facebook className="social-logo" /></a>
              <a href="#"><Twitter className="social-logo" /></a>
              <a href="#"><Instagram className="social-logo" /></a>
            </div>
          </div>

          <div className="footer-copyright">Copyright &copy; <a href="https://github.com/ptrvsky">ptrvsky</a> 2019</div>
        </div>
      </div>
    </div>
  );
}

export default Footer;