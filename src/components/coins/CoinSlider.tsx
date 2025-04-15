"use client";

import { useRef, useState, useEffect } from 'react';
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
  const [scrollPosition, setScrollPosition] = useState(0);

  // Function to check if arrows should be shown
  const updateArrows = () => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setScrollPosition(scrollLeft);
    setShowLeftArrow(scrollLeft > 10); // Show left arrow if scrolled right
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10); // Show right arrow if more content to the right
  };

  // Update arrows on initial render, resize, and when coins change
  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    
    return () => {
      window.removeEventListener('resize', updateArrows);
    };
  }, [coins]);

  // Handle scroll events
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updateArrows);
      return () => slider.removeEventListener('scroll', updateArrows);
    }
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    if (!sliderRef.current) return;
    
    const container = sliderRef.current;
    const scrollAmount = 300; // Scroll by 300px or one card width
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;
    
    const container = sliderRef.current;
    const scrollAmount = 300; // Scroll by 300px or one card width
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  if (coins.length === 0 && !loading) {
    return <div className={styles.noData}>No cryptocurrencies available</div>;
  }

  return (
    <div className={styles.sliderContainer}>
      {/* Left Navigation Arrow */}
      {showLeftArrow && (
        <button 
          onClick={scrollLeft}
          className={`${styles.navButton} ${styles.leftButton}`}
          aria-label="Scroll left"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      
      {/* Slider Content */}
      <div 
        ref={sliderRef}
        className={styles.slider}
        data-testid="coin-slider"
      >
        {coins.map((coin) => (
          <div key={coin.id} className={styles.slide}>
            <CoinCard coin={coin} />
          </div>
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className={styles.loaderSlide}>
            <div className={styles.loader}></div>
          </div>
        )}
      </div>
      
      {/* Right Navigation Arrow */}
      {showRightArrow && (
        <button 
          onClick={scrollRight}
          className={`${styles.navButton} ${styles.rightButton}`}
          aria-label="Scroll right"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}