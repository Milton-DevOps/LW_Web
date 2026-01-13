// Responsive utility hooks and functions

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// Breakpoints
export const breakpoints = {
  mobile: '(max-width: 640px)',
  tablet: '(min-width: 641px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
  sm: '(max-width: 640px)',
  md: '(max-width: 1024px)',
  lg: '(min-width: 1025px)',
};

import React from 'react';

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 641;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= 641 && width <= 1024;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 1024;
};

// Responsive container utility
export const responsiveClass = {
  container: 'w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto',
  formContainer: 'w-full max-w-sm sm:max-w-md md:max-w-lg px-4',
  grid: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
};
