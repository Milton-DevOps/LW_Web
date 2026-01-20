'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Input } from '@/components';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  // Google Play Store SVG Icon
  const GooglePlayIcon = () => (
    <svg viewBox="0 0 135 40" className={styles.appBadgeSvg}>
      <defs>
        <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f9fe8" />
          <stop offset="100%" stopColor="#4285f4" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="135" height="40" rx="5" fill="white" stroke="#ddd" strokeWidth="1" />
      
      {/* Google Play Logo */}
      <g transform="translate(8, 8)">
        <path d="M6 0L0 6V18L6 24L12 18V6Z" fill="url(#playGradient)" />
        <path d="M0 6L6 12L12 6Z" fill="#ea4335" />
        <path d="M0 18L6 12L12 18Z" fill="#34a853" />
      </g>
      
      {/* Text */}
      <text x="28" y="12" fontSize="8" fontWeight="600" fill="#1f2937">Get it on</text>
      <text x="28" y="25" fontSize="13" fontWeight="700" fill="#1f2937">Google Play</text>
    </svg>
  );

  // Apple App Store SVG Icon
  const AppStoreIcon = () => (
    <svg viewBox="0 0 135 40" className={styles.appBadgeSvg}>
      <defs>
        <linearGradient id="appleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="100%" stopColor="#222" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="135" height="40" rx="5" fill="white" stroke="#ddd" strokeWidth="1" />
      
      {/* Apple Logo */}
      <g transform="translate(8, 6)">
        <path
          d="M14 0c-1.5 0-2.8.5-3.8 1.4-1 .9-1.5 2-1.5 3.3 0 1.3.5 2.4 1.5 3.3 1 .9 2.3 1.4 3.8 1.4 1.5 0 2.8-.5 3.8-1.4 1-.9 1.5-2 1.5-3.3 0-1.3-.5-2.4-1.5-3.3C16.8.5 15.5 0 14 0z"
          fill="url(#appleGradient)"
        />
        <circle cx="3" cy="8" r="2.5" fill="url(#appleGradient)" />
      </g>
      
      {/* Text */}
      <text x="28" y="12" fontSize="8" fontWeight="600" fill="#1f2937">Download on the</text>
      <text x="28" y="25" fontSize="13" fontWeight="700" fill="#1f2937">App Store</text>
    </svg>
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          {/* Newsletter Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              📬 Stay Connected
            </h3>
            <p className={styles.sectionSubtitle}>Sign up to our newsletter</p>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              I'm interested in
            </p>

            <div className={styles.newsletterCheckboxes}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span>News & Updates</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span>Sermons & Content</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span>Events & Activities</span>
              </label>
            </div>

            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <Input
                aria-label="Email address"
                placeholder="Enter your email"
                type="email"
                className={styles.newsletterInput}
              />
              <Button type="submit" variant="primary" size="sm">
                Subscribe Now
              </Button>
            </form>

            <p className={styles.footerCredit}>Light World Mission © {year}</p>
          </div>

          {/* App Store Section */}
          <div className={styles.appStoreSection}>
            <div className={styles.appBadgesContainer}>
              <a href="#" className={styles.appBadge} title="Download from Google Play Store">
                <GooglePlayIcon />
              </a>
              <a href="#" className={styles.appBadge} title="Download from App Store">
                <AppStoreIcon />
              </a>
            </div>

            <div className={styles.benefitsText}>
              <p className={styles.benefitsHighlight}>Exclusive App Benefits</p>
              <p className={styles.benefitsSubtext}>
                Get the full Light World Mission experience with our mobile app
              </p>
              <div className={styles.benefitsList}>
                <div className={styles.benefitItem}>Instant notifications for new content</div>
                <div className={styles.benefitItem}>Offline access to sermons</div>
                <div className={styles.benefitItem}>Better user experience</div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className={styles.section}>
            <div className={styles.linksSection}>
              <div className={styles.linkColumn}>
                <h5>Connect</h5>
                <ul>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">YouTube</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                </ul>
              </div>

              <div className={styles.linkColumn}>
                <h5>Resources</h5>
                <ul>
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/privacy">Privacy Policy</Link></li>
                  <li><Link href="/terms">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div className={styles.copyright}>
              © {year} Light World Mission. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;