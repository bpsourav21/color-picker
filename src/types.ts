import { Color } from "./Color";

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type HSV = {
  h: number;
  s: number;
  v: number;
};

export type RGBA = RGB & {
  a: number; // 0 to 1
};

/**
 * Props for the SpectrumSlider component.
 *
 * @property {number} width - The width of the slider in pixels.
 * @property {(rgb: RGB) => void} onColorSelect - Callback function triggered when a color is selected.
 * Receives the selected color as an RGB object.
 * @property {HSV} hsv - The HSV (Hue, Saturation, Value) color model object.
 * Can be null to handle cases where HSV is not provided.
 */
export interface SpectrumSliderProps {
  width: number;
  onColorSelect: (rgb: RGB) => void;
  hsv: HSV;
}

/**
 * Props for the AlphaSlider component.
 *
 * @property {number} width - The width of the slider in pixels.
 * @property {number} alpha - The current alpha (opacity) value, ranging from 0 to 1.
 * @property {(alpha: number) => void} onChange - Callback function triggered when the alpha value changes.
 * Receives the new alpha value as an argument.
 */
export interface AlphaSliderProps {
  width: number;
  alpha: number; // 0 to 1
  onChange: (alpha: number) => void;
}

/**
 * Properties for the ColorPickerCanvas component.
 *
 * @property width - The width of the canvas in pixels.
 * @property height - The height of the canvas in pixels.
 * @property hsv - The HSV (Hue, Saturation, Value) color model object.
 * @property onSelect - A callback function that is triggered when a color is selected.
 * It receives an RGB (Red, Green, Blue) color model object as an argument.
 */
export interface ColorPickerCanvasProps {
  width: number;
  height: number;
  hsv: HSV;
  onSelect: (rgb: RGB) => void;
}

/**
 * Props for the ColorDetails component.
 *
 * @property {string} [rgba] - The color value in RGBA format as a string.
 * @property {string} [hex] - The color value in HEX format as a string.
 * @property {boolean} [showCopyButton] - Determines whether the copy button should be displayed.
 */
export interface ColorDetailsProps {
  rgba?: string;
  hex?: string;
  showCopyButton?: boolean;
}

/**
 * Props for the ColorPicker component.
 *
 * @extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'>
 *
 * @property {boolean} [showCopyButton] - Determines whether the copy button should be displayed.
 * @property {string} [dataTestSection] - A string used for testing purposes to identify the component.
 * @property {string} [value] - The current color value in string format.
 * @property {(rgba: Color) => void} onColorChange - Callback function triggered when the color changes.
 * Receives the new color as an argument in RGBA format.
 */
export interface ColorPickerProps
  extends Omit<React.HTMLAttributes<HTMLInputElement>, "onChange"> {
  showCopyButton?: boolean;
  dataTestSection?: string;
  value?: string;
  onColorChange: (rgba: Color) => void;
  dropdownPosition?: "left" | "right" | "top" | "bottom";
}

/**
 * Props for the `ColorPickerInput` component.
 *
 * @extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>
 *
 * @property {string} value - The current color value in string format.
 * @property {(color: string) => void} onChange - Callback function triggered when the color value changes.
 * @property {string} [dataTestSection] - Optional attribute for testing purposes, used to identify the component in tests.
 */
export interface ColorPickerInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value: string;
  onChange: (color: string) => void;
  dataTestSection?: string;
  dropdownPosition?: "left" | "right" | "top" | "bottom";
}
