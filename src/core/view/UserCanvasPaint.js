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
 
 Use code from Canto.js Copyright 2010 David Flanagan
*/

View.NO_USER_PAINT = 0;
View.CANVAS_USER_PAINT = 1
View.SHADER_USER_PAINT = 2;

View.prototype.activateUserDraw = function (mode, options) {
  switch (mode) {
  case View.CANVAS_USER_PAINT:
    this.__user_paint_mode = View.CANVAS_USER_PAINT;
    break;
    
  case View.SHADER_USER_PAINT:
    this.__user_paint_mode = View.SHADER_USER_PAINT;
    break;
    
  case View.CANVAS_USER_PAINT + View.SHADER_USER_PAINT:
    this.__user_paint_mode = View.CANVAS_USER_PAINT + View.SHADER_USER_PAINT;
    break;

  default:
    this.__user_paint_mode = View.NO_USER_PAINT;
  }
  
  if (this.__user_paint_mode & View.CANVAS_USER_PAINT) {
    this.__canvas_node = create2DCanvas (this._size [0], this._size [1]);
    this.__canvas_ctx = this.__canvas_node.getContext ('2d');
    
    if (options && options.draw) {
      this.draw = options.draw.bind (this);
    }
    
    if (this.draw) {
      this.draw (this.__canvas_ctx,
        0, 0,
        this._size [0] * gl_device_pixel_ratio,
        this._size [1] * gl_device_pixel_ratio
      )
    }

    var self = this;
    this.addEventListener ('webglcontextrestored', function () {
      update_texture (self, self.__canvas_node);
    });
    
    var _updateSize = this._updateSize;
    
    // This function cost a lot!
    this._updateSize = function (sizeUpdated) {
      _updateSize.call (this, sizeUpdated);

      this.__canvas_node.style.width = this._size [0] + "px";
      this.__canvas_node.style.height = this._size [1] + "px";
      this.__canvas_node.width = this._size [0] * gl_device_pixel_ratio;
      this.__canvas_node.height = this._size [1] * gl_device_pixel_ratio;    

      this.__draw ();
    }
  }
}

/**
 * @private
 * @function
 */
View.prototype.__draw = function (x, y, width, height) {
  
  if (!util.isNumber (x)) x = 0;
  if (!util.isNumber (y)) y = 0;
  if (!util.isNumber (width)) width = this._size [0] * gl_device_pixel_ratio;
  if (!util.isNumber (height)) height = this._size [1] * gl_device_pixel_ratio;

  if (this.draw) {
    this.draw (this.__canvas_ctx, x, y, width, height);
  }
  
  this.__update_texture ();
}

View.prototype.redraw = function (x, y, width, height)
{
  this.__draw (x, y, width, height);
};

/**
 * @private
 * @function
 */
View.prototype.__update_texture = function () {
  if (this.__text_canvas_node) {
    update_texture (this, this.__text_canvas_node);
  }
  
  if (this.__canvas_node) {
    update_texture (this, this.__canvas_node);
  }
};

View.prototype.__canvas_ctx = null;
View.prototype.__canvas_node = null;
 