import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ColorDetails from './ColorDetails';

describe('ColorDetails Component', () => {
  it('renders RGBA and HEX values when provided', () => {
    render(<ColorDetails rgba="rgba(255, 0, 0, 1)" hex="#FF0000" showCopyButton={false} />);

    expect(screen.getByText('rgba(255, 0, 0, 1)')).toBeInTheDocument();
    expect(screen.getByText('#FF0000')).toBeInTheDocument();
  });

  it('does not render anything if no values are provided', () => {
    const { container } = render(<ColorDetails rgba="" hex="" showCopyButton={false} />);
    expect(container).toBeInTheDocument();
    expect(screen.queryByLabelText('Copy RGBA value')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Copy HEX value')).not.toBeInTheDocument();
  });

  it('renders copy buttons when showCopyButton is true', () => {
    render(<ColorDetails rgba="rgba(255, 0, 0, 1)" hex="#FF0000" showCopyButton={true} />);

    expect(screen.getByLabelText('Copy RGBA value')).toBeInTheDocument();
    expect(screen.getByLabelText('Copy HEX value')).toBeInTheDocument();
  });

  it('copies the correct value to clipboard when copy button is clicked', async () => {
    const writeTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<ColorDetails rgba="rgba(255, 0, 0, 1)" hex="#FF0000" showCopyButton={true} />);

    const copyRgbaButton = screen.getByLabelText('Copy RGBA value');
    fireEvent.click(copyRgbaButton);
    expect(writeTextMock).toHaveBeenCalledWith('rgba(255, 0, 0, 1)');

    const copyHexButton = screen.getByLabelText('Copy HEX value');
    fireEvent.click(copyHexButton);
    expect(writeTextMock).toHaveBeenCalledWith('#FF0000');
  });
});
