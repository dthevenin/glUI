require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

  /** parent class */
  parent: core.Application,

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

    this.glView2 = new core.View ({
      position: [50, 50],
      size: [150, 100],
      transformOrigin : [75, 50],
//      scaling: 0.5
    }).init ();
    this.glView2.style.backgroundColor = core.Color.red;
    
    this.glView1 = new core.View ({
      position: [100, 100],
      size: [300, 200],
//       scaling: 0.5
//     transformOrigin : [75, 50]
    }).init ();
    this.add (this.glView1);
    this.glView1.style.backgroundColor = core.Color.blue;

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
  new Test ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();
});