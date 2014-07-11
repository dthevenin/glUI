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


/**
 *  The Color class
 *
*/
function Color (r, g, b, a) {
  this.__gl_array = new Float32Array (4);
  
  this.setRGBAColor (r, g, b, a);
}

Color.prototype.setRGBAColor = function (r, g, b, a) {
  if (!util.isNumber (r) || r < 0 || r > 255) r = 255;
  if (!util.isNumber (g) || g < 0 || g > 255) g = 255;
  if (!util.isNumber (b) || b < 0 || b > 255) b = 255;
  if (!util.isNumber (a) || a < 0 || a > 1) a = 1;

  r = r / 255;
  g = g / 255;
  b = b / 255;

  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;

  this.setColorArray (r, g, b, a);
}

Color.prototype.setColorArray = function (m11, m12, m13, m14) {
  var m = this.__gl_array;  
  m[0] = m11; m[1] = m12; m[2] = m13; m[3] = m14;
}

Color.prototype.copy = function (color) {

  var
    m = this.__gl_array,
    c_m = color.__gl_array
  
  color.r = this.r;
  color.g = this.g;
  color.b = this.b;
  color.a = this.a;

  c_m.set (m);
}

Color.prototype.getRgbaString = function () {
  return "rgba(" + (this.r * 255) + ","
    + (this.g * 255) + "," + (this.b * 255)
    + "," + this.a + ")";
}

Color.prototype.setRgbString = function (str) {
  var matchColors = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
  var match = matchColors.exec (str);
  if (match !== null) {
    this.setRGBAColor (
      parseInt (match[1], 10),
      parseInt (match[2], 10),
      parseInt (match[3], 10),
      1);
  }
}

Color.prototype.setRgbaString = function (str) {
  var matchColors = /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d?\.\d+)\)/;
  var match = matchColors.exec (str);
  if (match !== null) {
    this.setRGBAColor (
      parseInt (match[1], 10),
      parseInt (match[2], 10),
      parseInt (match[3], 10),
      parseFloat (match[4], 10));
  }
}

function initDefaultColors () {
  Color.transparent = new Color (0, 0, 0, 0);
  Color.black = new Color (0, 0, 0, 1.0);
  Color.white = new Color (255, 255, 255, 1.0);
  Color.red = new Color (255, 0, 0, 1);
  Color.green = new Color (0, 255, 0, 1);
  Color.blue = new Color (0, 0, 255, 1);
  Color.yellow = new Color (255,255,0, 1);
  Color.lightGrey = new Color (200, 200, 200, 1.0);
  Color.pink = new Color (255, 105, 180, 1.0);

  Color.default = Color.transparent;
}

glAddInitFunction (initDefaultColors);
