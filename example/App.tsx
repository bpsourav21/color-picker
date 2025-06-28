import React, { useState } from "react";
// import {ColorPicker} from "color-picker";

export default function App() {
  const [color, setColor] = useState("#ff0000");

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>🎨 Color Picker Demo</h2>

      {/* <ColorPicker value={color} onChange={setColor} /> */}

      <div style={{ marginTop: "1rem" }}>
        <strong>Selected Color:</strong> {color}
        <div
          style={{
            width: 50,
            height: 50,
            background: color,
            border: "1px solid #ccc",
            marginTop: "0.5rem",
          }}
        />
      </div>
    </div>
  );
}
