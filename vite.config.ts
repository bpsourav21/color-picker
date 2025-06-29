import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.tsx",
      name: "colorPicker",
      // fileName: (format) => `color-picker.${format}.js`,
      // formats: ["es", "umd", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  ...(command === "serve" && {
    root: "example",
    publicDir: false,
    build: { outDir: "example-dist" },
  }),
}));
