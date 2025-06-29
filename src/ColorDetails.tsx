import React, { useCallback, useMemo } from 'react';
import { ColorDetailsProps } from './types';

const ColorDetails: React.FC<ColorDetailsProps> = ({ rgba, hex, showCopyButton }) => {
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const containerStyle = {
    width: '100%',
    marginTop: 5,
    fontSize: 12,
    lineHeight: 1.6,
  };

  const buttonStyle = {
    marginLeft: 10,
    cursor: 'pointer',
    fontSize: 10,
    padding: '2px 6px',
  };

  const DetailRow = useCallback(
    ({ name, value }: { name: string; value: string }) => (
      <div key={name}>
        {value}
        {showCopyButton && (
          <button onClick={() => copy(value)} style={buttonStyle} aria-label={`Copy ${name} value`}>
            Copy
          </button>
        )}
      </div>
    ),
    [copy]
  );

  const rows = useMemo(() => {
    const blocks = [];
    if (rgba && rgba !== '') blocks.push(<DetailRow key="rgba" name="RGBA" value={rgba} />);
    if (hex && hex !== '') blocks.push(<DetailRow key="hex" name="HEX" value={hex} />);
    return blocks;
  }, [rgba, hex, DetailRow]);

  return <div style={containerStyle}>{rows}</div>;
};

export default ColorDetails;
