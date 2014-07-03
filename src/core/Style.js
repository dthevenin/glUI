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
function Style (config)
{
  this.parent = GLObject;
  this.parent (config);
  this.constructor = Style;
  
  this._background_image_uv = new Float32Array ([0,1, 0,0, 1,1, 1,0]);
  this._shadow_offset = new Float32Array ([0,0]);
  this._color = Color.black;
  Styles.push (this);
}

var Styles = [];

Style.prototype = {
  _opacity : 1,
  _background_color: null,
  _background_image: null,
  _background_image_uv: null,
  _color: null,
  _font_family: "arial",
  _font_size: 12,
  _text_align: "left",
  _text_transform: null,
  _font_weight: "normal",
  _shadow_color: null,
  _shadow_offset: null,
  _shadow_blur: 10,
  
  __gl_texture_bck_image: null,
  __gl_bck_image_uv_buffer: null,

  /**
   * @protected
   * @function
   */
  destructor : function ()
  {
    if (this.__gl_texture_bck_image) {
      gl_free_texture_image (this._background_image);
      this.__gl_texture_bck_image = null;
    }
    
    Styles.remove (this);
    
//     if (this.__gl_bck_image_uv_buffer) {
//       gl_ctx.deleteBuffer (this.__gl_bck_image_uv_buffer);
//       this.__gl_bck_image_uv_buffer = null;
//     }

    core.Object.prototype.destructor.call (this);
  },
  
  clone : function () {
    var obj = new Style (this);
    
    return obj;
  },
  
  copy : function (style) {
    style._opacity = this._opacity;
    style._font_family = this._font_family;
    style._font_size = this._font_size;
    style._text_align = this._text_align;
    style._text_transform = this._text_transform;


    if (this._background_color) {
      // TODO memory leak
      style._background_color = new Color ();
      this._background_color.copy (style._background_color);
    }
    
    if (this._color) {
      // TODO memory leak
      style._color = new Color ();
      this._color.copy (style._color);
    }
    
    if (this._background_image) {
       style.backgroundImage = this._background_image;
    }
    
    if (this._background_image_uv) {
      // TODO memory leak
      style._background_image_uv = new Float32Array (this._background_image_uv);
    }
  },
  
  parseStringStyle: function (str) {
    function clean(css) {
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
    css.forEach (function (block) {
      var p = util.camelize (block.property);
      var value = block.value;
    
      switch (p) {
        case "backgroundColor":
        case "color":
          var c;
        
          if (Color [value]) {
            c = Color [value];
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
            c = new Color (value);
          }
          self [p] = c;
          break;

        case "fontFamily":
        case "fontSize":
        case "textAlign":
        case "textWeight":
          self [p] = value;
          break;
      }
    });
  }
}

util.addClassProperties (Style, {

  'opacity': {
    /**
     * Change view opacity.
     * value is include in this range [0, 1]
     * @name Style#opacity
     * @type {number}
     */
    set : function (v) {
      if (!util.isNumber (v)) return;
      if (v < 0 || v > 1) return;

      this._opacity = v;
      View.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {number}
     */
    get : function () {
      return this._opacity;
    }
  },
  
  'backgroundColor': {
    /**
     * @name Style#backgroundColor
     * @type {Color}
     */
    set : function (v)
    {
      if (!(v instanceof Color)) return; 
      this._background_color = v;
      View.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {Color}
     */
    get : function () {
      return this._background_color;
    }
  },
  
  'color': {
    /**
     * @name Style#color
     * @type {Color}
     */
    set : function (v)
    {
      if (!(v instanceof Color)) return; 
      this._color = v;
      View.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {Color}
     */
    get : function () {
      return this._color;
    }
  },
  
  'fontFamily': {
    /**
     * Change view fontFamily.
     * @name Style#fontFamily
     * @type {String}
     */
    set : function (v) {
      if (!util.isString (v)) return;
      this._font_family = v;
      View.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._font_family;
    }
  },
  
  'fontSize': {
    /**
     * Change view fontSize.
     * @name Style#fontSize
     * @type {String}
     */
    set : function (v) {
      if (util.isString (v)) v = parseInt (v, 10);
      if (!util.isNumber (v)) return;
      this._font_size = v;
      View.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._font_size;
    }
  },
  
  'fontWeight': {
    /**
     * Change view fontWeight.
     * @name Style#fontWeight
     * @type {String}
     */
    set : function (v) {
      if (v != "normal" && v != "bold" && v != "bolder" && v != "lighter" &&
          v != "100" && v != "200" && v != "300" && v != "400" && v != "500" &&
          v != "600" && v != "700" && v != "800" && v != "900") {
        return;   
      }
      this._font_weight = v;
      View.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._font_weight;
    }
  },
  
  'textAlign': {
    /**
     * Change view textAlign.
     * @name Style#textAlign
     * @type {String}
     */
    set : function (v) {
      if (!util.isString (v)) return;
      this._text_align = v;
      View.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._text_align;
    }
  },
  
  'textTransform': {
    /**
     * Change view fontFamily.
     * @name Style#textTransform
     * @type {String}
     */
    set : function (v) {
      if (!util.isString (v)) return;
      this._text_transform = v;
      View.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._text_transform;
    }
  },

  'backgroundImage': {
    /**
     * Set the image url
     * @name Style#src 
     * @type {string}
     */
    set : function (v) {
      if (!util.isString (v)) { return; }
      
      this._background_image = v;
      
      if (!v) {
        if (this.__gl_texture_bck_image) {
          gl_free_texture_image (this._background_image);
          this.__gl_texture_bck_image = null;
        }
      }
      else {
        var self = this;
        gl_get_texture_from_image_url (
          self._background_image, function (texture) {
            self.__gl_texture_bck_image = texture;
            
//             if (!self.__gl_bck_image_uv_buffer) {
//               self.backgroundImageUV = [0,1, 0,0, 1,1, 1,0];
//             }
          }
        )
      }
      View.__should_render = true;
    },

 
    /**
     * Get the image url
     * @ignore
     * @return {string}
     */
    get : function () {
      return this._background_image;
    }
  },
  
  'shadowColor': {
    /**
     * Change view shadow.
     * @name Style#shadow
     * @type {Color}
     */
    set : function (v) {
      if (!(v instanceof Color)) return; 
      this._shadow_color = v;
      View.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._shadow_color;
    }
  },
  
  'shadowOffset': {
    /**
     * Change view shadow.
     * @name Style#shadow
     * @type {Array}
     */
    set : function (v) {
      if (!util.isArray (v) || v.length !== 2) return;
      this._shadow_offset[0] = v[0];
      this._shadow_offset[1] = v[0];
      View.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._shadow_offset;
    }
  },
  
  'shadowBlur': {
    /**
     * Change view shadow.
     * @name Style#shadow
     * @type {String}
     */
    set : function (v) {
      if (!util.isNumber (v)) return;
      this._shadow_blur = v;
      View.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._shadow_blur;
    }
  },
  
  'backgroundImageUV': {
    /**
     * Set the image url
     * @name Style#src 
     * @type {string}
     */
    set : function (v) {
      if (!v) { return; }
      if (!util.isArray (v) || v.length != 8) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber (v[1]) ||
          !util.isNumber (v[2]) || !util.isNumber (v[3]) ||
          !util.isNumber (v[4]) || !util.isNumber (v[5]) ||
          !util.isNumber (v[6]) || !util.isNumber (v[7])) { return; }
      
      this._background_image_uv = new Float32Array (v);
      
//       var UV = new Float32Array (v);
// 
//       if (!this.__gl_bck_image_uv_buffer) {
//         this.__gl_bck_image_uv_buffer = gl_ctx.createBuffer ();
//       }
// 
//       gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, this.__gl_bck_image_uv_buffer);
//       console.log (UV)
//       gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, UV, gl_ctx.STATIC_DRAW);
      View.__should_render = true;
    },
  
    /**
     * Get the image url
     * @ignore
     * @return {string}
     */
    get : function () {
      return this._background_image_uv;
    }
  }
});

var _default_style;

function initDefaultStyle () {
  _default_style = new Style ();
  _default_style.backgroundColor = Color.default;
  _default_style.color = Color.black;
}

glAddInitFunction (initDefaultStyle);

Style.restoreGLContext = function () {
  var style, i = 0, l = Styles.length;
  
  for (; i < l; i++) {
    style = Styles [i];
    if (style) {
      if (style.__gl_texture_bck_image) {
        gl_ctx.deleteTexture (style.__gl_texture_bck_image);
        style.__gl_texture_bck_image = gl_ctx.createTexture ();
      }
    }
  }
}
