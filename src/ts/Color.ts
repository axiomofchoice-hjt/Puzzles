export class Color {
  r: number;
  g: number;
  b: number;
  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  static rgb(r: number, g: number, b: number): Color {
    return new Color(r, g, b);
  }
  get isLight() {
    return this.r + this.g + this.b !== 255 * 3;
  }
  toDark(k: number) {
    return Color.rgb(
      Math.floor(255 - (255 - this.r) * k),
      Math.floor(255 - (255 - this.g) * k),
      Math.floor(255 - (255 - this.b) * k),
    );
  }
  toLight(k: number) {
    return Color.rgb(
      Math.floor(this.r * k),
      Math.floor(this.g * k),
      Math.floor(this.b * k),
    );
  }
  toString(a: number): string {
    let toHex = (x: number) => { return (256 + Math.round(x)).toString(16).slice(1); };
    return '#' + toHex(this.r) + toHex(this.g) + toHex(this.b) + toHex(Math.floor(a * 255.9));
  }
  clone(): Color {
    return new Color(this.r, this.g, this.b);
  }
  equal(b: Color): boolean {
    return this.r == b.r && this.g == b.g && this.b == b.b;
  }
  static white = Color.rgb(255, 255, 255);
  static black = Color.rgb(0, 0, 0);
  static grey = Color.rgb(211, 211, 211);
  static blue = Color.rgb(0, 191, 255);
  static red = Color.rgb(255, 99, 71);
  static yellow = Color.rgb(255, 215, 0);
  static green = Color.rgb(120, 190, 33);
  static purple = Color.rgb(221, 51, 221);
  static orange = Color.rgb(255, 140, 0);
}
