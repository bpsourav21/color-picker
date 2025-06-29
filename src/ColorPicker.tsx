import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AlphaSlider from "./AlphaSlider";
import ColorDetails from "./ColorDetails";
import ColorPickerCanvas from "./ColorPickerCanvas";
import SpectrumSlider from "./SpectrumSlider";
import { ColorPickerProps, RGB } from "./types";
import { Color } from "./Color";
import { debounce } from "./helpers";

/**
 * A React functional component for a customizable color picker.
 * The `ColorPicker` component allows users to select colors using a canvas, spectrum slider, and alpha slider.
 * It supports HSV and RGBA color models and provides a preview of the selected color.
 *
 * @component
 * @param {ColorPickerProps} props - The properties passed to the `ColorPicker` component.
 * @param {string} props.value - The initial color value in a format supported by the `Color` class.
 * @param {(color: Color) => void} props.onColorChange - Callback function triggered when the color is changed.
 * @param {boolean} [props.showCopyButton] - Determines whether to show a copy button in the color details section.
 * @param {React.CSSProperties} [props.style] - Custom styles to apply to the root container of the color picker.
 * @param {string} [props.dataTestSection] - A data attribute for testing purposes.
 *
 * @returns {JSX.Element} The rendered color picker component.
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   value="#ff0000"
 *   onColorChange={(color) => console.log(color.toString())}
 *   showCopyButton={true}
 *   style={{ margin: '10px' }}
 *   dataTestSection="custom-color-picker"
 * />
 * ```
 */
const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const width = 200;
  const height = 100;
  const {
    value,
    onColorChange,
    style,
    dataTestSection = "color-picker",
    className,
    showCopyButton,
    dropdownPosition,
  } = props;

  const colorValue = new Color(value);

  const prevValuesRef = useRef<Color>(colorValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [hsv, setHsv] = useState(colorValue.hsv);
  const [alpha, setAlpha] = useState(colorValue.alpha);
  const [showPalette, setShowPalette] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const target = event.composedPath?.()[0] as Node; // detecting shadow DOM
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target as Node)
      ) {
        setShowPalette(false);
      }
    },
    [dropdownRef]
  );

  useEffect(() => {
    if (showPalette) {
      window.addEventListener("mousedown", handleClickOutside);
    } else {
      window.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPalette, handleClickOutside]);

  const rgba = useMemo(() => {
    return Color.fromHsv(hsv, alpha);
  }, [hsv, alpha]);

  const debouncedOnColorChange = useMemo(
    () => debounce(onColorChange, 300),
    [onColorChange]
  );

  useEffect(() => {
    if (isChanged) {
      debouncedOnColorChange(rgba);
      setIsChanged(false);
    }
  }, [rgba]);

  useEffect(() => {
    const prevValues = prevValuesRef.current;
    if (
      prevValues.red !== colorValue.red ||
      prevValues.green !== colorValue.green ||
      prevValues.blue !== colorValue.blue ||
      prevValues.alpha !== colorValue.alpha
    ) {
      setAlpha(colorValue.alpha);
      setHsv(colorValue.hsv);
      prevValuesRef.current = colorValue;
    }
  }, [colorValue]);

  const handleCanvasSelect = useCallback((color: RGB) => {
    const colorValue = Color.fromRgb(color);
    setHsv((prev) => ({ ...colorValue.hsv, h: prev.h }));
    setIsChanged(true);
  }, []);

  const handleSpectrumSelect = useCallback((color: RGB) => {
    const hsvColor = Color.fromRgb(color).hsv;
    setHsv((prev) => ({ h: hsvColor.h, s: prev.s, v: prev.v }));
    setIsChanged(true);
  }, []);

  const handleAlphaChange = useCallback((a: number) => {
    setAlpha(a);
    setIsChanged(true);
  }, []);

  const previewStyle = {
    height: 40,
    width: 40,
    backgroundColor: rgba.toString(),
    border: "1px solid #d6d6d6",
    borderRadius: 50,
    marginRight: 5,
  };

  const renderColorPicker = () => {
    let positionStyle: React.CSSProperties;

    switch (dropdownPosition) {
      case "left":
        positionStyle = {
          left: 35,
          bottom: "auto",
          right: "auto",
          top: "auto",
        };
        break;
      case "right":
        positionStyle = {
          right: 35,
          bottom: "auto",
          left: "auto",
          top: "auto",
        };
        break;
      case "bottom":
        positionStyle = { left: 0, top: 35, right: "auto", bottom: "auto" };
        break;
      case "top":
      default:
        positionStyle = { left: 0, bottom: 35, right: "auto", top: "auto" };
        break;
    }

    return (
      <div
        data-test-section="color-picker-dropdown"
        ref={dropdownRef}
        style={{
          width: 200,
          margin: "0 auto",
          padding: 10,
          position: "absolute",
          zIndex: 100000,
          border: "1px solid #d6d6d6",
          borderRadius: 5,
          backgroundColor: "#fff",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          display: showPalette ? "block" : "none",
          ...positionStyle,
        }}
      >
        <div>
          <ColorPickerCanvas
            width={width}
            height={height}
            onSelect={handleCanvasSelect}
            hsv={hsv}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 5,
            }}
          >
            <div style={previewStyle} />
            <div>
              <SpectrumSlider
                hsv={hsv}
                width={width - 50}
                onColorSelect={handleSpectrumSelect}
              />
              <div style={{ marginBottom: 5 }} />
              <AlphaSlider
                width={width - 50}
                alpha={alpha}
                onChange={handleAlphaChange}
              />
            </div>
          </div>
          <ColorDetails
            rgba={rgba.toString()}
            hex={rgba.toHexString()}
            showCopyButton={showCopyButton}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      style={{ ...style }}
      className={className}
      data-test-section={dataTestSection}
      data-value={rgba.toString()}
    >
      <div
        style={{
          ...previewStyle,
          width: 40,
          height: 20,
          borderRadius: 5,
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => setShowPalette(!showPalette)}
        data-test-section={`${dataTestSection}-preview`}
      >
        {renderColorPicker()}
      </div>
    </div>
  );
};

export default ColorPicker;
