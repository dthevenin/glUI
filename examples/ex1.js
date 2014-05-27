var Test = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLApplication,

  initComponent : function () {
    this._super ();

    var slider = new vs.ui.Slider ({
      position: [50, 50],
      range: [0, 200]
    }).init ();
    this.add (slider);

    this.glView1 = new vs.ui.GLView ({
      position: [50, 70],
      size: [150, 100],
      transformOrigin : [75, 50]
    }).init ();
    this.add (this.glView1);
    this.glView1.style.backgroundColor = GLColor.blue;

    this.glView2 = new vs.ui.GLView ({
      position: [150, 270],
      size: [200, 100],
      transformOrigin : [100, 50]
    }).init ();
    this.add (this.glView2);
    this.glView2.style.backgroundColor = GLColor.red;

//    this.glView2.opacity = 0.4;
    this.glView2.style.opacity = 0.4;

    slider.connect ("value").to (this.glView1, "rotation")
      .to (this.glView1, "translation", function (x) {
        return [[x, 0]];
      });

    slider.connect ("value").to (this.glView2, "rotation");
  }
});

function loadApplication () {
  new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.ui.Application.start ();
}

ACTIVATE_STATS = true