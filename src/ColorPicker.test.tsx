import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ColorPicker from './ColorPicker';

describe('ColorPicker Component', () => {
  const mockOnColorChange = jest.fn();

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
      createPattern: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
    };

    // @ts-ignore - override getContext just for tests
    HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCtx);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(
      <ColorPicker value="#ff0000" onColorChange={mockOnColorChange} />
    );
    expect(getByTestId('color-picker')).toBeInTheDocument();
  });

  it('toggles the color picker dropdown on click', () => {
    const { getByTestId } = render(
      <ColorPicker value="#ff0000" onColorChange={mockOnColorChange} />
    );
    const preview = getByTestId('color-picker-preview');
    fireEvent.click(preview);
    expect(getByTestId('color-picker-dropdown')).toHaveStyle('display: block');
    fireEvent.click(preview);
    expect(getByTestId('color-picker-dropdown')).toHaveStyle('display: none');
  });

  it('displays the correct initial color', () => {
    const { getByTestId } = render(
      <ColorPicker value="#00ff00" onColorChange={mockOnColorChange} />
    );
    const preview = getByTestId('color-picker-preview');
    expect(preview).toHaveStyle('background-color: rgb(0, 255, 0)');
  });

  it('updates the color when props.value changes', () => {
    const { rerender, getByTestId } = render(
      <ColorPicker value="#0000ff" onColorChange={mockOnColorChange} />
    );
    const preview = getByTestId('color-picker-preview');
    expect(preview).toHaveStyle('background-color: rgb(0, 0, 255)');

    rerender(<ColorPicker value="#ffff00" onColorChange={mockOnColorChange} />);
    expect(preview).toHaveStyle('background-color: rgb(255, 255, 0)');
  });

  it('renders the copy button when showCopyButton is true', () => {
    const { getByLabelText } = render(
      <ColorPicker value="#ff0000" onColorChange={mockOnColorChange} showCopyButton={true} />
    );
    expect(getByLabelText('Copy RGBA value')).toBeInTheDocument();
    expect(getByLabelText('Copy HEX value')).toBeInTheDocument();
  });

  it('calls onColorChange when the spectrum slider is used', async () => {
    const { getByTestId } = render(
      <ColorPicker value="#ff0000" onColorChange={mockOnColorChange} />
    );
    const preview = getByTestId('color-picker-preview');
    fireEvent.click(preview);

    const spectrumSlider = getByTestId('mouse-event-slider');
    fireEvent.mouseDown(spectrumSlider, { clientX: 50 });
    fireEvent.mouseUp(spectrumSlider);

    await waitFor(() => {
      expect(mockOnColorChange).toHaveBeenCalled();
    });
  });

  it('calls onColorChange when the alpha slider is used', async () => {
    const { getByTestId } = render(
      <ColorPicker value="#ff0000" onColorChange={mockOnColorChange} />
    );
    const preview = getByTestId('color-picker-preview');
    fireEvent.click(preview);

    const alphaSlider = getByTestId('alpha-slider-canvas');
    fireEvent.mouseDown(alphaSlider, { clientX: 50 });
    fireEvent.mouseUp(alphaSlider);

    await waitFor(() => {
      expect(mockOnColorChange).toHaveBeenCalled();
    });
  });

  it('closes the dropdown when clicking outside', () => {
    const { getByTestId } = render(
      <ColorPicker value="#ff0000" onColorChange={mockOnColorChange} />
    );
    const preview = getByTestId('color-picker-preview');
    fireEvent.click(preview);
    expect(getByTestId('color-picker-dropdown')).toHaveStyle('display: block');

    fireEvent.mouseDown(document);
    expect(getByTestId('color-picker-dropdown')).toHaveStyle('display: none');
  });

  it('does not close the dropdown when clicking inside', () => {
    const { getByTestId } = render(
      <ColorPicker value="#ff0000" onColorChange={mockOnColorChange} />
    );
    const preview = getByTestId('color-picker-preview');
    fireEvent.click(preview);
    expect(getByTestId('color-picker-dropdown')).toHaveStyle('display: block');

    const dropdown = getByTestId('color-picker-dropdown');
    fireEvent.mouseDown(dropdown);
    expect(getByTestId('color-picker-dropdown')).toHaveStyle('display: block');
  });
});
