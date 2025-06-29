import { NAMED_COLORS } from './helpers';
import { HSV, RGB, RGBA } from './types';

const rgbaRegex =
  /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/i;
const hexRegex = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const hslRegex =
  /^hsl\(\s*([\d.]+)(deg|rad|grad|turn)?(?:,|\s)\s*([\d.]+)%(?:,|\s)\s*([\d.]+)%\s*(?:[,/]\s*([\d.]+%?))?\s*\)$/i;

/**
 * Utility class for manipulating and converting colors between RGBA, RGB, HEX, and HSV formats.
 */
export class Color {
  private _rgba: RGBA;

  /** Default color used when no valid input is provided. */
  static defaultValue: RGBA = { r: 0, g: 0, b: 0, a: 1 };

  /**
   * Constructs a new Color instance from a hex string, rgba string, or RGBA object.
   * @param input - A color string (hex or rgba) or an RGBA object.
   */
  constructor(input?: string | RGBA) {
    if (input && typeof input === 'string') {
      if (rgbaRegex.test(input)) {
        this._rgba = Color.rgbaStringToValue(input);
      } else if (hexRegex.test(input)) {
        this._rgba = Color.hexToRgba(input);
      } else if (hslRegex.test(input)) {
        this._rgba = Color.hslStringToRgba(input);
      } else {
        if (NAMED_COLORS[input.toLowerCase()]) {
          this._rgba = Color.hexToRgba(NAMED_COLORS[input.toLowerCase()]);
        } else {
          this._rgba = Color.defaultValue;
        }
      }
    } else if (input && typeof input === 'object') {
      this._rgba = {
        r: Math.round(input.r),
        g: Math.round(input.g),
        b: Math.round(input.b),
        a: parseFloat(input.a.toFixed(2)),
      };
    } else {
      this._rgba = Color.defaultValue;
    }
  }

  /** Gets the full RGBA value. */
  get rgba(): RGBA {
    return this._rgba;
  }

  /** Gets the red channel (0–255). */
  get red() {
    return this.rgba.r;
  }

  /** Gets the green channel (0–255). */
  get green() {
    return this.rgba.g;
  }

  /** Gets the blue channel (0–255). */
  get blue() {
    return this.rgba.b;
  }

  /** Gets the alpha value (0–1). */
  get alpha() {
    return this.rgba.a;
  }

  /** Gets the hexadecimal color string (e.g., #ff0000ff). */
  get hex() {
    return this.toHexString();
  }

  /** Gets the RGB object (excluding alpha). */
  get rgb() {
    return this.toRgb();
  }

  /** Gets the HSV representation of the color. */
  get hsv() {
    return this.toHsv();
  }

  /**
   * Converts a hex string to an RGBA object.
   * @param hex - A hex color string (#rgb, #rgba, #rrggbb, or #rrggbbaa).
   * @returns RGBA object with r, g, b (0–255) and a (0–1).
   */
  static hexToRgba(hex: string): RGBA {
    let cleanHex = hex.replace('#', '');

    if (cleanHex.length === 3 || cleanHex.length === 4) {
      cleanHex = cleanHex
        .split('')
        .map((c) => c + c)
        .join('');
    }

    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    const a =
      cleanHex.length === 8
        ? Math.round((parseInt(cleanHex.slice(6, 8), 16) / 255) * 100) / 100
        : 1;

    return { r, g, b, a };
  }

  /**
   * Converts an rgba() or rgb() string to an RGBA object.
   * @param rgbaStr - A string like `rgba(255, 0, 0, 0.5)`.
   * @returns RGBA object.
   */
  static rgbaStringToValue(rgbaStr: string): RGBA {
    const match = rgbaStr.match(rgbaRegex);
    if (!match) {
      console.error('Invalid RGBA format. Expected: rgba(r, g, b, a)');
      return Color.defaultValue;
    }

    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

    return { r, g, b, a };
  }

  /**
   * Converts an HSL string to an RGBA object.
   * @param hslStr - A string like `hsl(120, 100%, 50%, 0.5)`.
   * @returns RGBA object.
   */
  static hslStringToRgba(hslStr: string): RGBA {
    const match = hslStr.match(hslRegex);
    if (!match) {
      console.error('Invalid HSL format. Expected: hsl(h, s%, l%, [a])');
      return Color.defaultValue;
    }
    // match[1]: hue, match[2]: unit (optional), match[3]: sat, match[4]: light, match[5]: alpha (optional)
    let h = parseFloat(match[1]);
    const unit = match[2];
    if (unit === 'rad') h = (h * 180) / Math.PI;
    else if (unit === 'grad') h = h * 0.9;
    else if (unit === 'turn') h = h * 360;
    // else deg or undefined: use as is

    const s = parseFloat(match[3]) / 100;
    const l = parseFloat(match[4]) / 100;
    let a = 1;
    if (match[5] !== undefined) {
      if (match[5].endsWith('%')) {
        a = parseFloat(match[5]) / 100;
      } else {
        a = parseFloat(match[5]);
      }
    }

    return Color.fromHsl(h, s, l, a).rgba;
  }

