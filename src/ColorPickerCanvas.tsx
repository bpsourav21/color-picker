import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Color } from './Color';
import { throttle } from './helpers';
import { ColorPickerCanvasProps } from './types';

const ColorPickerCanvas: React.FC<ColorPickerCanvasProps> = ({ width, height, hsv, onSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const pointerRef = useRef<{ x: number; y: number }>({
    x: hsv.s * width,
    y: (1 - hsv.v) * height,
  });

  const spectrumCanvas = useMemo(() => {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return null;

    const imageData = offCtx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      const v = 1 - y / height;
      for (let x = 0; x < width; x++) {
        const s = x / width;
        const { r, g, b } = Color.fromHsv({ h: hsv.h, s, v }).rgb;
        const idx = (y * width + x) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    offCtx.putImageData(imageData, 0, 0);
    return offCanvas;
  }, [hsv.h, width, height]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !spectrumCanvas) return;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(spectrumCanvas, 0, 0);
  }, [spectrumCanvas, width, height]);

  const drawPointer = useCallback(() => {
    const canvas = pointerCanvasRef.current;
    const pointer = pointerRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [width, height]);

  const throttledDrawCanvas = useMemo(() => throttle(drawCanvas, 20), [drawCanvas]);
  const throttledDrawPointer = useMemo(() => throttle(drawPointer, 20), [drawPointer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext('2d');
    throttledDrawCanvas();
  }, [throttledDrawCanvas]);

  useEffect(() => {
    pointerRef.current = {
      x: hsv.s * width,
      y: (1 - hsv.v) * height,
    };
    throttledDrawPointer();
  }, [hsv.s, hsv.v, width, height, throttledDrawPointer]);

  const handlePick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, height));

      const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
      onSelect({ r, g, b });
    },
    [height, width, throttledDrawPointer, onSelect]
  );

  return (
    <div style={{ position: 'relative', width, height, border: '1px solid #d6d6d6' }}>
      <canvas
        data-test-section="spectrum-canvas"
        ref={canvasRef}
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      />
      <canvas
        data-test-section="pointer-canvas"
        ref={pointerCanvasRef}
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none' }}
      />
      <canvas
        data-test-section="data-picker-canvas"
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 3, cursor: 'crosshair' }}
        onClick={handlePick}
        onMouseMove={(e) => e.buttons === 1 && handlePick(e)}
      />
    </div>
  );
};

export default ColorPickerCanvas;
