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

/**
 *  The vs.gl.Canvas class
 *
 *  @extends vs.ui.View
 *  @class
 *  The vs.gl.Canvas class is a subclass of vs.ui.View that allows you to easily draw
 *  arbitrary content within your HTML content.
 *  <p>
 *  When you instantiate the vs.gl.Canvas class you should reimpletement the draw method.
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.gl.Canvas.
 * @name vs.gl.Canvas
 *
 *  @example
 *  var myCanvas = new vs.gl.Canvas (config);
 *  myCanvas.init ();
 *
 *  myCanvas.draw = function (x, y, width, height)
 *  {
 *    this.c_clearRect (x, y, width, height)
 *    this.c_fillStyle = "rgb(200,0,0)";
 *    this.c_fillStyle = "rgba(0, 0, 200, 0.5)";
 *
 *    ...
 *    
 *  };
 *
 *  // other way to use vs.gl.Canvas
 *  myCanvas.moveTo(100,100).lineTo(200,200,100,200).closePath().stroke();
 *
 * @param {Object} config The configuration structure [mandatory]
*/
function Canvas (config)
{
  this.parent = View;
  this.parent (config);
  this.constructor = Canvas;
}

Canvas.prototype = {

  /**
   *
   * @protected
   * @type {CanvasRenderingContext2D|null}
   */
  __canvas_ctx: null,
  
  /**
   *
   * @protected
   * @type {HTMLCanvasElement|null}
   */
  __canvas_node: null,
  
/*****************************************************************
 *
 ****************************************************************/
  
  /**
   * @protected
   * @function
   */
  initComponent : function ()
  {
    View.prototype.initComponent.call (this);
    
    this.__canvas_node = create2DCanvas (this._size [0], this._size [1]);
    this.__canvas_ctx = this.__canvas_node.getContext ('2d');
    
    this.draw (0, 0,
      this._size [0] * gl_device_pixel_ratio,
      this._size [1] * gl_device_pixel_ratio
    );

    var self = this;
    this.addEventListener ('webglcontextrestored', function () {
      update_texture (self, self.__canvas_node);
    });
  },
  
  /**
   * @protected
   * @function
   * This function cost a lot!
   */
  _updateSizeAndPos : function ()
  {
    View.prototype._updateSizeAndPos.call (this);

    this.__canvas_node.style.width = this._size [0] + "px";
    this.__canvas_node.style.height = this._size [1] + "px";
    this.__canvas_node.width = this._size [0] * gl_device_pixel_ratio;
    this.__canvas_node.height = this._size [1] * gl_device_pixel_ratio;    
    this.draw (0, 0, this._size [0] * gl_device_pixel_ratio, this._size [1] * gl_device_pixel_ratio);
  },
  
  __update_texture : function () {
    update_texture (this, this.__canvas_node);
  },
  
  /**
   *
   * @name vs.gl.Canvas#getContext
   * @function
   * @return {CanvasRenderingContext2D} the canvas context
   */
  getContext: function ()
  {
    return this.__canvas_ctx;
  },
  
  /**
   * This method draws a rectangle.
   * <p/>
   * With 4 arguments, it works just like the 2D method. An optional
   * 5th argument specifies a radius for rounded corners. An optional
   * 6th argument specifies a clockwise rotation about (x,y).
   *
   * @name vs.gl.Canvas#drawRect
   * @function
   *
   * @param {number} x The x position
   * @param {number} y The y position
   * @param {number} w The rectangle width
   * @param {number} h The rectangle height
   * @param {number} radius The rectangle radius
   * @param {number} rotation The rectangle rotation
   */
  drawRect : function (x, y, w, h, radius, rotation)
  {
    if (arguments.length === 4)
    {
      // square corners, no rotation
      this.c_rect (x, y, w, h).stroke ();
    }
    else
    {
      if (!rotation)
      {
        // Rounded corners, no rotation
        this.c_polygon (x, y, x + w, y, x + w, y + h, x, y + h, radius);
      }
      else
      {
        // Rotation with or without rounded corners
        var sr = Math.sin (rotation), cr = Math.cos (rotation),
          points = [x,y], p = this.rotatePoint (w, 0, rotation);
          
        points.push (x + p [0], y + p [1]);
        p = this.rotatePoint (w, h, rotation);
        points.push (x + p [0], y + p [1]);
        p = this.rotatePoint (0, h, rotation);
        points.push (x + p [0], y + p [1]);
        if (radius) { points.push (radius); }
        
        this.c_polygon.apply (this, points);
      }
    }
    // The polygon() method handles setting the current point
    return this;
  },
  
  /**
   * @protected
   * @function
   */
  rotatePoint : function (x, y, angle)
  {
    return [x * Math.cos (angle) - y * Math.sin (angle),
            y * Math.cos (angle) + x * Math.sin (angle)];
  },

  /**
   * This method connects the specified points as a polygon.  It requires
   * at least 6 arguments (the coordinates of 3 points).  If an odd 
   * number of arguments are passed, the last one is taken as a corner
   * radius.
   *
   * @example
   *  var myCanvas = new vs.gl.Canvas (config);
   *  myCanvas.init ();
   *
   *  // draw a triangle
   *  myCanvas.c_polygon (100, 100, 50, 150, 300, 300);
   *
   * @name vs.gl.Canvas#c_polygon
   * @function
   * @param {...number} list of number
   */
  c_polygon : function ()
  {
    // Need at least 3 points for a polygon
    if (arguments.length < 6) { throw new Error("not enough arguments"); }

    var i, radius, n, x0, y0;
    
    this.c_beginPath ();

    if (arguments.length % 2 === 0)
    {
      this.c_moveTo (arguments [0], arguments [1]);
     
      for (i = 2; i < arguments.length; i += 2)
      {
        this.c_lineTo (arguments [i], arguments [i + 1]);
      }
    }
    else
    {
      // If the number of args is odd, then the last is corner radius
      radius = arguments [arguments.length - 1];
      n = (arguments.length - 1) / 2;

      // Begin at the midpoint of the first and last points
      x0 = (arguments [n * 2 - 2] + arguments [0]) /2;
      y0 = (arguments [n * 2 - 1] + arguments [1]) /2;
      this.c_moveTo (x0, y0);
      
      // Now arcTo each of the remaining points
      for (i = 0; i < n - 1; i++)
      {
        this.c_arcTo
          (arguments [i * 2], arguments [i * 2 + 1],
           arguments [i * 2 + 2], arguments [i * 2 + 3], radius);
      }
      // Final arcTo back to the start
      this.c_arcTo
        (arguments [n * 2 - 2], arguments [n * 2 - 1],
         arguments [0], arguments [1], radius);
    }

    this.c_closePath ();
    this.c_moveTo (arguments [0], arguments [1]);
    this.c_stroke ();
    return this;
  },

  /**
   * This method draws elliptical arcs as well as circular arcs.
   *
   * @name vs.gl.Canvas#c_ellipse
   * @function
   * @example
   *  var myCanvas = new Canvas (config);
   *  myCanvas.init ();
   *
   *  myCanvas.c_ellipse (100, 100, 50, 150, Math.PI/5, 0, Math.PI);
   *
   * @param {number} cx The X coordinate of the center of the ellipse
   * @param {number} cy The Y coordinate of the center of the ellipse
   * @param {number} rx The X radius of the ellipse
   * @param {number} ry The Y radius of the ellipse
   * @param {number} rotation The clockwise rotation about (cx,cy).
   *       The default is 0.
   * @param {number} sa The start angle; defaults to 0
   * @param {number} ea The end angle; defaults to 2pi
   * @param {boolean} anticlockwise The arc direction. The default
   *        is false, which means clockwise
   */
  c_ellipse : function (cx, cy, rx, ry, rotation, sa, ea, anticlockwise)
  {
    if (rotation === undefined) { rotation = 0;}
    if (sa === undefined) { sa = 0; }
    if (ea === undefined) { ea = 2 * Math.PI; }
      
    if (anticlockwise === undefined) { anticlockwise = false; }

    // compute the start and end points
    var sp =
      this.rotatePoint (rx * Math.cos (sa), ry * Math.sin (sa), rotation),
      sx = cx + sp[0], sy = cy + sp[1],
      ep = this.rotatePoint (rx * Math.cos (ea), ry * Math.sin (ea), rotation),
      ex = cx + ep[0], ey = cy + ep[1];
    
    this.c_moveTo (sx, sy);

    this.c_translate (cx, cy);
    this.c_rotate (rotation);
    this.c_scale (rx / ry, 1);
    this.c_arc (0, 0, ry, sa, ea, anticlockwise);
    this.c_scale (ry / rx, 1);
    this.c_rotate (-rotation);
    this.c_translate (-cx, -cy);
    
    this.c_stroke ();
    
    return this;
  },
  
  /**
   * vs.gl.Canvas draw method.
   * Should be reimplement when you instanciate a vs.gl.Canvas object.
   *
   * @name vs.gl.Canvas#draw
   * @function
   *
   * @param {number} x The top position of the canvas; Default = 0
   * @param {number} y The left position of the canvas; Default = 0
   * @param {number} width The width of the canvas; Default = canvas's width
   * @param {number} height The height of the canvas; Default = canvas's height
   */
  draw : function (x, y, width, height)
  {
    if (!x) { x = 0; }
    if (!y) { y = 0; }
    if (!width) { width = this._size [0] * gl_device_pixel_ratio; }
    if (!height) { height = this._size [1] * gl_device_pixel_ratio; }
    
    var p_ratio = gl_device_pixel_ratio;
    
    this.c_clearRect (x, y, width, height);
      
    this.c_lineWidth = 3;
    this.c_shadowColor = 'white';
    this.c_shadowBlur = 1;
    
    var i, x1, y1, x2, y2;
    
    for (i = 0; i < 10; i++)
    {
      this.c_strokeStyle = 'rgb(' + 
        Math.floor (Math.random () * 255) + ',' + 
        Math.floor (Math.random () * 255) + ',' + 
        Math.floor (Math.random () * 255) +')';
      
      x1 = Math.floor (Math.random() * width);
      y1 = Math.floor (Math.random() * height);
  
      x2 = Math.floor (Math.random() * width);
      y2 = Math.floor (Math.random() * height);
  
      this.c_beginPath ();
      this.c_moveTo (x1 * p_ratio, y1 * p_ratio);
      this.c_lineTo (x2 * p_ratio, y2 * p_ratio);
      this.c_closePath ();
      this.c_stroke ();
    }
    
    this.__update_texture ();
  }
};
util.extendClass (Canvas, View);

