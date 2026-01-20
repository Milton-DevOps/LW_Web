'use client';

import React, { useState, useRef, useEffect } from 'react';
import { colors } from '@/constants/colors';

interface CarouselItem {
  id: string | number;
  image: string;
  title: string;
  description?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({
  items = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(nextSlide, autoPlayInterval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, autoPlay, autoPlayInterval]);

  if (items.length === 0) {
    return <div className="w-full h-96 bg-gray-300 flex items-center justify-center text-gray-600 font-medium">No items to display</div>;
  }

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Main Carousel Container */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] bg-gray-300">
        {/* Slides */}
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`
              absolute inset-0 w-full h-full
              transition-opacity duration-500 ease-in-out
              ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            `}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 leading-tight drop-shadow-lg">
                {item.title}
              </h2>
              {item.description && (
                <p className="text-sm sm:text-lg md:text-xl text-gray-100 max-w-3xl leading-relaxed drop-shadow-md">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls - Responsive */}
      {showControls && items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="
              hidden sm:flex
              absolute
              left-4 sm:left-6 lg:left-8
              top-1/2
              -translate-y-1/2
              z-30
              p-2 sm:p-3
              bg-white/20
              hover:bg-white/40
              backdrop-blur-sm
              text-white
              transition-all
              duration-200
              items-center
              justify-center
            "
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="
              hidden sm:flex
              absolute
              right-4 sm:right-6 lg:right-8
              top-1/2
              -translate-y-1/2
              z-30
              p-2 sm:p-3
              bg-white/20
              hover:bg-white/40
              backdrop-blur-sm
              text-white
              transition-all
              duration-200
              items-center
              justify-center
            "
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                transition-all duration-300 rounded-full
                ${index === currentIndex 
                  ? 'bg-[#cb4154] w-8 sm:w-10 h-2 sm:h-3' 
                  : 'bg-white/50 hover:bg-white/80 w-2 sm:w-3 h-2 sm:h-3'}
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
