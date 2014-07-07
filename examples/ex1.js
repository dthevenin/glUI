require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    var slider = new vs.ui.Slider ({
      position: [50, 50],
      range: [0, 200]
    }).init ();
    this.add (slider);

    this.glView1 = new core.View ({
      position: [50, 70],
      size: [150, 100],
      transformOrigin : [75, 50]
    }).init ();
    this.add (this.glView1);
    this.glView1.style.backgroundColor = core.Color.blue;

    this.glView2 = new core.View ({
      position: [150, 270],
      size: [200, 100],
      transformOrigin : [100, 50]
    }).init ();
    this.add (this.glView2);
    this.glView2.style.backgroundColor = core.Color.red;

//    this.glView2.opacity = 0.4;
    this.glView2.style.opacity = 0.4;

    slider.connect ("value").to (this.glView1, "rotation")
      .to (this.glView1, "translation", function (x) {
        return [[x, 0]];
      });

    slider.connect ("value").to (this.glView2, "rotation");

//     for (var i = 0; i < 100; i++) {
//     index = 10 * i;
//     view = new core.View ({
//       position: [150 + index, 270 + index],
//       size: [200, 100],
//       transformOrigin : [100, 50]
//     }).init ();
//     this.add (view);
//     view.style.backgroundColor = core.Color.red;
//     }
  }
});

function loadApplication () {
  new Test ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();
});