/**
 * @private
 */
Canvas.methods =   
  ['arc','arcTo','beginPath','bezierCurveTo','clearRect','clip',  
  'closePath','createImageData','createLinearGradient','createRadialGradient',  
  'createPattern','drawFocusRing','drawImage','fill', 'fillRect','fillText',  
  'getImageData','isPointInPath','lineTo','measureText','moveTo','putImageData',  
  'quadraticCurveTo','rect','restore','rotate','save','scale','setTransform',  
  'stroke','strokeRect','strokeText','transform','translate'];
  
/**
 * @private
 */
Canvas.props =
  ['canvas','fillStyle','font','globalAlpha','globalCompositeOperation',  
  'lineCap','lineJoin','lineWidth','miterLimit','shadowOffsetX','shadowOffsetY',  
  'shadowBlur','shadowColor','strokeStyle','textAlign','textBaseline'];

/**
 * @private
 */
Canvas.setup = function ()
{
  var i, m, p;
  for (i = 0; i < Canvas.methods.length; i++)
  {
    m = Canvas.methods [i];  
    Canvas.prototype ["c_" + m] = (function (m)
    {
      return function ()
      { // 9 args is most in API  
        this.__canvas_ctx [m].apply (this.__canvas_ctx, arguments);  
        return this;  
      };
    }(m));  
  } 

  for (i = 0; i < Canvas.props.length; i++)
  {  
    p = Canvas.props [i];
    
    var d = {};
    
    d.enumerable = true; 
    d.set = (function (p)
    {
      return function (value)
      {
        this.__canvas_ctx [p] = value;
      };
    }(p));
    
    d.get = (function (p)
    {
      return function ()
      {
        return this.__canvas_ctx [p];
      };
    }(p));

    util.defineProperty (Canvas.prototype, "c_" + p, d);
  }  
};

