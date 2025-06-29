import React from "react";
import ColorPicker from "./ColorPicker";
import { Color } from "./Color";
import { ColorPickerInputProps } from "./types";

/**
 * A React functional component that renders a color picker input field.
 * It allows users to input a color value either through a text input or by selecting
 * a color from a color picker palette.
 *
 * @component
 * @param {ColorPickerInputProps} props - The props for the `ColorPickerInput` component.
 * @param {string} props.value - The current color value in string format.
 * @param {(color: string) => void} props.onChange - Callback function triggered when the color value changes.
 * @param {string} [props.className] - Optional CSS class name for the input element.
 * @param {React.CSSProperties} [props.style] - Optional inline styles for the input element.
 * @param {string} [props.dataTestSection='color-picker-section'] - Optional data attribute for testing purposes.
 * @returns {JSX.Element} The rendered `ColorPickerInput` component.
 */

const ColorPickerInput: React.FC<ColorPickerInputProps> = (props) => {
  const {
    value,
    onChange,
    className,
    style,
    dropdownPosition,
    dataTestSection = "color-picker-section",
  } = props;
  return (
    <div
      style={{ position: "relative" }}
      data-test-section={dataTestSection}
      data-value={value}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const color = e.target.value as string;
          onChange(color);
        }}
        style={{
          padding: "7px 7px 7px 50px",
          border: "1px solid #d6d6d6",
          borderRadius: 5,
          backgroundColor: "#fff",
          width: "100%",
          boxSizing: "border-box",
          WebkitBoxSizing: "border-box",
          ...style,
        }}
        className={className}
        data-test-section={`${dataTestSection}-input`}
      />
      <ColorPicker
        value={new Color(value).toString()}
        dataTestSection={`${dataTestSection}-palette`}
        onColorChange={(rgba) => {
          const color = rgba.toString();
          onChange(color);
        }}
        style={{
          position: "absolute",
          left: 5,
          top: 5,
          bottom: 0,
          margin: "auto",
        }}
        dropdownPosition={dropdownPosition}
      />
    </div>
  );
};

export default ColorPickerInput;
