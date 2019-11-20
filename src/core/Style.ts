import { ObjectConfig } from "./GLObject";
import { Color } from "./engine/Color";
import { GLObject } from "./GLObject";
import * as util from "../util";
import { getGLContext } from "./engine";
import { gl_free_texture_image, gl_get_texture_from_image_url } from "./texture_util";
import { glAddInitFunction } from "./engineInit";

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
 *  The Style class
 *
*/

const Styles: Style[] = [];

export class Style extends GLObject {
  public _opacity: number = 1;
  public _background_color: any = null;
  public _background_image: any = null;
  public _background_image_uv: Float32Array;
  public _color: Color;
  public _font_family: string = 'arial';
  public _font_size: number = 12;
  public _text_align: CanvasTextAlign = 'left';
  public _text_transform: any = null;
  public _font_weight: string = 'normal';
  public _shadow_color: any = null;
  public _shadow_offset: Float32Array;
  public _shadow_blur: number = 10;
  
  public __gl_texture_bck_image: WebGLTexture;
  public __gl_bck_image_uv_buffer: WebGLBuffer;

  constructor(config?: ObjectConfig) {
    super(config);

    this._background_image_uv = new Float32Array([0, 1, 0, 0, 1, 1, 1, 0]);
    this._shadow_offset = new Float32Array([0, 0]);
    this._color = Color.black;
    Styles.push(this);
  }

  static restoreGLContext() {
    let i = 0;
    const l = Styles.length;
    const gl_ctx = getGLContext();

    for (; i < l; i++) {
      let style = Styles[i];
      if (style) {
        if (style.__gl_texture_bck_image) {
          gl_ctx.deleteTexture(style.__gl_texture_bck_image);
          style.__gl_texture_bck_image = gl_ctx.createTexture();
        }
      }
    }
  }

  static createObjectFromStringStyle(str: string): Style {
    var obj = new Style();
    obj.parseStringStyle(str);
    return obj;
  };

  /**
   * @protected
   * @function
   */
  destructor() {
    if (this.__gl_texture_bck_image) {
      gl_free_texture_image(this._background_image);
      this.__gl_texture_bck_image = null;
    }
    
    Styles.remove (this);
    
//     if (this.__gl_bck_image_uv_buffer) {
//       gl_ctx.deleteBuffer (this.__gl_bck_image_uv_buffer);
//       this.__gl_bck_image_uv_buffer = null;
//     }

    super.destructor();
  }
  
  clone(): Style {
    const obj = new Style();
    this.copy(obj)

    return obj;
  }
  
  copy(style: Style): void {
    style._opacity = this._opacity;
    style._font_family = this._font_family;
    style._font_size = this._font_size;
    style._text_align = this._text_align;
    style._text_transform = this._text_transform;


    if (this._background_color) {
      if (!style._background_color) {
        style._background_color = new Color();
      }
      this._background_color.copy(style._background_color);
    }
    
    if (this._color) {
      if (!style._color) {
        style._color = new Color();
      }
      this._color.copy(style._color);
    }
    
    if (this._background_image) {
      style.backgroundImage = this._background_image;
    }
    
    if (this._background_image_uv) {
      // TODO memory leak
      style._background_image_uv = new Float32Array(this._background_image_uv);
    }
  }
  
  parseStringStyle(str: string): void {
    function clean(css: string): string {
      return css
      .replace(/\/\*[\W\w]*?\*\//g, "") // remove comments
      .replace(/^\s+|\s+$/g, "") // remove trailing spaces
      .replace(/\s*([:;{}])\s*/g, "$1") // remove trailing separator spaces
      .replace(/\};+/g, "}") // remove unnecessary separators
      .replace(/([^:;{}])}/g, "$1;}") // add trailing separators
    }

    function refine(css, isBlock) {
      return /^@/.test(css) ? (css = css.split(" ")) && {
        "identifier": css.shift().substr(1).toLowerCase(),
        "parameters": css.join(" ")
      } : (isBlock ? /:$/ : /:/).test(css) ? (css = css.split(":")) && {
        "property": css.shift(),
        "value": css.join(":")
      } : css;
    }

    function parse(css, regExp, object) {
      for (var m; (m = regExp.exec(css)) != null;) {
        if (m[2] == "{") object.block.push(object = {
          "selector": refine(m[1], true),
          "block": [],
          "parent": object
        });
        else if (m[2] == "}") object = object.parent;
        else if (m[2] == ";") object.block.push(refine(m[1]));
      }
    }

    var parseCSS = function (css) {
      return parse(clean(css), /([^{};]*)([;{}])/g, css = { block: [] }), css;
    };
  
