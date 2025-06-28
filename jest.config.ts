import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.app.json",
    },
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setupAfter.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/example/"],
  resetMocks: true,
  collectCoverage: true,
  verbose: true,
};

export default config;
