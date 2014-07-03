
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

function __create_multiline_text (ctx, text, maxWidth, lines) {

  var currentText = "";
  var futureText, futureFutureText;
  var subWidth = 0;
  var maxLineWidth = 0;
  
  var wordArray = text.split (" ");
  var wordsInCurrent, wordArrayLength;
  wordsInCurrent = wordArrayLength = wordArray.length;
  var index = 0, index_c, l_text;
  
  while (index < wordArrayLength) {
    var text = wordArray[index];
    if (currentText != "") {
      futureText = currentText + " " + text;
    }
    else {
      futureText = text;
    }
    if (ctx.measureText(futureText).width < maxWidth) {
      currentText = futureText;
      index ++;
    }
    else {
      if (ctx.measureText(text).width < maxWidth) {
        lines.push (currentText);
        currentText = text;
        index ++;
      } else {
        // Caesura management
        index_c = 0;
        l_text = text.length;
        futureText = currentText + " ";
        while (index_c < l_text) {
          futureFutureText = futureText + text [index_c];
          if (ctx.measureText(futureFutureText).width >= maxWidth) {
            lines.push (futureText);
            currentText = text.substr (index_c);
            index ++;
            break;
          }
          else {
            futureText = futureFutureText;
            index_c ++;
          }
        }
      }
    }
  }
  
  if (currentText) {
    if (ctx.measureText (currentText).width < maxWidth) {
      lines.push (currentText);
    }
    else {
      // Caesura management
      index_c = 0;
      l_text = currentText.length;
      futureText = "";
      while (index_c < l_text) {
        futureFutureText = futureText + currentText [index_c];
        if (ctx.measureText (futureFutureText).width >= maxWidth) {
          lines.push (futureText);
          futureText = currentText [index_c];
          index_c ++;
        }
        else {
          futureText = futureFutureText;
          index_c ++;
        }
      }
      if (futureText) {
        lines.push (futureText);
      }
    }
    currentText = "";
  }
  
  // Return the maximum line width
  return 0;//maxLineWidth;
}

function _create_multiline_text (ctx, text, maxWidth, lines) {

  var multilines = text.split ("\n"), maxLineWidth = 0;
  
  multilines.forEach (function (text) {
    maxLineWidth = Math.max (maxLineWidth,
      __create_multiline_text (ctx, text, maxWidth, lines));
  });
  
  return maxLineWidth;
}

function __render_text_into_canvas_ctx (text, ctx, width, height, style) {
  ctx.clearRect (0, 0, width, height);
  var
    color = style.color,
    lines = [],
    offsetY;
  
  if (!color) color = Color.white;
  
  var
    font = style.fontWeight + " " + 
      (style._font_size * gl_device_pixel_ratio) + "px " +
      style.fontFamily;
      
  // This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
  ctx.fillStyle = color.getRgbaString ();
  ctx.strokeStyle = color.getRgbaString ();
  // This determines the size of the text and the font family used
  ctx.font = font;
  
  ctx.textAlign = style.textAlign;
  ctx.textBaseline = "middle";

  _create_multiline_text (ctx, text, width, lines);
  offsetY = height/2 - (lines.length - 1) * (style._font_size * gl_device_pixel_ratio) / 2;
  
  lines.forEach (function (line, i) {
    var dy = i * (style._font_size * gl_device_pixel_ratio) + offsetY;
    switch (style.textAlign) {
      case "left":
        ctx.fillText (line, 0, dy);
      break;

      case "right":
        var textWidth = ctx.measureText (line).width;
        ctx.fillText (line, width, dy);
      break;

      case "center":
        ctx.fillText (line, width/2 , dy);
      break;
    }
  });
  
  return lines.length * style._font_size;
}

function __copy_image_into_webgl_texture (canvas, texture) {

  if (!texture) {
    texture = gl_ctx.createTexture ();
  }
  
  gl_ctx.pixelStorei (gl_ctx.UNPACK_FLIP_Y_WEBGL, false);
  gl_ctx.pixelStorei (gl_ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);  
  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, texture);

  gl_ctx.texImage2D (
    gl_ctx.TEXTURE_2D, 0,
    gl_ctx.RGBA, gl_ctx.RGBA,
    gl_ctx.UNSIGNED_BYTE, canvas
  );
  
  function isPowerOfTwo (x) {
    return (x !== 0) && ((x & (x - 1)) === 0);
  }

  // POT images
  if (isPowerOfTwo (canvas.width) && isPowerOfTwo (canvas.height)) {
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MAG_FILTER, gl_ctx.LINEAR);
    
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.NEAREST_MIPMAP_LINEAR);

    gl_ctx.generateMipmap (gl_ctx.TEXTURE_2D);
  }
  // NPOT images
  else {
    //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);
    //Prevents s-coordinate wrapping (repeating).
    gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_S, gl_ctx.CLAMP_TO_EDGE);
    //Prevents t-coordinate wrapping (repeating).
    gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_T, gl_ctx.CLAMP_TO_EDGE);
  }
  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, null);
  
  View.__should_render = true;
  
  return texture
}

