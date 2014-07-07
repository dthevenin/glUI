require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();
    
    var view1 = new core.View ({
      position: [20, 40],
      size: [100, 100]
    }).init ();
    this.add (view1);
    view1.style.backgroundColor = core.Color.blue;

    var view2 = new core.View ({
      position: [50, 70],
      size: [300, 300]
    }).init ();
    this.add (view2);
    view2.style.backgroundColor = core.Color.red;

    var text = new core.Text ({
      position: [50, 10],
      size: [200, 30],
      text: "Salut"
    }).init ();
    text.style.color = core.Color.white;
    text.style.fontSize = 50;
    view2.add (text);

    var image = new core.Image ({
      position: [50, 100],
      size: [100, 100],
      src: "imageBis.png"
    }).init ();
//    image.style.color = core.Color.white;
 //   image.style.fontSize = 50;
    view2.add (image);

    var view3 = new core.View ({
      position: [160, 300],
      size: [100, 100]
    }).init ();
    this.add (view3);
    view3.style.backgroundColor = new core.Color (0, 0, 0, 0.4);
    view3.style.backgroundColor.setColorArray (
      0, 1, 0, 0.2,
      0, 1, 0, 1,
      0, 0, 1, 0,
      1, 0, 0, 1
    );

    var view4 = new core.View ({
      position: [150,250],
      size: [200, 100]
    }).init ();
    view2.add (view4);
    view4.style.backgroundColor = new core.Color (0, 0, 0, 0.4);
  }
});

function loadApplication () {
  new Test ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();
});