    var css = parseCSS (str).block, self = this;
    css.forEach ( (block) => {
      var p = util.camelize (block.property);
      const value: string = block.value;
    
      switch (p) {
        case "backgroundColor":
        case "color":
          var c;
        
          if (Color[value]) {
            c = Color[value];
          }
          else if (value.indexOf ("rgb(") === 0) {
            c = new Color ();
            c.setRgbString (value);
          }
          else if (value.indexOf ("rgba(") === 0) {
            c = new Color ();
            c.setRgbaString (value);
          }
          else {
            c = new Color(value);
          }
          self [p] = c;
          break;

        case "fontFamily":
        case "fontSize":
        case "textAlign":
        case "textWeight":
          this[p] = value;
          break;
      }
    });
  }

  /**
   * Change view opacity.
   * value is include in this range [0, 1]
   * @name Style#opacity
   * @type {number}
   */
  set opacity(v: number) {
    if (v < 0 || v > 1) return;

    this._opacity = v;
    // BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {number}
   */
  get opacity(): number {
    return this._opacity;
  }

  /**
   * @name Style#backgroundColor
   * @type {Color}
   */
  set backgroundColor(v: Color) {
    this._background_color = v;
    // BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {Color}
   */
  get backgroundColor(): Color {
    return this._background_color;
  }

  /**
   * @name Style#color
   * @type {Color}
   */
  set color(v: Color) {
    this._color = v;
    // BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {Color}
   */
  get color(): Color {
    return this._color;
  }

  /**
   * Change view fontFamily.
   * @name Style#fontFamily
   * @type {String}
   */
  set fontFamily(v: string) {
    this._font_family = v;
    // BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {String}
   */
  get fontFamily(): string {
    return this._font_family;
  }

  /**
   * Change view fontSize.
   * @name Style#fontSize
   * @type {String}
   */
  set fontSize(v: number) {
    this._font_size = v;
    // BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {String}
   */
  get fontSize(): number {
    return this._font_size;
  }

  /**
   * Change view fontWeight.
   * @name Style#fontWeight
   * @type {String}
   */
  set fontWeight(v: string) {
    if (v != "normal" && v != "bold" && v != "bolder" && v != "lighter" &&
      v != "100" && v != "200" && v != "300" && v != "400" && v != "500" &&
      v != "600" && v != "700" && v != "800" && v != "900") {
      return;
    }
    this._font_weight = v;
    // BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {String}
   */
  get fontWeight(): string {
    return this._font_weight;
  }

  /**
   * Change view textAlign.
   * @name Style#textAlign
   * @type {String}
   */
  set textAlign(v: CanvasTextAlign) {
    this._text_align = v;
    // BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {String}
   */
  get textAlign(): CanvasTextAlign {
    return this._text_align;
  }

  /**
   * Change view fontFamily.
   * @name Style#textTransform
   * @type {String}
   */
  set textTransform(v: string) {
    this._text_transform = v;
    // BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {String}
   */
  get textTransform(): string {
    return this._text_transform;
  }

  /**
   * Set the image url
   * @name Style#src 
   * @type {string}
   */
  set backgroundImage(v: string) {
    this._background_image = v;

    if (!v) {
      if (this.__gl_texture_bck_image) {
        gl_free_texture_image(this._background_image);
        this.__gl_texture_bck_image = null;
      }
    }
    else {
      var self = this;
      gl_get_texture_from_image_url(
        self._background_image,  (texture: WebGLTexture, size: number[]) => {
          self.__gl_texture_bck_image = texture;

          //             if (!self.__gl_bck_image_uv_buffer) {
          //               self.backgroundImageUV = [0,1, 0,0, 1,1, 1,0];
          //             }
        }
      )
    }
    // BaseView.__should_render = true;
  }

  /**
   * Get the image url
   * @ignore
   * @return {string}
   */
  get backgroundImage(): string {
    return this._background_image;
  }

  /**
   * Change view shadow.
   * @name Style#shadow
   * @type {Color}
   */
  set shadowColor(v: Color) {
    this._shadow_color = v;
    // BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {String}
   */
  get shadowColor(): Color {
    return this._shadow_color;
  }

  /**
   * Change view shadow.
   * @name Style#shadow
   * @type {Array}
   */
  set shadowOffset(v: number[]) {
    if (v.length !== 2) return;
    this._shadow_offset[0] = v[0];
    this._shadow_offset[1] = v[0];
    // BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {String}
   */
  get shadowOffset(): number[] {
    return [this._shadow_offset[0], this._shadow_offset[1]];
  }

  /**
   * Change view shadow.
   * @name Style#shadow
   * @type {number}
   */
  set shadowBlur(v: number) {
    this._shadow_blur = v;
    // BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {number}
   */
  get shadowBlur(): number {
    return this._shadow_blur;
  }

  /**
   * Set the image url
   * @name Style#src 
   * @type {string}
   */
  set backgroundImageUV(v: number[]) {
    if (v.length != 8) { return; }
    this._background_image_uv = new Float32Array(v);

    //       var UV = new Float32Array (v);
    // 
    //       if (!this.__gl_bck_image_uv_buffer) {
    //         this.__gl_bck_image_uv_buffer = gl_ctx.createBuffer ();
    //       }
    // 
    //       gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, this.__gl_bck_image_uv_buffer);
    //       console.log (UV)
    //       gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, UV, gl_ctx.STATIC_DRAW);

    // BaseView.__should_render = true;
  }

  /**
   * Get the image url
   * @ignore
   * @return {string}
   */
  get backgroundImageUV(): number[] {
    return [
      this._background_image_uv[0],
      this._background_image_uv[1],
      this._background_image_uv[2],
      this._background_image_uv[3],
      this._background_image_uv[4],
      this._background_image_uv[5],
      this._background_image_uv[6],
      this._background_image_uv[7],
    ];
  }
}

export let _default_style: Style;

function initDefaultStyle () {
  _default_style = new Style ();
  _default_style.backgroundColor = Color.default;
  _default_style.color = Color.black;
}

glAddInitFunction(initDefaultStyle);