Canvas.setup ();

/********************************************************************
                      Export
*********************************************************************/
/** @private */
gl.Canvas = Canvas;

/********************************************************************
                   Documentation
********************************************************************/

/**
 * Adds points to the subpath such that the arc described by the circumference 
 * of the circle described by the arguments, starting at the given start angle 
 * and ending at the given end angle, going in the given direction (defaulting * 
 * to clockwise), is added to the path, connected to the previous point by a 
 * straight line.
 * @name vs.gl.Canvas#c_arc
 * @function
 */

/**
 * Adds an arc with the given control points and radius to the current subpath, 
 * connected to the previous point by a straight line.
 * @name vs.gl.Canvas#c_arcTo
 * @function
 */

/**
 * Resets the current path.
 * @name vs.gl.Canvas#c_beginPath
 * @function
 */

/**
 * Adds the given point to the current subpath, connected to the previous one by 
 * a cubic Bézier curve with the given control points.
 * @name vs.gl.Canvas#c_bezierCurveTo
 * @function
 */

/**
 * Clears all pixels on the canvas in the given rectangle to transparent black.
 * @name vs.gl.Canvas#c_clearRect
 * @function
 */

/**
 * Further constrains the clipping region to the given path.
 * @name vs.gl.Canvas#c_clip
 * @function
 */

