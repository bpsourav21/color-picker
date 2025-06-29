import React, { CSSProperties, useState } from "react";
import { ColorPicker, ColorPickerInput } from "../src/index";

const colorPickerInputCode = `
import { ColorPickerInput, Color } from "color-picker";

function App() {
  const [color, setColor] = useState("#ff0000");

  return (
    <ColorPickerInput
      value={color}
      onChange={(rgba: Color) => setColor(rgba)}
      dropdownPosition="bottom"
    />
  );
}
`;

const colorPickerCode = `
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
`;

const colorMethodCode = `
// Create a Color instance from a HEX string
const color = new Color("#ff0000");

// Get color as RGBA string
console.log(color.toString()); // "rgba(255, 0, 0, 1)"

// Convert to HEX
console.log(color.toHex()); // "#ff0000"

// Convert to HSL
console.log(color.toHsl()); // "hsl(0, 100%, 50%)"


// Using static from methods
const color1 = Color.fromHex("#00ff00");
console.log(color1.toRgb()); // "rgb(0, 255, 0)"

const color2 = Color.fromRgb("rgb(0, 0, 255)");
console.log(color2.toHex()); // "#0000ff"

const color3 = Color.fromHsl("hsl(120, 100%, 50%)");
console.log(color3.toString()); // "rgba(0, 255, 0, 1)"
`;

const codeBlockContainer: CSSProperties = {
  backgroundColor: `#282c34`,
  color: "#abb2bf",
  padding: 15,
  borderRadius: 5,
  overflowX: "auto",
  fontFamily: "monospace",
  fontSize: "0.9em",
};

interface TableProps {
  name: string;
  type: string;
  default: string;
  description: string;
}

const colorPickerProps: TableProps[] = [
  {
    name: "value",
    type: "string",
    default: "`#000000`",
    description: "Current color value",
  },
  {
    name: "onColorChange",
    type: "func",
    default: "—",
    description: "Callback when color changes",
  },
  {
    name: "dropdownPosition",
    type: "string",
    default: "'top'",
    description: "'bottom' or 'top' or 'right' or 'left'",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the color picker",
  },
  {
    name: "format",
    type: "string",
    default: "'rgba'",
    description: "Color format: 'hex', 'rgba', 'rgb', 'hsl'",
  },
];

const colorPickerInputProps: TableProps[] = [
  {
    name: "value",
    type: "string",
    default: "`#000000`",
    description: "Current color value",
  },
  {
    name: "onChange",
    type: "func",
    default: "—",
    description: "Callback when color changes",
  },
  {
    name: "dropdownPosition",
    type: "string",
    default: "'top'",
    description: "'bottom' or 'top' or 'right' or 'left'",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the color picker",
  },
  {
    name: "format",
    type: "string",
    default: "'rgba'",
    description: "Color format: 'hex', 'rgba', 'rgb', 'hsl'",
  },
];

function PropsTable({ data }: { data: TableProps[] }) {
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        margin: "1.5rem 0",
        fontSize: "0.95em",
        background: "#fff",
        color: "#222",
        boxShadow: "0 2px 8px #0001",
      }}
    >
      <thead>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Type</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Default</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((prop) => (
          <tr key={prop.name}>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                fontFamily: "monospace",
              }}
            >
              {prop.name}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {prop.type}
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                fontFamily: "monospace",
              }}
            >
              {prop.default}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {prop.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function App() {
  const [color, setColor] = useState("#ff0000");
  const [color2, setColor2] = useState("#ff0000");

  return (
    <div style={{ padding: "5rem", fontFamily: "sans-serif" }}>
      <section style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          🎨 Color Picker
        </h1>
        <p>
          Author:{" "}
          <a href="https://bpsourav21.github.io/" target="__blank">
            Md Mahadi Hasan Sourav
          </a>
        </p>
        <p>
          <a href="https://www.npmjs.com/package/color-picker" target="__blank">
            NPM Package
          </a>
          {" | "}
          <a href="https://github.com/bpsourav21/color-picker" target="__blank">
            Github Repository
          </a>
        </p>
      </section>
      <section style={{ marginBottom: "2rem" }}>
        <p
          style={{ fontSize: "1.2rem", color: "#444", marginBottom: "1.5rem" }}
        >
          <strong>color-picker</strong> — A customizable and easy-to-use color
          picker component for React applications.
        </p>
        <ul style={{ marginBottom: "1.5rem", paddingLeft: "1.5rem" }}>
          <li>
            Supports <strong>HEX</strong>, <strong>RGBA</strong>, and{" "}
            <strong>HSL</strong> color formats
          </li>
          <li>Interactive color palette and sliders</li>
          <li>Input field for manual color entry</li>
          <li>Preset color swatches</li>
          <li>Fully accessible and keyboard-navigable</li>
          <li>Lightweight and dependency-free</li>
        </ul>
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>Installation</h3>
          <pre style={codeBlockContainer}>
            <code>npm install color-picker</code>
          </pre>
        </div>
      </section>
      <section style={{ marginBottom: "2rem" }}>
        <h2>Color Picker Demo</h2>
        <h3>How to Use ColorPicker and ColorPickerInput</h3>
        <p>
          <strong>ColorPickerInput</strong> provides an input field with a color
          picker dropdown. You can use it as follows:
        </p>
        <ColorPickerInput
          value={color}
          onChange={(rgba) => setColor(rgba)}
          dropdownPosition="bottom"
        />
        <pre style={codeBlockContainer}>
          <code style={{ whiteSpace: "pre-wrap" }}>{colorPickerInputCode}</code>
        </pre>
        <div>
          <h4>ColorPickerInput Props</h4>
          <PropsTable data={colorPickerInputProps} />
        </div>
        <p>
          <strong>ColorPicker</strong> is a standalone color picker component.
          Example usage:
        </p>
        <ColorPicker
          value={color2}
          onColorChange={(rgba) => setColor2(rgba.toString())}
          dropdownPosition="bottom"
        />
        <pre style={codeBlockContainer}>
          <code style={{ whiteSpace: "pre-wrap" }}>{colorPickerCode}</code>
        </pre>
        <div>
          <h4>ColorPicker Props</h4>
          <PropsTable data={colorPickerProps} />
        </div>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Color Class Utility Functions</h3>
        <p>
          The <strong>Color</strong> class provides utility functions for color
          manipulation and conversion. Example usage:
        </p>
        <pre style={codeBlockContainer}>
          <code style={{ whiteSpace: "pre-wrap" }}>{colorMethodCode}</code>
        </pre>
        <p>
          Use these utilities to easily parse, convert, and manipulate colors in
          your application.
        </p>
        <div>
          <h4>Color Class Utility Functions</h4>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              margin: "1.5rem 0",
              fontSize: "0.95em",
              background: "#fff",
              color: "#222",
              boxShadow: "0 2px 8px #0001",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Method
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  constructor(value: string)
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Create a new Color instance from a color string (HEX, RGB,
                  HSL, etc.)
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  toString()
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Get the color as an RGBA string
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  toHex()
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Get the color as a HEX string
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  toRgb()
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Get the color as an RGB string
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  toHsl()
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Get the color as an HSL string
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  static fromHex(hex: string)
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Create a Color instance from a HEX string
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  static fromRgb(rgb: string)
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Create a Color instance from an RGB string
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  static fromHsl(hsl: string)
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Create a Color instance from an HSL string
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
