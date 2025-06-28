import { cleanup } from "@testing-library/react";
import { jest } from "@jest/globals";

global.beforeEach(() => {
  // Mocks the font loading API
  const mockFontFaces = [{ family: "Arial" }, { family: "Roboto" }];
  const mockFontFaceSet = {
    [Symbol.iterator]: function* () {
      for (const font of mockFontFaces) {
        yield font;
      }
    },
    ready: Promise.resolve(mockFontFaces),
  };
  Object.defineProperty(document, "fonts", {
    configurable: true,
    get: () => mockFontFaceSet,
  });

  document.body.innerHTML = "";
  window.sessionStorage.clear();
  jest.clearAllMocks();
});

global.afterEach(() => {
  cleanup();
});