  /**
   * Returns the RGB object (without alpha).
   * @returns RGB object.
   */
  toRgb(): RGB {
    const { r, g, b } = this.rgba;
    return { r, g, b };
  }

  /**
   * Returns a CSS-compatible rgba() string.
   * @returns RGBA string, e.g., `rgba(255, 0, 0, 0.5)`.
   */
  toString(): string {
    const { r, g, b, a } = this.rgba;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  /**
   * Returns a full hex string with alpha (e.g., `#ff000080`).
   * @returns Hex string.
   */
  toHexString(): string {
    const { r, g, b, a } = this.rgba;
    const toHex = (v: number) => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(Math.round(a * 255))}`;
  }

  /**
   * Converts the RGBA color to HSV format.
   * @returns HSV object (hue 0–360, saturation/value 0–1).
   */
  toHsv(): HSV {
    let { r, g, b } = this.rgba;
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = ((g - b) / delta) % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }
      h *= 60;
      if (h < 0) h += 360;
    }

    const s = max === 0 ? 0 : delta / max;
    const v = max;

    return { h, s, v };
  }

  /**
   * Returns the RGBA value from a given input.
   * @param input - Hex, rgba string, or RGBA object.
   * @returns RGBA object.
   */
  static value(input: string | RGBA): RGBA {
    return new Color(input).rgba;
  }

  /**
   * Creates a `Color` instance from an RGB object and optional alpha.
   * @param rgb - RGB values.
   * @param alpha - Optional alpha (default = 1).
   * @returns Color instance.
   */
  static fromRgb(rgb: RGB, alpha: number = 1): Color {
    return new Color({ ...rgb, a: alpha });
  }

  /**
   * Creates a `Color` instance from HSV values.
   * @param hsv - HSV object with hue (0–360), saturation/value (0–1).
   * @param alpha - Optional alpha (default = 1).
   * @returns Color instance.
   */
  static fromHsv(hsv: HSV, alpha: number = 1): Color {
    const { h, s, v } = hsv;
    const c = v * s;
    const hh = h / 60;
    const x = c * (1 - Math.abs((hh % 2) - 1));
    let r = 0,
      g = 0,
      b = 0;

    if (hh >= 0 && hh < 1) {
      r = c;
      g = x;
      b = 0;
    } else if (hh >= 1 && hh < 2) {
      r = x;
      g = c;
      b = 0;
    } else if (hh >= 2 && hh < 3) {
      r = 0;
      g = c;
      b = x;
    } else if (hh >= 3 && hh < 4) {
      r = 0;
      g = x;
      b = c;
    } else if (hh >= 4 && hh < 5) {
      r = x;
      g = 0;
      b = c;
    } else if (hh >= 5 && hh < 6) {
      r = c;
      g = 0;
      b = x;
    }

    const m = v - c;

    return Color.fromRgb(
      {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
      },
      alpha
    );
  }
  /**
   * Creates a `Color` instance from HSL values.
   * @param h - Hue (0–360).
   * @param s - Saturation (0–1).
   * @param l - Lightness (0–1).
   * @param alpha - Optional alpha (default = 1).
   * @returns Color instance.
   */
  static fromHsl(h: number, s: number, l: number, alpha: number = 1): Color {
    h = h % 360;
    if (h < 0) h += 360;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r = 0,
      g = 0,
      b = 0;

    if (0 <= hp && hp < 1) [r, g, b] = [c, x, 0];
    else if (1 <= hp && hp < 2) [r, g, b] = [x, c, 0];
    else if (2 <= hp && hp < 3) [r, g, b] = [0, c, x];
    else if (3 <= hp && hp < 4) [r, g, b] = [0, x, c];
    else if (4 <= hp && hp < 5) [r, g, b] = [x, 0, c];
    else if (5 <= hp && hp < 6) [r, g, b] = [c, 0, x];

    const m = l - c / 2;

    return Color.fromRgb(
      {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
      },
      alpha
    );
  }
}
