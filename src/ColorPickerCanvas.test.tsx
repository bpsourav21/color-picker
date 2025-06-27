import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ColorPickerCanvas from './ColorPickerCanvas';

describe('ColorPickerCanvas', () => {
  const mockOnSelect = jest.fn();
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
      createImageData: jest.fn(() => ({
        data: new Uint8ClampedArray(300 * 150 * 4), // Mock image data for a 300x150 canvas
      })),
      putImageData: jest.fn(() => ({
        data: new Uint8ClampedArray(300 * 150 * 4), // Mock image data for a 300x150 canvas
      })),
    };

    // @ts-ignore - override getContext just for tests
    HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCtx);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    width: 300,
    height: 150,
    hsv: { h: 0, s: 0.5, v: 0.5 },
    onSelect: mockOnSelect,
  };

  it('renders without crashing', () => {
    const { getByTestId } = render(<ColorPickerCanvas {...defaultProps} />);
    expect(getByTestId('spectrum-canvas')).toBeInTheDocument();
    expect(getByTestId('pointer-canvas')).toBeInTheDocument();
    expect(getByTestId('data-picker-canvas')).toBeInTheDocument();
  });

  it('creates an offscreen canvas for spectrum generation', () => {
    const { getByTestId } = render(<ColorPickerCanvas {...defaultProps} />);
    const spectrumCanvas = getByTestId('spectrum-canvas') as HTMLCanvasElement;

    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
    expect(spectrumCanvas).toBeInTheDocument();
  });

  it('draws the spectrum on the canvas', () => {
    render(<ColorPickerCanvas {...defaultProps} />);
    const mockCtx = HTMLCanvasElement.prototype.getContext(
      '2d'
    ) as jest.Mocked<CanvasRenderingContext2D>;

    expect(mockCtx.clearRect).toHaveBeenCalled();
    expect(mockCtx.drawImage).toHaveBeenCalled();
  });

  it('draws the pointer on the pointer canvas', () => {
    render(<ColorPickerCanvas {...defaultProps} />);
    const mockCtx = HTMLCanvasElement.prototype.getContext(
      '2d'
    ) as jest.Mocked<CanvasRenderingContext2D>;

    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalledWith(150, 75, 6, 0, 2 * Math.PI);
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('calls onSelect with correct color when clicked', () => {
    const { getByTestId } = render(<ColorPickerCanvas {...defaultProps} />);
    const dataPickerCanvas = getByTestId('data-picker-canvas') as HTMLCanvasElement;

    fireEvent.click(dataPickerCanvas, { clientX: 50, clientY: 50 });

    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
    expect(mockOnSelect).toHaveBeenCalledWith({ r: 10, g: 20, b: 30 });
  });

  it('caches the spectrum canvas for given hue, width, and height', () => {
    const { getByTestId } = render(<ColorPickerCanvas {...defaultProps} />);
    const spectrumCanvas = getByTestId('spectrum-canvas') as HTMLCanvasElement;

    const mockCtx = HTMLCanvasElement.prototype.getContext(
      '2d'
    ) as jest.Mocked<CanvasRenderingContext2D>;

    expect(mockCtx.createImageData).toHaveBeenCalledWith(300, 150);
    expect(mockCtx.putImageData).toHaveBeenCalled();
    expect(spectrumCanvas).toBeInTheDocument();
  });
  it('updates pointer position when hsv changes', async () => {
    const { rerender } = render(<ColorPickerCanvas {...defaultProps} />);
    const mockCtx = HTMLCanvasElement.prototype.getContext(
      '2d'
    ) as jest.Mocked<CanvasRenderingContext2D>;

    await act(() => {
      rerender(<ColorPickerCanvas {...defaultProps} hsv={{ h: 0, s: 0.8, v: 0.2 }} />);
    });

    await waitFor(() => {
      expect(mockCtx.clearRect).toHaveBeenCalled();
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.arc).toHaveBeenCalledWith(240, 120, 6, 0, 2 * Math.PI);
      expect(mockCtx.stroke).toHaveBeenCalled();
    });
  });

  it('handles mouse move to pick color while dragging', () => {
    const { getByTestId } = render(<ColorPickerCanvas {...defaultProps} />);
    const dataPickerCanvas = getByTestId('data-picker-canvas') as HTMLCanvasElement;

    fireEvent.mouseMove(dataPickerCanvas, { buttons: 1, clientX: 100, clientY: 100 });

    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
    expect(mockOnSelect).toHaveBeenCalledWith({ r: 10, g: 20, b: 30 });
  });

  it('does not pick color on mouse move without dragging', () => {
    const { getByTestId } = render(<ColorPickerCanvas {...defaultProps} />);
    const dataPickerCanvas = getByTestId('data-picker-canvas') as HTMLCanvasElement;

    fireEvent.mouseMove(dataPickerCanvas, { buttons: 0, clientX: 100, clientY: 100 });

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('ensures pointer position is clamped within canvas bounds', () => {
    const { getByTestId } = render(<ColorPickerCanvas {...defaultProps} />);
    const dataPickerCanvas = getByTestId('data-picker-canvas') as HTMLCanvasElement;

    fireEvent.click(dataPickerCanvas, { clientX: -10, clientY: -10 });

    expect(mockOnSelect).toHaveBeenCalledWith({ r: 10, g: 20, b: 30 });

    fireEvent.click(dataPickerCanvas, { clientX: 310, clientY: 160 });

    expect(mockOnSelect).toHaveBeenCalledWith({ r: 10, g: 20, b: 30 });
  });

  it('redraws the pointer when pointer position changes', async () => {
    const { rerender } = render(<ColorPickerCanvas {...defaultProps} />);

    const mockCtx = HTMLCanvasElement.prototype.getContext(
      '2d'
    ) as jest.Mocked<CanvasRenderingContext2D>;

    await act(async () => {
      rerender(<ColorPickerCanvas {...defaultProps} hsv={{ h: 0, s: 0.7, v: 0.3 }} />);
    });

    await waitFor(() => {
      expect(mockCtx.clearRect).toHaveBeenCalled();
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.arc).toHaveBeenCalledWith(210, 105, 6, 0, 2 * Math.PI);
      expect(mockCtx.stroke).toHaveBeenCalled();
    });
  });

  it('does not call onColorSelect when dragging outside the canvas bounds', () => {
    const { getByTestId } = render(<ColorPickerCanvas {...defaultProps} />);
    const canvas = getByTestId('data-picker-canvas');

    fireEvent.mouseDown(canvas, { clientX: -10 }); // Outside left
    fireEvent.mouseMove(canvas, { clientX: defaultProps.width + 10 }); // Outside right
    fireEvent.mouseUp(canvas);

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('updates the pointer position when hsv prop changes', async () => {
    const { rerender } = render(<ColorPickerCanvas {...defaultProps} />);

    const pointerCanvas = screen.getByTestId('pointer-canvas') as HTMLCanvasElement;
    const ctx = pointerCanvas.getContext('2d') as CanvasRenderingContext2D;

    // Spy on context methods
    const clearSpy = jest.spyOn(ctx, 'clearRect');
    const beginSpy = jest.spyOn(ctx, 'beginPath');
    const arcSpy = jest.spyOn(ctx, 'arc');
    const strokeSpy = jest.spyOn(ctx, 'stroke');

    const newHSV = { h: 0, s: 0.75, v: 0.25 };

    // Act to flush the rerender and effects
    await act(() => {
      rerender(<ColorPickerCanvas {...defaultProps} hsv={newHSV} />);
    });

    await waitFor(() => {
      const expectedX = newHSV.s * defaultProps.width; // 225
      const expectedY = (1 - newHSV.v) * defaultProps.height; // 112.5

      expect(clearSpy).toHaveBeenCalled();
      expect(beginSpy).toHaveBeenCalled();
      expect(arcSpy).toHaveBeenCalledWith(expectedX, expectedY, 6, 0, 2 * Math.PI);
      expect(strokeSpy).toHaveBeenCalled();
    });
  });

  it('updates the spectrum canvas when hsv.h changes', () => {
    const { rerender } = render(<ColorPickerCanvas {...defaultProps} />);
    const mockCtx = HTMLCanvasElement.prototype.getContext(
      '2d'
    ) as jest.Mocked<CanvasRenderingContext2D>;

    rerender(<ColorPickerCanvas {...defaultProps} hsv={{ h: 180, s: 0.5, v: 0.5 }} />);

    expect(mockCtx.clearRect).toHaveBeenCalled();
    expect(mockCtx.drawImage).toHaveBeenCalled();
  });

  it('updates both spectrum and pointer when hsv.h changes', () => {
    const { rerender } = render(<ColorPickerCanvas {...defaultProps} />);
    const mockCtx = HTMLCanvasElement.prototype.getContext(
      '2d'
    ) as jest.Mocked<CanvasRenderingContext2D>;

    rerender(<ColorPickerCanvas {...defaultProps} hsv={{ h: 90, s: 0.8, v: 0.3 }} />);

    const expectedX = 0.8 * defaultProps.width; // hsv.s determines x position
    const expectedY = (1 - 0.3) * defaultProps.height; // hsv.v determines y position

    expect(mockCtx.clearRect).toHaveBeenCalled();
    expect(mockCtx.drawImage).toHaveBeenCalled(); // Spectrum redraw
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalledWith(expectedX, expectedY, 6, 0, 2 * Math.PI); // Pointer redraw
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('does not update pointer position if hsv.s and hsv.v remain the same', () => {
    const { rerender } = render(<ColorPickerCanvas {...defaultProps} />);
    const mockCtx = HTMLCanvasElement.prototype.getContext(
      '2d'
    ) as jest.Mocked<CanvasRenderingContext2D>;

    const defaultX = defaultProps.hsv.s * defaultProps.width; // hsv.s determines x position
    const defaultY = (1 - defaultProps.hsv.v) * defaultProps.height; // hsv.v determines y position

    expect(mockCtx.arc).toHaveBeenCalledWith(defaultX, defaultY, 6, 0, 2 * Math.PI);

    rerender(<ColorPickerCanvas {...defaultProps} hsv={{ h: 180, s: 0.5, v: 0.5 }} />);

    const expectedX = 0.5 * defaultProps.width; // hsv.s determines x position
    const expectedY = (1 - 0.5) * defaultProps.height; // hsv.v determines y position

    expect(mockCtx.arc).toHaveBeenCalledWith(expectedX, expectedY, 6, 0, 2 * Math.PI); // Pointer position unchanged
  });

  it('ensures spectrum canvas is cached for the new hue', () => {
    const { rerender } = render(<ColorPickerCanvas {...defaultProps} />);
    const mockCtx = HTMLCanvasElement.prototype.getContext(
      '2d'
    ) as jest.Mocked<CanvasRenderingContext2D>;

    rerender(<ColorPickerCanvas {...defaultProps} hsv={{ h: 270, s: 0.5, v: 0.5 }} />);

    expect(mockCtx.createImageData).toHaveBeenCalledWith(300, 150);
    expect(mockCtx.putImageData).toHaveBeenCalled();
  });
});
