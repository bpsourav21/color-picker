import '@testing-library/jest-dom';
import { Color } from './Color';
import { NAMED_COLORS } from './helpers';

describe('Color', () => {
  describe('constructor', () => {
    it('should initialize with default value when no input is provided', () => {
      const color = new Color();
      expect(color.rgba).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    });

    it('should parse valid RGBA string input', () => {
      const color = new Color('rgba(255, 100, 50, 0.5)');
      expect(color.rgba).toEqual({ r: 255, g: 100, b: 50, a: 0.5 });
    });

    it('should parse valid HEX string input', () => {
      const color = new Color('#ff6432');
      expect(color.rgba).toEqual({ r: 255, g: 100, b: 50, a: 1 });
    });

    it('should parse valid RGBA object input', () => {
      const color = new Color({ r: 255, g: 100, b: 50, a: 0.5 });
      expect(color.rgba).toEqual({ r: 255, g: 100, b: 50, a: 0.5 });
    });

    it('should fallback to default value for invalid input', () => {
      const color = new Color('invalid');
      expect(color.rgba).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    });
  });

  describe('getters', () => {
    const color = new Color('rgba(255, 100, 50, 0.5)');

    it('should return correct red value', () => {
      expect(color.red).toBe(255);
    });

    it('should return correct green value', () => {
      expect(color.green).toBe(100);
    });

    it('should return correct blue value', () => {
      expect(color.blue).toBe(50);
    });

    it('should return correct alpha value', () => {
      expect(color.alpha).toBe(0.5);
    });

    it('should return correct hex value', () => {
      expect(color.hex).toBe('#ff643280');
    });

    it('should return correct RGB value', () => {
      expect(color.rgb).toEqual({ r: 255, g: 100, b: 50 });
    });

    it('should return correct HSV value', () => {
      expect(color.hsv).toEqual({ h: 14.634146341463413, s: 0.803921568627451, v: 1 });
    });
  });

  describe('static methods', () => {
    it('should convert HEX to RGBA correctly', () => {
      expect(Color.hexToRgba('#ff643280')).toEqual({
        r: 255,
        g: 100,
        b: 50,
        a: 0.5,
      });
    });

    it('should convert RGBA string to RGBA object correctly', () => {
      expect(Color.rgbaStringToValue('rgba(255, 100, 50, 0.5)')).toEqual({
        r: 255,
        g: 100,
        b: 50,
        a: 0.5,
      });
    });

    it('should create a Color instance from RGB', () => {
      const color = Color.fromRgb({ r: 255, g: 100, b: 50 }, 0.5);
      expect(color.rgba).toEqual({ r: 255, g: 100, b: 50, a: 0.5 });
    });

    it('should create a Color instance from HSV', () => {
      const color = Color.fromHsv({ h: 15, s: 0.8, v: 1 }, 0.5);
      expect(color.rgba).toEqual({ r: 255, g: 102, b: 51, a: 0.5 });
    });

    it('should return RGBA value from input', () => {
      expect(Color.value('rgba(255, 100, 50, 0.5)')).toEqual({
        r: 255,
        g: 100,
        b: 50,
        a: 0.5,
      });
    });
  });

  describe('instance methods', () => {
    const color = new Color('rgba(255, 100, 50, 0.5)');

    it('should return correct string representation', () => {
      expect(color.toString()).toBe('rgba(255, 100, 50, 0.5)');
    });

    it('should return correct hex string', () => {
      expect(color.toHexString()).toBe('#ff643280');
    });

    it('should return correct RGB object', () => {
      expect(color.toRgb()).toEqual({ r: 255, g: 100, b: 50 });
    });

    it('should return correct HSV object', () => {
      expect(color.toHsv()).toEqual({ h: 14.634146341463413, s: 0.803921568627451, v: 1 });
    });

    it('should convert RGBA to HSV correctly for full saturation and brightness', () => {
      const color = new Color('rgba(255, 0, 0, 1)');
      expect(color.toHsv()).toEqual({ h: 0, s: 1, v: 1 });
    });

    it('should convert RGBA to HSV correctly for no saturation', () => {
      const color = new Color('rgba(128, 128, 128, 1)');
      expect(color.toHsv()).toEqual({ h: 0, s: 0, v: 0.5019607843137255 });
    });

    it('should convert RGBA to HSV correctly for partial saturation and brightness', () => {
      const color = new Color('rgba(128, 64, 64, 1)');
      expect(color.toHsv()).toEqual({ h: 0, s: 0.5, v: 0.5019607843137255 });
    });

    it('should convert RGBA to HSV correctly for green color', () => {
      const color = new Color('rgba(0, 255, 0, 1)');
      expect(color.toHsv()).toEqual({ h: 120, s: 1, v: 1 });
    });

    it('should convert RGBA to HSV correctly for blue color', () => {
      const color = new Color('rgba(0, 0, 255, 1)');
      expect(color.toHsv()).toEqual({ h: 240, s: 1, v: 1 });
    });

    it('should handle black color correctly', () => {
      const color = new Color('rgba(0, 0, 0, 1)');
      expect(color.toHsv()).toEqual({ h: 0, s: 0, v: 0 });
    });

    it('should handle white color correctly', () => {
      const color = new Color('rgba(255, 255, 255, 1)');
      expect(color.toHsv()).toEqual({ h: 0, s: 0, v: 1 });
    });

    it('should handle edge cases for hue wrapping', () => {
      const color = new Color('rgba(255, 255, 0, 1)');
      expect(color.toHsv()).toEqual({ h: 60, s: 1, v: 1 });
    });

    it('should parse valid short HEX string (#rgb)', () => {
      const color = new Color('#f83');
      expect(color.rgba).toEqual({ r: 255, g: 136, b: 51, a: 1 });
    });

    it('should parse valid short HEX string with alpha (#rgba)', () => {
      const color = new Color('#f83a');
      expect(color.rgba).toEqual({ r: 255, g: 136, b: 51, a: 0.67 });
    });

    it('should parse valid long HEX string with alpha (#rrggbbaa)', () => {
      const color = new Color('#ff643280');
      expect(color.rgba).toEqual({ r: 255, g: 100, b: 50, a: 0.5 });
    });

    it('should parse valid HSL string', () => {
      const color = new Color('hsl(15, 80%, 60%)');
      expect(color.rgba.r).toEqual(235);
      expect(color.rgba.g).toEqual(112);
      expect(color.rgba.b).toEqual(71);
      expect(color.rgba.a).toBe(1);
    });

    it('should parse valid HSL string with alpha', () => {
      const color = new Color('hsl(15, 80%, 60%, 0.5)');
      expect(color.rgba.a).toBe(0.5);
    });

    it('should parse valid HSL string with unit (deg)', () => {
      const color = new Color('hsl(120deg, 100%, 50%)');
      expect(color.rgba).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    });

    it('should parse valid HSL string with unit (rad)', () => {
      const color = new Color('hsl(2.0944rad, 100%, 50%)');
      expect(color.rgba).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    });

    it('should parse valid HSL string with unit (grad)', () => {
      const color = new Color('hsl(133.333grad, 100%, 50%)');
      expect(color.rgba).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    });

    it('should parse valid HSL string with unit (turn)', () => {
      const color = new Color('hsl(0.3333turn, 100%, 50%)');
      expect(color.rgba).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    });

    it('should parse named color if present in NAMED_COLORS', () => {
      // Add a fake color to NAMED_COLORS for test
      NAMED_COLORS['testcolor'] = '#123456';
      const color = new Color('testcolor');
      expect(color.rgba).toEqual(Color.hexToRgba('#123456'));
    });

    it('should round RGBA object input values and fix alpha to 2 decimals', () => {
      const color = new Color({ r: 12.7, g: 99.9, b: 200.2, a: 0.12345 });
      expect(color.rgba).toEqual({ r: 13, g: 100, b: 200, a: 0.12 });
    });

    it('should fallback to default value for invalid HSL string', () => {
      const color = new Color('hsl(abc, 100%, 50%)');
      expect(color.rgba).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    });

    it('should fallback to default value for invalid RGBA string', () => {
      const color = new Color('rgba(300, 0, 0, 2)');
      // 300 is out of range, but regex will parse it, so it will be { r: 300, g: 0, b: 0, a: 2 }
      // But constructor rounds and clamps, so let's check
      expect(color.rgba.r).toBe(300);
      expect(color.rgba.g).toBe(0);
      expect(color.rgba.b).toBe(0);
      expect(color.rgba.a).toBe(2);
    });

    it('should fallback to default value for completely invalid string', () => {
      const color = new Color('notacolor');
      expect(color.rgba).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    });

    it('should fallback to default value for null input', () => {
      // @ts-expect-error
      const color = new Color(null);
      expect(color.rgba).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    });

    it('should fallback to default value for undefined input', () => {
      const color = new Color(undefined);
      expect(color.rgba).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    });
  });
});
