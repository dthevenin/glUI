var slider1, slider2;
var Test = vs.gl.createClass ({

  /** parent class */
  parent: vs.gl.Application,

  initComponent : function () {
    this._super ();

    slider1 = new vs.ui.Slider ({
      position: [50, 50],
      range: [0, 600],
      value : 69.3
    }).init ();
    document.body.appendChild (slider1.view);

    slider2 = new vs.ui.Slider ({
      position: [50, 20],
      range: [0, 1],
      value: 1.65
    }).init ();
    document.body.appendChild (slider2.view);

    var glView2 = new vs.gl.View ({
      position: [100, 100],
      size: [150, 100],
      transformOrigin : [75, 50],
//      scaling: 0.5
    }).init ();
    glView2.style.backgroundColor = vs.gl.Color.red;
    
    this.add (glView2);
   
    slider2.bind ("continuous_change", this, function (e) {
      mat4.perspective (e.data ,1, -1, 10, jsProjMatrix);
      updateMatrix ();
    });

    slider1.bind ("continuous_change", this, function (e) {
      mat4.identity (jsViewMatrix)
      mat4.translate (jsViewMatrix, [-1,1,-e.data]);
      mat4.scale (jsViewMatrix, [2/ frame_size[0], -2/ frame_size[1], 1]) 
      updateMatrix ();
    });
    
    slider1.refresh ();
    slider2.refresh ();
  }
});

function loadApplication () {
  new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.gl.Application.start ();
}
