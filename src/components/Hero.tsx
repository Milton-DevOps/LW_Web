'use client';

import React from 'react';
import './Hero.css';

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaLink,
  onCtaClick,
}) => {
  return (
    <div
      className={`hero-container ${backgroundImage ? 'hero-background' : 'bg-gray-900'}`}
    >
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      {backgroundImage && (
        <div className="hero-overlay" />
      )}
      
      <div className="hero-content">
        <h1 className="hero-title">
          {title}
        </h1>
        
        {subtitle && (
          <p className="hero-subtitle">
            {subtitle}
          </p>
        )}
        
        {ctaText && (
          <a
            href={ctaLink || '#'}
            onClick={(e) => {
              if (onCtaClick) {
                e.preventDefault();
                onCtaClick();
              }
            }}
            className="hero-cta"
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
};