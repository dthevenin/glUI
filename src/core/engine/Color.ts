/*
  COPYRIGHT NOTICE
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


const MATCH_COLOR_RGB = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
const MATCH_COLOR_RGBA = /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d?\.\d+)\)/;

/**
 *  The Color class
 *
*/
export class Color {
  static transparent: Color = new Color(0, 0, 0, 0);
  static black: Color = new Color(0, 0, 0, 1.0);
  static white: Color = new Color(255, 255, 255, 1.0);
  static red: Color = new Color(255, 0, 0, 1);
  static green: Color = new Color(0, 255, 0, 1);
  static blue: Color = new Color(0, 0, 255, 1);
  static yellow: Color = new Color(255, 255, 0, 1);
  static lightGrey: Color = new Color(200, 200, 200, 1.0);
  static pink: Color = new Color(255, 105, 180, 1.0);
  static default = Color.transparent;

  public __gl_array: Float32Array;
  private r: number = 1;
  private g: number = 1;
  private b: number = 1;
  private a: number = 1;

  constructor(r?: number, g?: number, b?: number, a?: number) {
    this.__gl_array = new Float32Array(4);

    this.setRGBAColor(r, g, b, a);
  }

  setRGBAColor(r: number = 255, g: number = 255, b: number = 255, a: number = 1): void {
    if (r < 0 || r > 255) r = 255;
    if (g < 0 || g > 255) g = 255;
    if (b < 0 || b > 255) b = 255;
    if (a < 0 || a > 1) a = 1;

    r = r / 255;
    g = g / 255;
    b = b / 255;

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    this.setColorArray(r, g, b, a);
  }

  private setColorArray(m11: number, m12: number, m13: number, m14: number): void {
    const m = this.__gl_array;
    m[0] = m11; m[1] = m12; m[2] = m13; m[3] = m14;
  }

  copy(color: Color): void {

    var
      m = this.__gl_array,
      c_m = color.__gl_array

    color.r = this.r;
    color.g = this.g;
    color.b = this.b;
    color.a = this.a;

    c_m.set(m);
  }

  getRgbaString(): string {
    return "rgba(" + (this.r * 255) + ","
      + (this.g * 255) + "," + (this.b * 255)
      + "," + this.a + ")";
  }

  setRgbString(str: string): void {
    const match = MATCH_COLOR_RGB.exec(str);
    if (match !== null) {
      this.setRGBAColor(
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
        1);
    }
  }

  setRgbaString(str: string): void {
    const match = MATCH_COLOR_RGBA.exec(str);
    if (match !== null) {
      this.setRGBAColor(
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
        parseFloat(match[4]));
    }
  }
}
