import { Color } from "../engine/Color";
import { gl_device_pixel_ratio, create2DCanvas } from "../engineInit";
import { View } from "./index";
import { vec2 } from "gl-matrix";
import { update_texture } from "../spriteUtil";
import { __render_text_into_canvas_ctx } from "./helpers";

/**
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
 * A Text.
 *
 * @class
 * A Text component displays a unselectable text.
 *
 @constructor
 * @extends vs.ui.View
 * @name Text
 */
export class Text extends View {
    
  /**
   * The text value
   * @protected
   * @type {string}
   */
  protected _text:string = "";

  /**
 *
 * @protected
 * @type {CanvasRenderingContext2D|null}
 */
  protected __text_canvas_ctx: CanvasRenderingContext2D;

  /**
   *
   * @protected
   * @type {HTMLCanvasElement|null}
   */
  protected __text_canvas_node: HTMLCanvasElement;

  protected __init_text_view(): void {
    this.__text_canvas_node = create2DCanvas(this._size[0], this._size[1]);
    this.__text_canvas_ctx = this.__text_canvas_node.getContext('2d');
  }

  protected __update_text_view(size: vec2) {
    this.__text_canvas_node.style.width = size[0] + "px";
    this.__text_canvas_node.style.height = size[1] + "px";
    this.__text_canvas_node.width = size[0] * gl_device_pixel_ratio;
    this.__text_canvas_node.height = size[1] * gl_device_pixel_ratio;
  }

  protected __update_text(text: string, autoresize: boolean = false) {
    if (!this.__text_canvas_node.width ||
      !this.__text_canvas_node.height) {

      requestAnimationFrame(() => this.__update_text(text, autoresize));
      return;
    }

    const text_height = __render_text_into_canvas_ctx(
      text,
      this.__text_canvas_ctx,
      this._size[0] * gl_device_pixel_ratio,
      this._size[1] * gl_device_pixel_ratio,
      this._style
    );

    if (autoresize && text_height > this._size[1]) {
      this._size[1] = text_height;

      this._updateSizeAndPos();

      this.__update_text_view(this._size);
      this.__update_text(this._text, false);
    }
    else {
      this.__update_texture();
    }
  }

  protected __update_texture() {
    update_texture(this, this.__text_canvas_node);
  }

  /**
   * @protected
   * @function
   */
  initComponent(): void {
    super.initComponent();;
    
    this._style.backgroundColor = Color.transparent;

    // var size = this.__config__.size;
    // if (!size) {
    //   size = [20, 20];
    //   this.__config__.size = size;
    // }
    
    this.__init_text_view();

    if (this._text != "") {
      this.__update_text(this._text, true);
    }
    
    this.addEventListener('webglcontextrestored', () => {
      update_texture(this, this.__text_canvas_node);
    });
  }

  refresh():void {
    super.refresh();
    // force redraw
    
    if (this._text) {
      this.__update_text_view(this._size);
      this.__update_text(this._text, true);
    }
  }

  redraw(clb?: () => void): void{
    super.redraw(clb);
  
    this.__update_text(this._text, true);
    
    if (clb) clb ();
  }

  /**
   * Set the text value
   * @name Text#name
   * @param {string} v
   */
  set text(v: string) {
    if (v == this._text) return;

    this._text = v;
    this.__update_text(this._text, true);
  }

  /**
   * get the text value
   * @ignore
   * @type {string}
   */
  get text(): string {
    return this._text;
  }

  /** 
    * Getter|Setter for size. Gives access to the size of the Canvas
    * @name Text#size 
    *
    * @type {Array.<number>}
    */
  set size(v: number[]) {
    super.size = v;
    this.__update_text_view(this._size);
    if (this._text !== '') {
      this.__update_text(this._text, true);
    }
  }
};
