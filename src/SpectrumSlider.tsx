import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Color } from './Color';
import { SpectrumSliderProps } from './types';

// Canvas dimensions
const height = 16;

export const SpectrumSlider: React.FC<SpectrumSliderProps> = ({ width, onColorSelect, hsv }) => {
  const gradientCanvasRef = useRef<HTMLCanvasElement>(null);
  const pointerCanvasRef = useRef<HTMLCanvasElement>(null);
  const lastPointerXRef = useRef<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  // Draw the hue gradient once
  useEffect(() => {
    const canvas = gradientCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0.0, '#ff0000'); // Red (0°)
    gradient.addColorStop(1 / 6, '#ffff00'); // Yellow (60°)
    gradient.addColorStop(2 / 6, '#00ff00'); // Green (120°)
    gradient.addColorStop(3 / 6, '#00ffff'); // Cyan (180°)
    gradient.addColorStop(4 / 6, '#0000ff'); // Blue (240°)
    gradient.addColorStop(5 / 6, '#ff00ff'); // Magenta (300°)
    gradient.addColorStop(1.0, '#ff0000'); // Red again (360°)

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, [width]);

  // Draw the hue selector pointer
  const drawPointer = useCallback(
    (x: number) => {
      const canvas = pointerCanvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.arc(x, height / 2, 6, 0, 2 * Math.PI);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
    },
    [width]
  );

  // On HSV change, reposition pointer
  useEffect(() => {
    if (lastPointerXRef.current !== hsv.h) {
      const x = (hsv.h / 360) * width;
      drawPointer(x);
      lastPointerXRef.current = hsv.h;
    }
  }, [hsv, width, drawPointer]);

  const handleSelect = useCallback(
    (clientX: number) => {
      const ctx = gradientCanvasRef.current?.getContext('2d');
      const rect = gradientCanvasRef.current?.getBoundingClientRect();
      if (!rect || !ctx) return;

      const x = Math.max(0, Math.min(clientX - rect.left, width));
      const hue = (x / width) * 360;
      const rgb = Color.fromHsv({ h: hue, s: 1, v: 1 }).rgb;
      onColorSelect(rgb);
    },
    [width, drawPointer, onColorSelect]
  );

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
      }}
    >
      <canvas
        data-test-section="hue-slider-canvas"
        ref={gradientCanvasRef}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />
      <canvas
        data-test-section="pointer-slider-canvas"
        ref={pointerCanvasRef}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        data-test-section="mouse-event-slider"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height,
          zIndex: 2,
          cursor: 'pointer',
        }}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleSelect(e.clientX);
        }}
        onMouseMove={(e) => {
          if (isDragging) handleSelect(e.clientX);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      />
    </div>
  );
};

export default SpectrumSlider;
