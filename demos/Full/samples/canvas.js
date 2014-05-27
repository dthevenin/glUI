var CanvasDemo = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLCanvas,

  draw : function (x, y, width, height) {
    var
      r = Math.floor (256*Math.random()),
      g = Math.floor (256*Math.random()),
      b = Math.floor (256*Math.random());
      
    this.c_fillStyle = "rgb("+r+","+g+","+b+")";
    var radius = 50 * Math.random();
    var
      x = radius + Math.random() * (width-2*radius),
      y = radius + Math.random() * (height-2*radius);
      
    this.c_beginPath();
    this.c_arc (
      x * gl_device_pixel_ratio,
      y * gl_device_pixel_ratio,
      radius * gl_device_pixel_ratio,
      0, 2 * Math.PI, false
    );
    this.c_fill ();
    
    this.__update_texture ();
  },

  runDemo : function () { 
    var canvas = this;
    
    this.__interval = setInterval (function () {
      canvas.draw (0, 0, canvas._size [0], canvas._size [1]);
    }, 100);
  },

  stopDemo : function () {
    clearInterval (this.__interval);
    this.__interval = 0;
  }
});