var __text_management = {
  /**
   *
   * @protected
   * @type {CanvasRenderingContext2D|null}
   */
  __text_canvas_ctx: null,
  
  /**
   *
   * @protected
   * @type {HTMLCanvasElement|null}
   */
  __text_canvas_node: null,

  __init_text_view : function (size)
  {
    this.__text_canvas_node = create2DCanvas (size [0], size [1]);
    this.__text_canvas_ctx = this.__text_canvas_node.getContext ('2d');
  },

  __update_text_view : function (size)
  {
    this.__text_canvas_node.style.width = size [0] + "px";
    this.__text_canvas_node.style.height = size [1] + "px";
    this.__text_canvas_node.width = size [0] * gl_device_pixel_ratio;
    this.__text_canvas_node.height = size [1]* gl_device_pixel_ratio;
  },

  __update_text : function (text, autoresize)
  {
    if (!this.__text_canvas_node.width ||
        !this.__text_canvas_node.height) {
     
      var self = this;
      vs.requestAnimationFrame (function () {
        self.__update_text (text);
      });
      return;
    }
        
    var text_height = __render_text_into_canvas_ctx (
      text,
      this.__text_canvas_ctx,
      this._size [0] * gl_device_pixel_ratio,
      this._size [1] * gl_device_pixel_ratio,
      this._style
    );
    
    if (autoresize && text_height > this._size [1]) {
      this._size [1] = text_height;
     
      this._updateSizeAndPos ();

      this.__update_text_view (this._size);
      this.__update_text (this._text, false);      
    }
    else {
      this.__update_texture ();
    }
  },
  
  __update_texture : function () {
    update_texture (this, this.__text_canvas_node);
  }
}

/**
 * A vs.gl.Text.
 *
 * @class
 * A vs.gl.Text component displays a unselectable text.
 *
 @constructor
 * @extends vs.ui.View
 * @name vs.gl.Text
 */
function Text (config)
{
  this.parent = View;
  this.parent (config);
  this.constructor = Text;
}

Text.prototype = {
    
  /**
   * The text value
   * @protected
   * @type {string}
   */
  _text: "",

  /**
   * @protected
   * @function
   */
  initComponent : function ()
  {
    View.prototype.initComponent.call (this);
    
    this._style.backgroundColor = Color.transparent;

    var size = this.__config__.size;
    if (!size) {
      size = [20, 20];
      this.__config__.size = size;
    }
    
    this.__init_text_view (size);

    if (this._text != "") {
      this.__update_text (this._text, true);
    }
    
    var self = this;
    this.addEventListener ('webglcontextrestored', function () {
      update_texture (self, self.__text_canvas_node);
    });
  },

  refresh: function () {
    View.prototype.refresh.call (this);
    // force redraw
    
    if (this._text != "") {
      this.__update_text_view (this._size);
      this.__update_text (this._text, true);
    }
  },

  redraw : function (clb)
  {
    View.prototype.redraw.call (this);
    
    this.__update_text (this._text, true);
    
    if (clb) clb ();
  }
};
util.extend (Text.prototype, __text_management);
util.extendClass (Text, View);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (Text, {
  "text": {

    /**
     * Set the text value
     * @name vs.gl.Text#name
     * @param {string} v
     */
    set : function (v)
    {
      if (v === null || typeof (v) === "undefined") { v = ''; }
      else if (util.isNumber (v)) { v = '' + v; }
      else if (!util.isString (v))
      {
        if (!v.toString) { return; }
        v = v.toString ();
      }
    
      if (v == this._text) return;
     
      this._text = v;
      this.__update_text (this._text, true);
    },

    /**
     * get the text value
     * @ignore
     * @type {string}
     */
    get : function ()
    {
      return this._text;
    }
  },

  "size": {
   /** 
     * Getter|Setter for size. Gives access to the size of the vs.gl.Canvas
     * @name vs.gl.Text#size 
     *
     * @type {Array.<number>}
     */ 
    set : function (v)
    {
      if (!v) { return; } 
      if (!util.isArray (v) || v.length !== 2) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber(v[1])) { return; }

      this._size [0] = v [0];
      this._size [1] = v [1];
    
      this._updateSizeAndPos ();
      
      this.__update_text_view (this._size);
      if (this._text != "") {
        this.__update_text (this._text, true);
      }
    },

    /**
     * @ignore
     * @type {Array.<number>}
     */
    get : function ()
    {
      return this._size;
    }
  }
});
