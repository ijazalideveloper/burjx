'use client';

import React from 'react';
import styles from './Sparkline.module.css';

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
}

// Create a separate interface for the fallback component to make height required
interface SparklineFallbackProps {
  data: number[];
  color: string;
  height: number; // Make height required here
}

export default function Sparkline({ data, color, height = 60 }: SparklineProps) {
  // If recharts isn't available or data is empty, show a fallback
  if (!data || data.length === 0) {
    return (
      <div
        className={styles.fallback}
        style={{
          height: `${height}px`,
          background: `linear-gradient(to right, ${color}10, ${color}30)`
        }}
      />
    );
  }

  try {
    // Create a simple canvas-based sparkline
    return (
      <div
        className={styles.container}
        style={{ height: `${height}px` }}
      >
        <SparklineFallback data={data} color={color} height={height} />
      </div>
    );
  } catch (error) {
    console.error('Error rendering sparkline:', error);
    return (
      <div
        className={styles.fallback}
        style={{
          height: `${height}px`,
          background: `linear-gradient(to right, ${color}10, ${color}30)`
        }}
      />
    );
  }
}

// Fallback canvas-based sparkline if recharts has issues
function SparklineFallback({ data, color, height }: SparklineFallbackProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set line style
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    
    // Find min and max values for scaling
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const valueRange = maxValue - minValue;
    
    // Draw line
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * canvas.width;
      
      // Scale the y value to the canvas height, leaving some padding
      const padding = height * 0.1;
      let y = height - padding;
      
      if (valueRange > 0) {
        const normalizedValue = (value - minValue) / valueRange;
        y = height - (normalizedValue * (height - padding * 2) + padding);
      }
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  }, [data, color, height]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={200} 
      height={height} 
      className={styles.canvas}
    />
  );
}