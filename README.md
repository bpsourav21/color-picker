# color-picker

A customizable and easy-to-use color picker component for React applications.

## Features

- Supports HEX, RGBA, and HSL color formats
- Interactive color palette and sliders
- Input field for manual color entry
- Preset color swatches
- Fully accessible and keyboard-navigable
- Lightweight and dependency-free

## Installation

```bash
npm install color-picker
```

## Usage

### Color Picker Component

```jsx
import { ColorPicker, Color } from "color-picker";

function App() {
  const [color, setColor] = useState("#ff0000");

  return (
    <ColorPicker
      value={color}
      onColorChange={(rgba: Color) => setColor(rgba.toString())}
      dropdownPosition="bottom"
    />
  );
}
```

## Props

| Name             | Type    | Default   | Description                                      |
| ---------------- | ------- | --------- | ------------------------------------------------ |
| value            | string  | `#000000` | Current color value                              |
| onColorChange    | func    | —         | Callback when color changes                      |
| dropdownPosition | string  | `'top'`   | `'bottom'` or `'top'` or `'right'` or `'left'`   |
| disabled         | boolean | `false`   | Disable the color picker                         |
| format           | string  | `'rgba'`  | Color format: `'hex'`, `'rgba'`, `'rgb'`,`'hsl'` |

### Color Picker Input Component

```jsx
import { ColorPickerInput, Color } from "color-picker";

function App() {
  const [color, setColor] = useState("#ff0000");

  return (
    <ColorPickerInput
      value={color}
      onChange={(rgba) => setColor(rgba)}
      dropdownPosition="bottom"
    />
  );
}
```

## Props

| Name             | Type    | Default   | Description                                      |
| ---------------- | ------- | --------- | ------------------------------------------------ |
| value            | string  | `#000000` | Current color value                              |
| onChange         | func    | —         | Callback when color changes                      |
| dropdownPosition | string  | `'top'`   | `'bottom'` or `'top'` or `'right'` or `'left'`   |
| disabled         | boolean | `false`   | Disable the color picker                         |
| format           | string  | `'rgba'`  | Color format: `'hex'`, `'rgba'`, `'rgb'`,`'hsl'` |

### Color Class

The `Color` class provides utility methods for parsing, manipulating, and converting color values between different formats (HEX, RGB, RGBA, HSL).

#### Import

```js
import { Color } from "color-picker";
```

#### Usage

```js
// Create a Color instance from a HEX string
const color = new Color("#ff0000");

// Get color as RGBA string
console.log(color.toString()); // "rgba(255, 0, 0, 1)"

// Convert to HEX
console.log(color.toHex()); // "#ff0000"

// Convert to HSL
console.log(color.toHsl()); // "hsl(0, 100%, 50%)"
```

```js
// Using static from methods
const color1 = Color.fromHex("#00ff00");
console.log(color1.toRgb()); // "rgb(0, 255, 0)"

const color2 = Color.fromRgb("rgb(0, 0, 255)");
console.log(color2.toHex()); // "#0000ff"

const color3 = Color.fromHsl("hsl(120, 100%, 50%)");
console.log(color3.toString()); // "rgba(0, 255, 0, 1)"
```

#### Methods

| Method                       | Description                                                           |
| ---------------------------- | --------------------------------------------------------------------- |
| `constructor(value: string)` | Create a new Color instance from a color string (HEX, RGB, HSL, etc.) |
| `toString()`                 | Get the color as an RGBA string                                       |
| `toHex()`                    | Get the color as a HEX string                                         |
| `toRgb()`                    | Get the color as an RGB string                                        |
| `toHsl()`                    | Get the color as an HSL string                                        |
| `fromHex(hex: string)`       | Create a Color instance from a HEX string (static method)             |
| `fromRgb(rgb: string)`       | Create a Color instance from an RGB string (static method)            |
| `fromHsl(hsl: string)`       | Create a Color instance from an HSL string (static method)            |


## License

MIT

