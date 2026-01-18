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
    return <div className="w-full h-96 bg-gray-200 flex items-center justify-center">No items to display</div>;
  }

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Main Carousel Container */}
      <div className="relative w-full h-[80vh] bg-gray-200">
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
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
                {item.title}
              </h2>
              {item.description && (
                <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      {showControls && (
        <>
          <button
            onClick={prevSlide}
            className="
              absolute
              left-4 sm:left-6
              top-1/2
              -translate-y-1/2
              z-30
              p-2 sm:p-3
              bg-white/20
              hover:bg-white/40
              text-white
              text-xl sm:text-2xl
              transition-colors
              duration-200
            "
            aria-label="Previous slide"
          >
            &#10094;
          </button>

          <button
            onClick={nextSlide}
            className="
              absolute
              right-4 sm:right-6
              top-1/2
              -translate-y-1/2
              z-30
              p-2 sm:p-3
              bg-white/20
              hover:bg-white/40
              text-white
              text-xl sm:text-2xl
              transition-colors
              duration-200
            "
            aria-label="Next slide"
          >
            &#10095;
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-2 sm:w-3 h-2 sm:h-3
                transition-all duration-300
                ${index === currentIndex ? 'bg-[#cb4154] w-8 sm:w-10' : 'bg-white/50 hover:bg-white/80'}
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
