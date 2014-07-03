var Test = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.Application,

  initComponent : function () {
    this._super ();

    var slider1 = new vs.ui.Slider ({
      position: [50, 50],
      range: [0, 200]
    }).init ();
    document.body.appendChild (slider1.view);

    var slider2 = new vs.ui.Slider ({
      position: [50, 20],
      range: [0.3, 5],
      value: 1
    }).init ();
    document.body.appendChild (slider2.view);

    this.canvas = new vs.gl.Canvas ({
      position: [100, 100],
      size: [256, 256],
      transformOrigin : [140, 75]
    });
    
    this.canvas.draw = function (x, y, width, height) {
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
      this.c_arc (x,y, radius, 0, 2 * Math.PI, false);
      this.c_fill ();
      
      this.__update_texture ();
    }

    this.canvas.init ();
    this.add (this.canvas);
    canvas = this.canvas;
    
    setInterval (function () {
      canvas.draw (0, 0, canvas._size [0], canvas._size [1]);
    }, 100);
    
    slider1.connect ("value").to (this.canvas, "rotation", function (x) {
        return [[0, 0, x]];
      });
    slider2.connect ("value").to (this.canvas, "scaling");
  }
});

function loadApplication () {
  new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.gl.Application.start ();
}
