import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import AlphaSlider from './AlphaSlider';

describe('AlphaSlider', () => {
  const mockOnChange = jest.fn();

  it('renders the canvas element with correct dimensions', async () => {
    await act(async () => {
      render(<AlphaSlider width={200} alpha={0.5} onChange={mockOnChange} />);
    });
    const canvas = screen.getByTestId('alpha-slider-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('width', '200');
    expect(canvas).toHaveAttribute('height', '10');
  });

  it('calls onChange with correct alpha value on click', async () => {
    await act(async () => {
      render(<AlphaSlider width={200} alpha={0.5} onChange={mockOnChange} />);
    });
    const canvas = screen.getByTestId('alpha-slider-canvas');
    fireEvent.click(canvas, { clientX: 100, clientY: 5 }); // Simulate click at the middle of the canvas
    expect(mockOnChange).toHaveBeenCalledWith(0.5);
  });

  it('handles mouse drag to update alpha value', async () => {
    await act(async () => {
      render(<AlphaSlider width={200} alpha={0.5} onChange={mockOnChange} />);
    });
    const canvas = screen.getByTestId('alpha-slider-canvas');
    fireEvent.mouseDown(canvas, { clientX: 50, clientY: 5 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 5 });
    fireEvent.mouseUp(canvas);
    expect(mockOnChange).toHaveBeenCalledWith(0.25); // Drag start
    expect(mockOnChange).toHaveBeenCalledWith(0.75); // Drag end
  });

  it('does not throw error when canvas context is unavailable', () => {
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    expect(() => {
      render(<AlphaSlider width={200} alpha={0.5} onChange={mockOnChange} />);
    }).not.toThrow();

    // Restore the original implementation after the test
    jest.restoreAllMocks();
  });

  it('renders correctly with alpha value at 0', async () => {
    await act(async () => {
      render(<AlphaSlider width={200} alpha={0} onChange={mockOnChange} />);
    });
    const canvas = screen.getByTestId('alpha-slider-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders correctly with alpha value at 1', async () => {
    await act(async () => {
      render(<AlphaSlider width={200} alpha={1} onChange={mockOnChange} />);
    });
    const canvas = screen.getByTestId('alpha-slider-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('handles rapid mouse movements during drag', async () => {
    await act(async () => {
      render(<AlphaSlider width={200} alpha={0.5} onChange={mockOnChange} />);
    });
    const canvas = screen.getByTestId('alpha-slider-canvas');
    fireEvent.mouseDown(canvas, { clientX: 50, clientY: 5 });
    fireEvent.mouseMove(canvas, { clientX: 100, clientY: 5 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 5 });
    fireEvent.mouseUp(canvas);
    expect(mockOnChange).toHaveBeenCalledWith(0.25); // Drag start
    expect(mockOnChange).toHaveBeenCalledWith(0.5); // Mid drag
    expect(mockOnChange).toHaveBeenCalledWith(0.75); // Drag end
  });

  it('does not call onChange when mouse leaves canvas during drag', async () => {
    await act(async () => {
      render(<AlphaSlider width={200} alpha={0.5} onChange={mockOnChange} />);
    });
    const canvas = screen.getByTestId('alpha-slider-canvas');
    fireEvent.mouseDown(canvas, { clientX: 50, clientY: 5 });
    fireEvent.mouseLeave(canvas);
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 5 });
    fireEvent.mouseUp(canvas);
    expect(mockOnChange).toHaveBeenCalledWith(0.25); // Drag start
    expect(mockOnChange).not.toHaveBeenCalledWith(0.75); // Drag end should not be called
  });

  it('renders correctly with a custom width', async () => {
    await act(async () => {
      render(<AlphaSlider width={300} alpha={0.5} onChange={mockOnChange} />);
    });
    const canvas = screen.getByTestId('alpha-slider-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('width', '300');
  });

  it('clamps alpha value to 0 when it is less than 0', async () => {
    await act(async () => {
      render(<AlphaSlider width={200} alpha={-0.5} onChange={mockOnChange} />);
    });
    const canvas = screen.getByTestId('alpha-slider-canvas');
    fireEvent.click(canvas, { clientX: 0, clientY: 5 });
    expect(mockOnChange).toHaveBeenCalledWith(0);
    expect(mockOnChange.mock.calls[0][0]).toBeGreaterThanOrEqual(0);
  });

  it('clamps alpha value to 1 when it is greater than 1', async () => {
    await act(async () => {
      render(<AlphaSlider width={200} alpha={1.5} onChange={mockOnChange} />);
    });
    const canvas = screen.getByTestId('alpha-slider-canvas');
    fireEvent.click(canvas, { clientX: 200, clientY: 5 });
    expect(mockOnChange).toHaveBeenCalledWith(1);
    expect(mockOnChange.mock.calls[0][0]).toBeLessThanOrEqual(1);
  });
});
