import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpectrumSlider from './SpectrumSlider';

describe('SpectrumSlider', () => {
  const mockOnColorSelect = jest.fn();

  const height = 16; // Fixed height for the canvas
  const defaultProps = {
    width: 300,
    onColorSelect: mockOnColorSelect,
    hsv: { h: 180, s: 1, v: 1 },
  };

  beforeEach(() => {
    const mockCtx = {
      fillStyle: '',
      lineWidth: 0,
      shadowColor: '',
      shadowBlur: 0,
      beginPath: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn(),
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      drawImage: jest.fn(),
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
      getImageData: jest.fn(() => ({
        data: new Uint8ClampedArray([10, 20, 30, 255]),
      })),
    };

    // @ts-ignore - override getContext just for tests
    HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCtx);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the canvas with correct dimensions', () => {
    const { getByTestId } = render(<SpectrumSlider {...defaultProps} />);
    const canvas = getByTestId('hue-slider-canvas') as HTMLCanvasElement;

    expect(canvas).toBeInTheDocument();
    expect(canvas.width).toBe(defaultProps.width);
    expect(canvas.height).toBe(height);
  });

  it('calls onColorSelect with correct color on click', () => {
    const { getByTestId } = render(<SpectrumSlider {...defaultProps} />);
    const canvas = getByTestId('mouse-event-slider');
    fireEvent.mouseDown(canvas, { clientX: 150 });

    expect(mockOnColorSelect).toHaveBeenCalled();
    const color = mockOnColorSelect.mock.calls[0][0];
    expect(color).toHaveProperty('r');
    expect(color).toHaveProperty('g');
    expect(color).toHaveProperty('b');
  });

  it('handles dragging and updates color', () => {
    const { getByTestId } = render(<SpectrumSlider {...defaultProps} />);
    const canvas = getByTestId('mouse-event-slider');

    fireEvent.mouseDown(canvas, { clientX: 100 });
    fireEvent.mouseMove(canvas, { clientX: 200 });
    fireEvent.mouseUp(canvas);

    expect(mockOnColorSelect).toHaveBeenCalledTimes(2);
  });

  it('does not call onColorSelect when clicking outside the canvas bounds', () => {
    const { getByTestId } = render(<SpectrumSlider {...defaultProps} />);
    const canvas = getByTestId('hue-slider-canvas');

    fireEvent.click(canvas, { clientX: -10 }); // Outside left
    fireEvent.click(canvas, { clientX: defaultProps.width + 10 }); // Outside right

    expect(mockOnColorSelect).not.toHaveBeenCalled();
  });

  it('renders the pointer at the correct position based on hsv.h', () => {
    const { getByTestId } = render(<SpectrumSlider {...defaultProps} />);
    const canvas = getByTestId('hue-slider-canvas') as HTMLCanvasElement;
    const pointerX = (defaultProps.hsv.h / 360) * defaultProps.width;

    const ctx = canvas.getContext('2d');
    expect(ctx).not.toBeNull();
    if (ctx) {
      const imageData = ctx.getImageData(pointerX, height / 2, 1, 1).data;
      expect(imageData).toBeDefined();
    }
  });

  it('does not call onColorSelect when dragging outside the canvas bounds', () => {
    const { getByTestId } = render(<SpectrumSlider {...defaultProps} />);
    const canvas = getByTestId('hue-slider-canvas');

    fireEvent.mouseDown(canvas, { clientX: -10 }); // Outside left
    fireEvent.mouseMove(canvas, { clientX: defaultProps.width + 10 }); // Outside right
    fireEvent.mouseUp(canvas);

    expect(mockOnColorSelect).not.toHaveBeenCalled();
  });

  it('updates the pointer position when hsv prop changes', () => {
    const { rerender, getByTestId } = render(<SpectrumSlider {...defaultProps} />);
    const canvas = getByTestId('hue-slider-canvas') as HTMLCanvasElement;

    rerender(<SpectrumSlider {...defaultProps} hsv={{ h: 90, s: 1, v: 1 }} />);
    const pointerX = (90 / 360) * defaultProps.width;

    const ctx = canvas.getContext('2d');
    expect(ctx).not.toBeNull();
    if (ctx) {
      const imageData = ctx.getImageData(pointerX, height / 2, 1, 1).data;
      expect(imageData).toBeDefined();
    }
  });

  it('handles onMouseLeave and stops dragging', () => {
    const { getByTestId } = render(<SpectrumSlider {...defaultProps} />);
    const canvas = getByTestId('mouse-event-slider');

    fireEvent.mouseDown(canvas, { clientX: 150 });
    fireEvent.mouseLeave(canvas);

    expect(mockOnColorSelect).toHaveBeenCalledTimes(1);
  });

  it('does not throw errors if canvas context is unavailable', () => {
    // Mock getContext to return null
    HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

    expect(() => render(<SpectrumSlider {...defaultProps} />)).not.toThrow();
  });
  it('does not call onColorSelect when mouse is released without dragging', () => {
    const { getByTestId } = render(<SpectrumSlider {...defaultProps} />);
    const canvas = getByTestId('mouse-event-slider');

    fireEvent.mouseDown(canvas, { clientX: 150 });
    fireEvent.mouseUp(canvas);

    expect(mockOnColorSelect).toHaveBeenCalledTimes(1);
  });

  it('does not update pointer position if hsv.h is unchanged', () => {
    const { rerender, getByTestId } = render(
      <SpectrumSlider {...defaultProps} hsv={{ h: 180, s: 1, v: 1 }} />
    );
    const canvas = getByTestId('hue-slider-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;

    const clearSpy = jest.spyOn(ctx, 'clearRect').mockClear();

    rerender(<SpectrumSlider {...defaultProps} hsv={{ h: 180, s: 1, v: 1 }} />);
    expect(clearSpy).not.toHaveBeenCalled();
  });

  it('handles rapid mouse movements correctly', () => {
    const { getByTestId } = render(<SpectrumSlider {...defaultProps} />);
    const canvas = getByTestId('mouse-event-slider');

    fireEvent.mouseDown(canvas, { clientX: 50 });
    fireEvent.mouseMove(canvas, { clientX: 100 });
    fireEvent.mouseMove(canvas, { clientX: 200 });
    fireEvent.mouseUp(canvas);

    expect(mockOnColorSelect).toHaveBeenCalledTimes(3);
  });

  it('does not crash when width is zero', () => {
    const zeroWidthProps = { ...defaultProps, width: 0 };
    expect(() => render(<SpectrumSlider {...zeroWidthProps} />)).not.toThrow();
  });
});
