import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { AlphaSliderProps } from './types';

const height = 10;

const AlphaSlider: React.FC<AlphaSliderProps> = ({ width, alpha, onChange }) => {
  const baseAlpha = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const checkerboardPattern = useMemo(() => {
    const checkerSize = 8;
    if (!document) return null;
    // Create an offscreen canvas for the checkerboard pattern
    const offscreen = document.createElement('canvas');
    offscreen.width = checkerSize * 2;
    offscreen.height = checkerSize * 2;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, checkerSize, checkerSize);
    ctx.fillRect(checkerSize, checkerSize, checkerSize, checkerSize);
    ctx.fillStyle = '#fff';
    ctx.fillRect(checkerSize, 0, checkerSize, checkerSize);
    ctx.fillRect(0, checkerSize, checkerSize, checkerSize);

    return ctx.createPattern(offscreen, 'repeat');
  }, []);

  const drawSlider = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !checkerboardPattern) return;

    // Background pattern
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = checkerboardPattern;
    ctx.fillRect(0, 0, width, height);

    // Alpha gradient: transparent → solid black
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Pointer
    const pointerX = baseAlpha * width;
    ctx.beginPath();
    ctx.arc(pointerX, height / 2, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [baseAlpha, checkerboardPattern, width, height]);

  useEffect(() => {
    drawSlider();
  }, [drawSlider]);

  const handleChange = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, width));
      const newAlpha = +(x / width).toFixed(2);
      onChange(newAlpha);
    },
    [width]
  );

  return (
    <canvas
      data-test-section="alpha-slider-canvas"
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        cursor: 'pointer',
        border: '1px solid #d6d6d6',
        borderRadius: 4,
        display: 'block',
      }}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleChange(e);
      }}
      onMouseMove={(e) => {
        if (isDragging) handleChange(e);
      }}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onClick={handleChange}
    />
  );
};

export default AlphaSlider;
