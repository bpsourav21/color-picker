import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import ColorPickerInput from './ColorPickerInput';

describe('ColorPickerInput', () => {
  it('renders the input with the correct value', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<ColorPickerInput value="#ffffff" onChange={mockOnChange} />);

    const input = getByTestId('color-picker-section-input') as HTMLInputElement;
    expect(input.value).toBe('#ffffff');
  });

  it('calls onChange when the input value changes', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<ColorPickerInput value="#ffffff" onChange={mockOnChange} />);

    const input = getByTestId('color-picker-section-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '#000000' } });

    expect(mockOnChange).toHaveBeenCalledWith('#000000');
  });

  it('applies custom styles to the input element', () => {
    const mockOnChange = jest.fn();
    const customStyle = { backgroundColor: 'lightblue' };
    const { getByTestId } = render(
      <ColorPickerInput value="#ffffff" onChange={mockOnChange} style={customStyle} />
    );

    const input = getByTestId('color-picker-section-input') as HTMLInputElement;
    expect(input).toHaveStyle('background-color: lightblue');
  });

  it('applies custom className to the input element', () => {
    const mockOnChange = jest.fn();
    const customClassName = 'custom-class';
    const { getByTestId } = render(
      <ColorPickerInput value="#ffffff" onChange={mockOnChange} className={customClassName} />
    );

    const input = getByTestId('color-picker-section-input') as HTMLInputElement;
    expect(input).toHaveClass(customClassName);
  });

  it('renders the ColorPicker with the correct initial color', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<ColorPickerInput value="#ff0000" onChange={mockOnChange} />);

    const colorPicker = getByTestId('color-picker-section-palette');
    fireEvent.click(colorPicker);
    expect(colorPicker).toHaveAttribute('data-value', 'rgba(255, 0, 0, 1)');
  });

  it('renders with a default data-test-section if none is provided', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<ColorPickerInput value="#ffffff" onChange={mockOnChange} />);

    const container = getByTestId('color-picker-section');
    expect(container).toBeInTheDocument();
  });

  it('renders with a custom data-test-section if provided', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <ColorPickerInput value="#ffffff" onChange={mockOnChange} dataTestSection="custom-section" />
    );

    const container = getByTestId('custom-section');
    expect(container).toBeInTheDocument();
  });
});
