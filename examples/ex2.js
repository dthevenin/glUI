var Test = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLApplication,

  initComponent : function () {
    this._super ();

    var slider1 = new vs.ui.Slider ({
      position: [50, 50],
      range: [0, 90]
    }).init ();
    document.body.appendChild (slider1.view);

    var slider2 = new vs.ui.Slider ({
      position: [50, 20],
      range: [0.3, 2],
      value: 1
    }).init ();
    document.body.appendChild (slider2.view);

    this.glView2 = new vs.ui.GLView ({
      position: [50, 50],
      size: [150, 100],
      transformOrigin : [75, 50],
//      scaling: 0.5
    }).init ();
    this.glView2.style.backgroundColor = GLColor.red;
    
    this.glView1 = new vs.ui.GLView ({
      position: [100, 100],
      size: [300, 200],
//       scaling: 0.5
//     transformOrigin : [75, 50]
    }).init ();
    this.add (this.glView1);
    this.glView1.style.backgroundColor = GLColor.blue;

    this.glView1.add (this.glView2);

    slider1.connect ("value")
//      .to (this.glView1, "rotation")
      .to (this.glView1, "translation", function (x) {
        return [[x, 0]];
      });

    slider1.connect ("value")
      .to (this.glView2, "rotation", function (x) {
        return [[0, 0, x]];
      });

   slider2.connect ("value").to (this.glView1, "scaling");
  }
});

function loadApplication () {
  new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.ui.Application.start ();
}