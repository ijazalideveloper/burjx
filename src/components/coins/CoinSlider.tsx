'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Coin } from '@/lib/types';
import CoinCard from './CoinCard';
import styles from './CoinSlider.module.css';

interface CoinSliderProps {
  coins: Coin[];
  loading: boolean;
}

export default function CoinSlider({ coins, loading }: CoinSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Handle scroll position to determine which arrows to show
  const updateArrows = useCallback(() => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10); // -10 for buffer
  }, []);

  // Update arrows on initial render and resize
  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [updateArrows]);

  // Add scroll event listener
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updateArrows, { passive: true });
      return () => slider.removeEventListener('scroll', updateArrows);
    }
  }, [updateArrows]);

  // Update arrows when coins change
  useEffect(() => {
    updateArrows();
  }, [coins, updateArrows]);

  // Scroll functions
  const scrollLeft = () => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const cardWidth = container.querySelector('div')?.clientWidth || 260;
      container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const cardWidth = container.querySelector('div')?.clientWidth || 260;
      container.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.sliderContainer}>
      {/* Left Arrow */}
      {showLeftArrow && (
        <button 
          onClick={scrollLeft}
          className={styles.arrowButton + ' ' + styles.leftArrow}
          aria-label="Scroll left"
        >
          <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {/* Right Arrow */}
      {showRightArrow && (
        <button 
          onClick={scrollRight}
          className={styles.arrowButton + ' ' + styles.rightArrow}
          aria-label="Scroll right"
        >
          <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      
      {/* Scrollable Container */}
      <div 
        ref={sliderRef}
        className={styles.scrollContainer}
      >
        <div className={styles.cardsContainer}>
          {coins.map((coin) => (
            <div key={coin.id} className={styles.cardWrapper}>
              <CoinCard coin={coin} />
            </div>
          ))}
          
          {loading && (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}