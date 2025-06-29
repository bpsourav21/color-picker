import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Set BUILD_EXAMPLE value from npm script or default to "false"
process.env.BUILD_EXAMPLE = process.env.BUILD_EXAMPLE || (process.env.npm_lifecycle_event === "build-example" ? "true" : "false");

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
  ...(command === "build" && process.env.BUILD_EXAMPLE === "true" && {
    root: "example",
    publicDir: false,
    build: { outDir: __dirname + "/example-dist", emptyOutDir: true },
  }),
}));