/**
 * Marks the current subpath as closed, and starts a new subpath with a point 
 * the same as the start and end of the newly closed subpath.
 * @name vs.gl.Canvas#c_closePath
 * @function
 */

/**
 * Returns an ImageData object with the given dimensions in CSS pixels (which 
 * might map to a different number of actual device pixels exposed by the object 
 * itself). All the pixels in the returned object are transparent black.
 * @name vs.gl.Canvas#c_createImageData
 * @function
 */

/**
 * Returns a CanvasGradient object that represents a linear gradient that paints 
 * along the line given by the coordinates represented by the arguments.
 * If any of the arguments are not finite numbers, throws a NotSupportedError 
 * exception.
 * @name vs.gl.Canvas#c_createLinearGradient
 * @function
 */

/**
 * Returns a CanvasGradient object that represents a radial gradient that paints 
 * along the cone given by the circles represented by the arguments.
 * If any of the arguments are not finite numbers, throws a NotSupportedError 
 * exception. If either of the radii are negative, throws an IndexSizeError 
 * exception.
 * @name vs.gl.Canvas#c_createRadialGradient
 * @function
 */

/**
 * Returns a CanvasPattern object that uses the given image and repeats in the 
 * direction(s) given by the repetition argument.
 * @name vs.gl.Canvas#c_createPattern
 * @function
 */

/**
 * @name vs.gl.Canvas#c_drawFocusRing
 * @function
 */

/**
 * Draws the given image onto the canvas.
 * @name vs.gl.Canvas#c_drawImage
 * @function
 */

/**
 * @name vs.gl.Canvas#c_fill
 * @function
 */

/**
 * Paints the given rectangle onto the canvas, using the current fill style.
 * @name vs.gl.Canvas#c_fillRect
 * @function
 */

/**
 * Fills the given text at the given position. If a maximum width is provided, 
 * the text will be scaled to fit that width if necessary.
 * @name vs.gl.Canvas#c_fillText
 * @function
 */

/**
 * Returns an ImageData object containing the image data for the given rectangle 
 * of the canvas.
 * @name vs.gl.Canvas#c_getImageData
 * @function
 */

/**
 * Returns true if the given point is in the current path.
 * @name vs.gl.Canvas#c_isPointInPath
 * @function
 */

/**
 * Adds the given point to the current subpath, connected to the previous one by 
 * a straight line.
 * @name vs.gl.Canvas#c_lineTo
 * @function
 */

/**
 * Returns a TextMetrics object with the metrics of the given text in the 
 * current font.
 * @name vs.gl.Canvas#c_measureText
 * @function
 */

/**
 * Creates a new subpath with the given point.
 * @name vs.gl.Canvas#c_moveTo
 * @function
 */

/**
 * Paints the data from the given ImageData object onto the canvas. If a dirty 
 * rectangle is provided, only the pixels from that rectangle are painted.
 * @name vs.gl.Canvas#c_putImageData
 * @function
 */

/**
 * Adds the given point to the current subpath, connected to the previous one by 
 * a quadratic Bézier curve with the given control point.
 * @name vs.gl.Canvas#c_quadraticCurveTo
 * @function
 */

/**
 * Adds a new closed subpath to the path, representing the given rectangle.
 * @name vs.gl.Canvas#c_rect
 * @function
 */

/**
 * Pops the top state on the stack, restoring the context to that state.
 * @name vs.gl.Canvas#c_restore
 * @function
 */

/**
 * Changes the transformation matrix to apply a rotation transformation with the 
 * given characteristics. The angle is in radians.
 * @name vs.gl.Canvas#c_rotate
 * @function
 */

/**
 * Pushes the current state onto the stack.
 * @name vs.gl.Canvas#c_save
 * @function
 */

/**
 * Changes the transformation matrix to apply a scaling transformation with the 
 * given characteristics.
 * @name vs.gl.Canvas#c_scale
 * @function
 */

/**
 * Changes the transformation matrix to the matrix given by the arguments as 
 * described below.
 * @name vs.gl.Canvas#c_setTransform
 * @function
 */

/**
 * Strokes the subpaths with the current stroke style.
 * @name vs.gl.Canvas#c_stroke
 * @function
 */

/**
 * Paints the box that outlines the given rectangle onto the canvas, using the 
 * current stroke style.
 * @name vs.gl.Canvas#c_strokeRect
 * @function
 */

/**
 * Strokes the given text at the given position. If a maximum width is provided, 
 * the text will be scaled to fit that width if necessary.
 * @name vs.gl.Canvas#c_strokeText
 * @function
 */

/**
 * Changes the transformation matrix to apply the matrix given by the arguments 
 * as described below.
 * @name vs.gl.Canvas#c_transform
 * @function
 */

/**
 * Changes the transformation matrix to apply a translation transformation with 
 * the given characteristics.
 * @name vs.gl.Canvas#c_translate
 * @function
 */

/**
 * Returns the canvas element.
 * @name vs.gl.Canvas#c_canvas
 */

/**
 * Can be set, to change the fill style.
 * <br />
 * Returns the current style used for filling shapes.
 * @name vs.gl.Canvas#c_fillStyle
 */

/**
 * Can be set, to change the font. The syntax is the same as for the CSS 'font' 
 * property; values that cannot be parsed as CSS font values are ignored.
 * <br />
 * Returns the current font settings
 * @name vs.gl.Canvas#c_font
 */

/**
 * Can be set, to change the alpha value. Values outside of the range 0.0 .. 1.0 
 * are ignored.
 * <br />
 * Returns the current alpha value applied to rendering operations.
 * @name vs.gl.Canvas#c_globalAlpha
 */

/**
 * Can be set, to change the composition operation. Unknown values are ignored.
 * <br />
 * Returns the current composition operation, from the list below.
 * @name vs.gl.Canvas#c_globalCompositeOperation
 */

/**
 * Can be set, to change the line cap style.
 * <br />
 * Returns the current line cap style.
 * @name vs.gl.Canvas#c_lineCap
 */

/**
 * Can be set, to change the line join style.
 * <br />
 * Returns the current line join style.
 * @name vs.gl.Canvas#c_lineJoin
 */

/**
 * Can be set, to change the miter limit ratio. Values that are not finite 
 * values greater than zero are ignored.
 * <br />
 * Returns the current miter limit ratio.
 * @name vs.gl.Canvas#c_miterLimit
 */

/**
 * Can be set, to change the line width. Values that are not finite values 
 * greater than zero are ignored.
 * Returns the current line width.
 * @name vs.gl.Canvas#c_lineWidth
 */

/**
 * Can be set, to change the shadow offset. Values that are not finite numbers 
 * are ignored.
 * <br />
 * Returns the current shadow offset.
 * @name vs.gl.Canvas#c_shadowOffsetX
 */

/**
 * Can be set, to change the shadow offset. Values that are not finite numbers 
 * are ignored.
 * <br />
 * Returns the current shadow offset.
 * @name vs.gl.Canvas#c_shadowOffsetY
 */

/**
 * Can be set, to change the blur level. Values that are not finite numbers 
 * greater than or equal to zero are ignored.
 * <br />
 * Returns the current level of blur applied to shadows.
 * @name vs.gl.Canvas#c_shadowBlur
 */

/**
 * Can be set, to change the shadow color. Values that cannot be parsed as CSS 
 * colors are ignored.
 * <br />
 * Returns the current shadow color.
 * @name vs.gl.Canvas#c_shadowColor
 */

/**
 * Can be set, to change the stroke style.
 * <br />
 * Returns the current style used for stroking shapes.
 * @name vs.gl.Canvas#c_strokeStyle
 */

/**
 * Can be set, to change the alignment. The possible values are start, end, 
 * left, right, and center. Other values are ignored. The default is start.
 * Returns the current text alignment settings.
 * @name vs.gl.Canvas#c_textAlign
 */

/**
 * Can be set, to change the baseline alignment. The possible values and their 
 * meanings are given below. Other values are ignored. The default is 
 * alphabetic.
 * <br />
 * Returns the current baseline alignment settings.
 * @name vs.gl.Canvas#c_textBaseline
 */
 